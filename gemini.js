/* =========================================================
   gemini.js — thin wrapper around the Gemini REST API.
   All AI feature functions in app.js call through here.
   The API key lives only in memory (window.__GEMINI_KEY__),
   never in localStorage/sessionStorage, and is cleared on reload.
 
   SECURITY NOTE (shown to the user in the Settings modal too):
   Calling Gemini directly from browser JS exposes the API key
   to anyone who opens dev tools. That's an acceptable trade-off
   for a local demo, but a real deployment must proxy these calls
   through the Django backend (see apps/ai_services in the
   architecture doc) so the key never reaches the client.
   ========================================================= */

const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

let __GEMINI_KEY__ = '';

function setGeminiKey(key) {
  __GEMINI_KEY__ = (key || '').trim();
}

function hasGeminiKey() {
  return !!__GEMINI_KEY__;
}

/**
 * Calls Gemini's generateContent endpoint.
 * @param {string} prompt - the full prompt text
 * @param {boolean} jsonMode - if true, asks Gemini to return raw JSON
 * @returns {Promise<string>} the raw text response
 */
async function callGemini(prompt, jsonMode) {
  if (!__GEMINI_KEY__) {
    throw new Error('No Gemini API key set. Click "Gemini key" in the top bar to add one.');
  }

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2048
    }
  };
  if (jsonMode) {
    body.generationConfig.responseMimeType = 'application/json';
  }

  let res;
  try {
    res = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': __GEMINI_KEY__
      },
      body: JSON.stringify(body)
    });
  } catch (networkErr) {
    throw new Error('Could not reach the Gemini API. Check your internet connection.');
  }

  if (!res.ok) {
    let detail = '';
    try {
      const errJson = await res.json();
      detail = errJson?.error?.message || '';
    } catch (_) { /* ignore parse failure */ }
    throw new Error(`Gemini API error (${res.status}). ${detail}`);
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];
  if (!candidate) {
    throw new Error('Gemini returned no content — the prompt may have been blocked by safety filters.');
  }
  const text = candidate.content?.parts?.map(p => p.text || '').join('') || '';
  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }
  return text;
}

/**
 * Calls Gemini expecting JSON and parses it, stripping code fences
 * if the model added them despite responseMimeType.
 */
async function callGeminiJSON(prompt) {
  const raw = await callGemini(prompt, true);
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error('Gemini response was not valid JSON. Try again.');
  }
}

/* ============ Feature-specific prompt builders ============ */

const GeminiFeatures = {
  async atsScore(resumeText, jobDescription) {
    const prompt = `You are an ATS (Applicant Tracking System) resume scorer used in a campus recruitment platform.
Score the following resume against the target job description (or general professional standards if no job description is given).
 
RESUME:
"""${resumeText}"""
 
JOB DESCRIPTION (may be empty):
"""${jobDescription || 'No specific job — score generally for a professional new-grad/early-career résumé.'}"""
 
Return ONLY a JSON object with this exact shape, no commentary:
{
  "score": <integer 0-100>,
  "matched_keywords": [<strings>],
  "missing_keywords": [<strings>],
  "formatting_issues": [<strings>],
  "summary": "<2-3 sentence plain-language summary>"
}`;
    return callGeminiJSON(prompt);
  },

  async extractSkills(resumeText) {
    const prompt = `Extract technical and professional skills from this résumé text. For each skill, estimate a confidence score between 0 and 1 based on how clearly it's evidenced (mentioned with context/projects = higher confidence).
 
RESUME:
"""${resumeText}"""
 
Return ONLY a JSON object:
{
  "skills": [{ "name": "<skill>", "confidence": <0-1 number> }],
  "estimated_experience_level": "<entry-level | intermediate | experienced>"
}`;
    return callGeminiJSON(prompt);
  },

  async recommendJobs(studentSkills, studentDept, jobList) {
    const jobsSummary = jobList.map(j => ({
      id: j.id,
      title: j.title,
      department_fit: j.eligibleDepartments,
      required_skills: j.skills
    }));
    const prompt = `A student (department: ${studentDept}) has these extracted skills: ${JSON.stringify(studentSkills)}.
Here is a shortlist of open jobs already filtered for eligibility: ${JSON.stringify(jobsSummary)}.
 
Rank these jobs by fit for this student and briefly explain why for each. Return ONLY JSON:
{
  "ranked": [{ "job_id": <id>, "fit_score": <0-100>, "reason": "<one sentence>" }]
}`;
    return callGeminiJSON(prompt);
  },

  async resumeSuggestions(resumeText, jobDescription) {
    const prompt = `Review this résumé and suggest concrete improvements. Where possible, give a "before" (a real weak line from the résumé, quoted briefly) and "after" (an improved rewrite).
 
RESUME:
"""${resumeText}"""
 
TARGET JOB (may be empty):
"""${jobDescription || 'General professional resume best practices.'}"""
 
Return ONLY JSON:
{
  "suggestions": [{ "issue": "<what's weak>", "before": "<short original line>", "after": "<rewritten line>" }],
  "overall_advice": "<2-3 sentences>"
}`;
    return callGeminiJSON(prompt);
  },

  async generateQuestions(role, skills, difficulty) {
    const prompt = `Generate 5 interview questions for the role "${role}" focused on these skills: ${skills.join(', ') || 'general fit for the role'}.
Difficulty level: ${difficulty}. Mix technical, behavioral, and situational questions.
 
Return ONLY JSON:
{
  "questions": [{ "id": "<short id like q1>", "category": "<technical|behavioral|situational>", "question": "<the question text>" }]
}`;
    return callGeminiJSON(prompt);
  },

  async evaluateAnswer(question, answer, role) {
    const prompt = `You are an interview coach. A candidate is practicing for the role "${role}".
 
Question: "${question}"
Candidate's answer: "${answer}"
 
Evaluate the answer. Return ONLY JSON:
{
  "score": <0-100>,
  "clarity": "<one sentence>",
  "technical_accuracy": "<one sentence, or 'n/a' for non-technical questions>",
  "improvement_tips": ["<tip 1>", "<tip 2>"],
  "sample_better_answer": "<a short model answer, 2-4 sentences>"
}`;
    return callGeminiJSON(prompt);
  }
};