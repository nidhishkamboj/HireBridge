/* =========================================================
   app.js — state, mock data, rendering and interactions for
   all three portals. This is a front-end-only demo: "backend"
   behaviour (matching, persistence, email sending) is simulated
   in memory. See the architecture doc for how this maps onto
   Django + MySQL + Celery in a real deployment.
   ========================================================= */

/* ---------------- IDs ---------------- */
let _jobId = 100, _appId = 500, _interviewId = 700, _emailId = 900, _companyId = 10, _studentId = 50;

/* ---------------- Seed data ---------------- */

const STATE = {
  companies: [
    { id: 1, name: 'NimbusCloud Technologies', industry: 'Cloud Infrastructure', verified: true },
    { id: 2, name: 'Verdant Analytics', industry: 'Data & AI', verified: true },
    { id: 3, name: 'Ferroline Motors', industry: 'Automotive Engineering', verified: true },
    { id: 4, name: 'BrightLedger Fintech', industry: 'Fintech', verified: false }
  ],

  jobs: [
    { id: 1, companyId: 1, title: 'Backend Engineer — New Grad', description: 'Build and scale REST services powering our cloud platform.', skills: ['Python', 'Django', 'SQL', 'REST APIs'], minCgpa: 7.0, maxBacklogs: 0, eligibleDepartments: ['Computer Science', 'Information Technology'], package: 9.5, jobType: 'full_time', status: 'open', postedBy: 'Meera Iyer', deadline: '2026-08-15' },
    { id: 2, companyId: 1, title: 'Cloud Support Intern', description: 'Assist enterprise customers with platform onboarding and troubleshooting.', skills: ['Linux', 'Networking', 'Communication'], minCgpa: 6.5, maxBacklogs: 1, eligibleDepartments: [], package: 4.0, jobType: 'internship', status: 'open', postedBy: 'Meera Iyer', deadline: '2026-08-01' },
    { id: 3, companyId: 2, title: 'Data Analyst', description: 'Turn raw operational data into decision-ready dashboards for clients.', skills: ['SQL', 'Python', 'Statistics', 'Excel'], minCgpa: 7.5, maxBacklogs: 0, eligibleDepartments: ['Data Science', 'Computer Science', 'Information Technology'], package: 8.0, jobType: 'full_time', status: 'open', postedBy: 'Karan Bhatt', deadline: '2026-08-20' },
    { id: 4, companyId: 2, title: 'ML Engineer Intern + PPO', description: 'Prototype recommendation models under the guidance of senior scientists.', skills: ['Python', 'Machine Learning', 'PyTorch'], minCgpa: 8.0, maxBacklogs: 0, eligibleDepartments: ['Data Science', 'Computer Science'], package: 6.5, jobType: 'ppo', status: 'open', postedBy: 'Karan Bhatt', deadline: '2026-08-10' },
    { id: 5, companyId: 3, title: 'Mechanical Design Engineer', description: 'Design and validate powertrain components using CAD/CAE tools.', skills: ['SolidWorks', 'AutoCAD', 'GD&T'], minCgpa: 6.8, maxBacklogs: 1, eligibleDepartments: ['Mechanical'], package: 7.0, jobType: 'full_time', status: 'open', postedBy: 'Priya Nair', deadline: '2026-08-25' },
    { id: 6, companyId: 3, title: 'Embedded Systems Intern', description: 'Work on firmware for next-gen vehicle telemetry units.', skills: ['C', 'Embedded C', 'Microcontrollers'], minCgpa: 7.0, maxBacklogs: 0, eligibleDepartments: ['Electronics', 'Mechanical'], package: 4.5, jobType: 'internship', status: 'open', postedBy: 'Priya Nair', deadline: '2026-07-30' }
  ],

  students: [
    { id: 1, name: 'Rhea Kapoor', department: 'Computer Science', gradYear: 2026, cgpa: 8.4, backlogs: 0, skills: ['Python', 'Django', 'SQL'], isMe: false },
    { id: 2, name: 'Aditya Menon', department: 'Information Technology', gradYear: 2026, cgpa: 7.2, backlogs: 0, skills: ['Java', 'SQL', 'REST APIs'], isMe: false },
    { id: 3, name: 'Sana Sheikh', department: 'Data Science', gradYear: 2026, cgpa: 8.9, backlogs: 0, skills: ['Python', 'Machine Learning', 'Statistics'], isMe: false },
    { id: 4, name: 'Devraj Patil', department: 'Mechanical', gradYear: 2026, cgpa: 6.9, backlogs: 1, skills: ['SolidWorks', 'AutoCAD'], isMe: false },
    { id: 5, name: 'Ishita Kulkarni', department: 'Electronics', gradYear: 2026, cgpa: 7.6, backlogs: 0, skills: ['Embedded C', 'C', 'Microcontrollers'], isMe: false },
    { id: 6, name: 'Farhan Ali', department: 'Computer Science', gradYear: 2026, cgpa: 7.0, backlogs: 2, skills: ['Python', 'SQL'], isMe: false },
    { id: 7, name: 'Neha Joshi', department: 'Data Science', gradYear: 2026, cgpa: 8.1, backlogs: 0, skills: ['Python', 'PyTorch', 'Statistics'], isMe: false },
    { id: 8, name: 'Om Prakash', department: 'Mechanical', gradYear: 2026, cgpa: 7.4, backlogs: 0, skills: ['SolidWorks', 'GD&T'], isMe: false }
  ],

  applications: [
    { id: 1, studentId: 1, jobId: 1, status: 'hired', appliedAt: '2026-06-02' },
    { id: 2, studentId: 2, jobId: 1, status: 'interview', appliedAt: '2026-06-05' },
    { id: 3, studentId: 3, jobId: 4, status: 'hired', appliedAt: '2026-06-01' },
    { id: 4, studentId: 7, jobId: 3, status: 'shortlisted', appliedAt: '2026-06-10' },
    { id: 5, studentId: 4, jobId: 5, status: 'hired', appliedAt: '2026-05-28' },
    { id: 6, studentId: 8, jobId: 5, status: 'rejected', appliedAt: '2026-06-03' },
    { id: 7, studentId: 5, jobId: 6, status: 'interview', appliedAt: '2026-06-07' },
    { id: 8, studentId: 6, jobId: 1, status: 'applied', appliedAt: '2026-06-12' }
  ],

  interviews: [
    { id: 1, applicationId: 2, scheduledAt: '2026-07-22T11:00', mode: 'online', link: 'https://meet.example.com/nimbus-2', interviewer: 'Meera Iyer', status: 'scheduled' },
    { id: 2, applicationId: 7, scheduledAt: '2026-07-24T15:30', mode: 'online', link: 'https://meet.example.com/ferroline-7', interviewer: 'Priya Nair', status: 'scheduled' }
  ],

  emailLog: [],

  // session
  currentRole: null,
  currentStudentId: null,
  currentRecruiter: null, // { name, companyId }
  resumeText: '',
  extractedSkills: [],
  mockSession: null,
  chartInstances: {}
};

/* ---------------- helpers ---------------- */

const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

function companyName(id) {
  const c = STATE.companies.find(c => c.id === id);
  return c ? c.name : 'Unknown company';
}
function jobById(id) { return STATE.jobs.find(j => j.id === Number(id)); }
function studentById(id) { return STATE.students.find(s => s.id === Number(id)); }

function currentStudent() { return studentById(STATE.currentStudentId); }

function eligibleForJob(student, job) {
  const reasons = [];
  if (student.cgpa < job.minCgpa) reasons.push(`CGPA ${student.cgpa} is below the required ${job.minCgpa}`);
  if (student.backlogs > job.maxBacklogs) reasons.push(`${student.backlogs} backlog(s) exceeds the allowed ${job.maxBacklogs}`);
  if (job.eligibleDepartments.length && !job.eligibleDepartments.includes(student.department)) {
    reasons.push(`Department "${student.department}" is not on the eligible list`);
  }
  return { eligible: reasons.length === 0, reasons };
}

function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 2600);
}

function openModal(html) {
  $('#genericModalContent').innerHTML = html;
  $('#genericModal').classList.remove('hidden');
}
function closeModal() { $('#genericModal').classList.add('hidden'); }

function escapeHtml(str) {
  return (str || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function pipelineHtml(status) {
  const steps = ['applied', 'shortlisted', 'interview', 'offer', 'hired'];
  const isRejected = status === 'rejected';
  const currentIdx = isRejected ? steps.indexOf('shortlisted') : steps.indexOf(status);
  return `<div class="pipeline">${steps.map((s, i) => {
    let cls = '';
    if (isRejected && i > currentIdx) cls = 'rejected';
    else if (i < currentIdx || (status === 'hired')) cls = i <= currentIdx ? 'done' : '';
    else if (i === currentIdx) cls = 'current';
    else if (i < currentIdx) cls = 'done';
    return `<div class="pipeline-step ${cls}"><div class="pipeline-line"></div><div class="pipeline-dot"></div><div class="pipeline-label">${s}</div></div>`;
  }).join('')}</div>${isRejected ? '<div class="pill pill-ineligible" style="margin-top:6px;">Rejected</div>' : ''}`;
}

/* ---------------- screen / tab navigation ---------------- */

function showScreen(id) {
  $$('.screen').forEach(s => s.classList.add('hidden'));
  $('#' + id).classList.remove('hidden');
}

function initTabs(root) {
  $$('.tab-btn', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const portal = btn.closest('.portal');
      $$('.tab-btn', portal).forEach(b => b.classList.remove('active'));
      $$('.tab-panel', portal).forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      $(`.tab-panel[data-panel="${btn.dataset.tab}"]`, portal).classList.add('active');
    });
  });
}

/* ---------------- role selection & onboarding ---------------- */

$$('.role-card').forEach(card => {
  card.addEventListener('click', () => {
    const role = card.dataset.role;
    if (role === 'student') showScreen('screen-studentOnboard');
    else if (role === 'recruiter') {
      populateRecruiterCompanySelect();
      showScreen('screen-recruiterOnboard');
    } else if (role === 'admin') {
      STATE.currentRole = 'admin';
      enterPortal('admin');
    }
  });
});

function populateRecruiterCompanySelect() {
  const sel = $('#recruiterCompanySelect');
  sel.innerHTML = STATE.companies.map(c => `<option value="${c.id}">${escapeHtml(c.name)}${c.verified ? '' : ' (pending verification)'}</option>`).join('');
}

$('#studentOnboardForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const id = ++_studentId;
  const student = {
    id,
    name: f.get('name').trim() || 'You',
    department: f.get('department'),
    gradYear: Number(f.get('gradYear')),
    cgpa: Number(f.get('cgpa')),
    backlogs: Number(f.get('backlogs')),
    skills: [],
    isMe: true
  };
  STATE.students.push(student);
  STATE.currentStudentId = id;
  STATE.currentRole = 'student';
  enterPortal('student');
});

$('#recruiterOnboardForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  let companyId = Number(f.get('companyId'));
  const newCompany = f.get('newCompany').trim();
  if (newCompany) {
    companyId = ++_companyId;
    STATE.companies.push({ id: companyId, name: newCompany, industry: f.get('industry') || 'Unspecified', verified: false });
    showToast(`"${newCompany}" registered — pending placement cell verification.`);
  }
  STATE.currentRecruiter = { name: f.get('name').trim() || 'Recruiter', companyId };
  STATE.currentRole = 'recruiter';
  enterPortal('recruiter');
});

function enterPortal(role) {
  const label = role === 'student' ? `${currentStudent().name} · Student`
    : role === 'recruiter' ? `${STATE.currentRecruiter.name} · ${companyName(STATE.currentRecruiter.companyId)}`
      : 'Placement Cell · Admin';
  $('#roleNav').innerHTML = `<span style="color:rgba(255,255,255,0.85); font-size:0.88rem; padding: 6px 10px;">${escapeHtml(label)}</span>`;
  $('#roleNav').classList.remove('hidden');
  $('#switchRoleBtn').classList.remove('hidden');

  showScreen(`screen-${role}`);
  if (role === 'student') renderStudentPortal();
  if (role === 'recruiter') renderRecruiterPortal();
  if (role === 'admin') renderAdminPortal();
}

$('#switchRoleBtn').addEventListener('click', () => {
  STATE.currentRole = null;
  $('#roleNav').classList.add('hidden');
  $('#switchRoleBtn').classList.add('hidden');
  showScreen('screen-roleSelect');
});

document.querySelectorAll('.portal').forEach(initTabs);

/* =========================================================
   STUDENT PORTAL
   ========================================================= */

function renderStudentPortal() {
  renderStudentJobs();
  populateAtsJobSelect();
  renderStudentApplications();
  renderStudentSkillTags();
}

function renderStudentJobs() {
  const student = currentStudent();
  const onlyEligible = $('#eligibleOnlyToggle').checked;
  const applied = new Set(STATE.applications.filter(a => a.studentId === student.id).map(a => a.jobId));

  const jobs = STATE.jobs.filter(j => {
    if (j.status !== 'open') return false;
    if (!onlyEligible) return true;
    return eligibleForJob(student, j).eligible;
  });

  $('#studentJobList').innerHTML = jobs.length ? jobs.map(j => {
    const elig = eligibleForJob(student, j);
    const hasApplied = applied.has(j.id);
    return `
    <div class="card job-card">
      <div class="job-card-top">
        <div>
          <div class="job-title">${escapeHtml(j.title)}</div>
          <div class="job-company">${escapeHtml(companyName(j.companyId))}</div>
        </div>
        <span class="pill ${elig.eligible ? 'pill-eligible' : 'pill-ineligible'}">${elig.eligible ? 'Eligible' : 'Not eligible'}</span>
      </div>
      <p class="small muted">${escapeHtml(j.description)}</p>
      <div class="tag-row">${j.skills.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}</div>
      <div class="job-meta">
        <span>₹${j.package} LPA</span><span>·</span>
        <span>Min CGPA ${j.minCgpa}</span><span>·</span>
        <span>${j.jobType.replace('_', ' ')}</span><span>·</span>
        <span>Deadline ${j.deadline}</span>
      </div>
      ${!elig.eligible ? `<p class="small" style="color:var(--danger)">${elig.reasons.join('; ')}</p>` : ''}
      <button class="btn ${hasApplied ? 'btn-secondary' : 'btn-primary'}" ${hasApplied || !elig.eligible ? 'disabled' : ''} onclick="applyToJob(${j.id})">
        ${hasApplied ? 'Applied ✓' : 'Apply now'}
      </button>
    </div>`;
  }).join('') : `<p class="muted">No roles match right now — try unchecking the eligibility filter.</p>`;
}

$('#eligibleOnlyToggle').addEventListener('change', renderStudentJobs);

function applyToJob(jobId) {
  const student = currentStudent();
  const id = ++_appId;
  STATE.applications.push({ id, studentId: student.id, jobId, status: 'applied', appliedAt: new Date().toISOString().slice(0, 10) });
  showToast('Application submitted.');
  renderStudentJobs();
  renderStudentApplications();
}

function renderStudentApplications() {
  const student = currentStudent();
  const apps = STATE.applications.filter(a => a.studentId === student.id);
  $('#studentApplicationList').innerHTML = apps.length ? apps.map(a => {
    const job = jobById(a.jobId);
    return `<div class="card app-row">
      <div class="app-row-top">
        <div>
          <div class="job-title">${escapeHtml(job.title)}</div>
          <div class="job-company">${escapeHtml(companyName(job.companyId))} · applied ${a.appliedAt}</div>
        </div>
      </div>
      ${pipelineHtml(a.status)}
    </div>`;
  }).join('') : '<p class="muted">You haven\'t applied to anything yet — browse Jobs to get started.</p>';
}

function populateAtsJobSelect() {
  const sel = $('#atsJobSelect');
  const openJobs = STATE.jobs.filter(j => j.status === 'open');
  sel.innerHTML = `<option value="">— General / no specific job —</option>` +
    openJobs.map(j => `<option value="${j.id}">${escapeHtml(j.title)} · ${escapeHtml(companyName(j.companyId))}</option>`).join('');
}

function renderStudentSkillTags() {
  const el = $('#studentSkillTags');
  if (!STATE.extractedSkills.length) {
    el.innerHTML = '<span class="muted small">No skills extracted yet — run "Extract skills" from your résumé.</span>';
    return;
  }
  el.innerHTML = STATE.extractedSkills.map(s => `<span class="tag tag-accent">${escapeHtml(s.name)} <span style="opacity:.65">${Math.round(s.confidence * 100)}%</span></span>`).join('');
}

// résumé text input wiring
$('#resumeText').addEventListener('input', e => { STATE.resumeText = e.target.value; });
$('#resumeFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    $('#resumeText').value = reader.result;
    STATE.resumeText = reader.result;
    $('#resumeStatus').textContent = `Loaded ${file.name}`;
  };
  reader.readAsText(file);
});

function requireResumeText() {
  const text = $('#resumeText').value.trim();
  if (!text) { showToast('Paste or upload a résumé first.'); return null; }
  return text;
}

function aiOutputLoading(container) {
  container.innerHTML = `<div class="ai-block loading-line">Calling Gemini…</div>`;
}
function aiOutputError(container, err) {
  container.innerHTML = `<div class="error-line">${escapeHtml(err.message || String(err))}</div>`;
}

$('#btnAtsScore').addEventListener('click', async () => {
  const text = requireResumeText(); if (!text) return;
  const jobId = $('#atsJobSelect').value;
  const job = jobId ? jobById(jobId) : null;
  const out = $('#aiResumeOutput');
  aiOutputLoading(out);
  try {
    const result = await GeminiFeatures.atsScore(text, job ? `${job.title}: ${job.description}\nRequired skills: ${job.skills.join(', ')}` : '');
    out.innerHTML = `<div class="ai-block">
      <h4>ATS Score${job ? ' — ' + escapeHtml(job.title) : ''}</h4>
      <div class="score-badge">${result.score}<small>/ 100</small></div>
      <p class="small">${escapeHtml(result.summary || '')}</p>
      <p class="small"><strong>Matched:</strong> ${(result.matched_keywords || []).map(escapeHtml).join(', ') || '—'}</p>
      <p class="small"><strong>Missing:</strong> ${(result.missing_keywords || []).map(escapeHtml).join(', ') || '—'}</p>
      ${(result.formatting_issues || []).length ? `<p class="small"><strong>Formatting:</strong> ${result.formatting_issues.map(escapeHtml).join('; ')}</p>` : ''}
    </div>`;
  } catch (err) { aiOutputError(out, err); }
});

$('#btnSkillExtract').addEventListener('click', async () => {
  const text = requireResumeText(); if (!text) return;
  const out = $('#aiResumeOutput');
  aiOutputLoading(out);
  try {
    const result = await GeminiFeatures.extractSkills(text);
    STATE.extractedSkills = result.skills || [];
    currentStudent().skills = STATE.extractedSkills.map(s => s.name);
    renderStudentSkillTags();
    out.innerHTML = `<div class="ai-block">
      <h4>Skill extraction</h4>
      <p class="small">Estimated level: <strong>${escapeHtml(result.estimated_experience_level || 'n/a')}</strong></p>
      <p class="small">${(result.skills || []).length} skills found — see the tag list below.</p>
    </div>`;
  } catch (err) { aiOutputError(out, err); }
});

$('#btnResumeSuggest').addEventListener('click', async () => {
  const text = requireResumeText(); if (!text) return;
  const jobId = $('#atsJobSelect').value;
  const job = jobId ? jobById(jobId) : null;
  const out = $('#aiResumeOutput');
  aiOutputLoading(out);
  try {
    const result = await GeminiFeatures.resumeSuggestions(text, job ? job.description : '');
    out.innerHTML = `<div class="ai-block">
      <h4>Improvement suggestions</h4>
      ${(result.suggestions || []).map(s => `
        <div style="margin-bottom:10px;">
          <p class="small" style="margin-bottom:2px;"><strong>${escapeHtml(s.issue)}</strong></p>
          <p class="small" style="color:var(--danger); margin-bottom:2px;">− ${escapeHtml(s.before)}</p>
          <p class="small" style="color:var(--success);">+ ${escapeHtml(s.after)}</p>
        </div>`).join('')}
      <p class="small muted">${escapeHtml(result.overall_advice || '')}</p>
    </div>`;
  } catch (err) { aiOutputError(out, err); }
});

$('#btnJobRecommend').addEventListener('click', async () => {
  const student = currentStudent();
  if (!STATE.extractedSkills.length) { showToast('Run "Extract skills" first so recommendations have something to match on.'); return; }
  const out = $('#aiResumeOutput');
  aiOutputLoading(out);
  const eligibleJobs = STATE.jobs.filter(j => j.status === 'open' && eligibleForJob(student, j).eligible);
  try {
    const result = await GeminiFeatures.recommendJobs(STATE.extractedSkills.map(s => s.name), student.department, eligibleJobs);
    const ranked = (result.ranked || []).sort((a, b) => b.fit_score - a.fit_score);
    out.innerHTML = `<div class="ai-block">
      <h4>Recommended for you</h4>
      ${ranked.map(r => {
      const job = jobById(r.job_id);
      if (!job) return '';
      return `<div style="margin-bottom:8px;">
          <span class="score-badge" style="font-size:1.2rem;">${r.fit_score}<small>/100</small></span>
          <strong style="margin-left:6px;">${escapeHtml(job.title)}</strong>
          <p class="small muted" style="margin:2px 0 0;">${escapeHtml(r.reason)}</p>
        </div>`;
    }).join('') || '<p class="small muted">No eligible open roles to rank right now.</p>'}
    </div>`;
  } catch (err) { aiOutputError(out, err); }
});

/* ---- Mock interview ---- */

$('#btnGenerateQuestions').addEventListener('click', async () => {
  const role = $('#mockRole').value.trim() || 'General role';
  const skills = $('#mockSkills').value.split(',').map(s => s.trim()).filter(Boolean);
  const difficulty = $('#mockDifficulty').value;
  const list = $('#mockQuestionList');
  list.innerHTML = `<div class="ai-block loading-line">Generating questions…</div>`;
  try {
    const result = await GeminiFeatures.generateQuestions(role, skills, difficulty);
    STATE.mockSession = { role, questions: result.questions || [], answers: {}, scores: {} };
    renderMockQuestions();
    $('#mockSessionSummary').innerHTML = `<p class="small">Session for <strong>${escapeHtml(role)}</strong> — ${result.questions.length} questions. Answer each one below to get AI feedback.</p>`;
  } catch (err) {
    list.innerHTML = '';
    aiOutputError(list, err);
  }
});

function renderMockQuestions() {
  const s = STATE.mockSession;
  const list = $('#mockQuestionList');
  list.innerHTML = s.questions.map(q => `
    <div class="card" data-qid="${q.id}">
      <span class="pill pill-neutral">${escapeHtml(q.category)}</span>
      <h4 style="margin-top:8px;">${escapeHtml(q.question)}</h4>
      <textarea rows="3" placeholder="Type your answer..." class="mock-answer-input" data-qid="${q.id}">${escapeHtml(s.answers[q.id] || '')}</textarea>
      <div class="row gap" style="margin-top:8px;">
        <button class="btn btn-accent btn-sm" onclick="submitMockAnswer('${q.id}')">Submit answer</button>
      </div>
      <div class="ai-output" id="mock-feedback-${q.id}"></div>
    </div>
  `).join('');
}

async function submitMockAnswer(qid) {
  const s = STATE.mockSession;
  const q = s.questions.find(q => q.id === qid);
  const textarea = $(`.mock-answer-input[data-qid="${qid}"]`);
  const answer = textarea.value.trim();
  if (!answer) { showToast('Write an answer first.'); return; }
  s.answers[qid] = answer;
  const feedbackEl = $(`#mock-feedback-${qid}`);
  aiOutputLoading(feedbackEl);
  try {
    const result = await GeminiFeatures.evaluateAnswer(q.question, answer, s.role);
    s.scores[qid] = result.score;
    feedbackEl.innerHTML = `<div class="ai-block">
      <div class="score-badge" style="font-size:1.3rem;">${result.score}<small>/100</small></div>
      <p class="small"><strong>Clarity:</strong> ${escapeHtml(result.clarity)}</p>
      <p class="small"><strong>Technical accuracy:</strong> ${escapeHtml(result.technical_accuracy)}</p>
      <p class="small"><strong>Tips:</strong> ${(result.improvement_tips || []).map(escapeHtml).join('; ')}</p>
      <p class="small muted"><strong>Model answer:</strong> ${escapeHtml(result.sample_better_answer)}</p>
    </div>`;
    updateMockSummary();
  } catch (err) { aiOutputError(feedbackEl, err); }
}

function updateMockSummary() {
  const s = STATE.mockSession;
  const scored = Object.values(s.scores);
  if (!scored.length) return;
  const avg = Math.round(scored.reduce((a, b) => a + b, 0) / scored.length);
  $('#mockSessionSummary').innerHTML = `<p class="small">Session for <strong>${escapeHtml(s.role)}</strong></p>
    <div class="score-badge">${avg}<small>/100 avg over ${scored.length}/${s.questions.length} answered</small></div>`;
}

/* =========================================================
   RECRUITER PORTAL
   ========================================================= */

function renderRecruiterPortal() {
  renderRecruiterJobs();
  renderRecruiterInterviews();
  renderRecruiterEmailLog();
}

$('#jobForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const id = ++_jobId;
  const job = {
    id,
    companyId: STATE.currentRecruiter.companyId,
    title: f.get('title'),
    description: f.get('description'),
    skills: f.get('skills').split(',').map(s => s.trim()).filter(Boolean),
    minCgpa: Number(f.get('minCgpa')),
    maxBacklogs: Number(f.get('maxBacklogs')),
    eligibleDepartments: f.get('departments').split(',').map(s => s.trim()).filter(Boolean),
    package: Number(f.get('package')),
    jobType: f.get('jobType'),
    status: 'open',
    postedBy: STATE.currentRecruiter.name,
    deadline: '2026-09-01'
  };
  STATE.jobs.push(job);
  e.target.reset();
  showToast('Role published.');
  renderRecruiterJobs();
  $$('.tab-btn[data-tab="jobs"]', $('#screen-recruiter')).forEach(b => b.click());
});

function renderRecruiterJobs() {
  const myJobs = STATE.jobs.filter(j => j.companyId === STATE.currentRecruiter.companyId);
  $('#recruiterJobList').innerHTML = myJobs.length ? myJobs.map(j => {
    const apps = STATE.applications.filter(a => a.jobId === j.id);
    return `<div class="card">
      <div class="job-card-top">
        <div>
          <div class="job-title">${escapeHtml(j.title)}</div>
          <div class="job-company">${apps.length} applicant(s) · ${j.status}</div>
        </div>
        <span class="pill ${j.status === 'open' ? 'pill-open' : 'pill-closed'}">${j.status}</span>
      </div>
      <div class="tag-row">${j.skills.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}</div>
      <div class="table-wrap" style="margin-top:10px;">
        ${apps.length ? `<table class="data-table">
          <thead><tr><th>Student</th><th>Dept</th><th>CGPA</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${apps.map(a => {
      const st = studentById(a.studentId);
      return `<tr>
                <td>${escapeHtml(st.name)}</td>
                <td>${escapeHtml(st.department)}</td>
                <td>${st.cgpa}</td>
                <td>${pipelineHtml(a.status)}</td>
                <td>
                  <div class="row gap">
                    ${a.status === 'applied' ? `<button class="btn btn-secondary btn-sm" onclick="updateAppStatus(${a.id}, 'shortlisted')">Shortlist</button>` : ''}
                    ${a.status === 'shortlisted' ? `<button class="btn btn-accent btn-sm" onclick="openScheduleModal(${a.id})">Schedule interview</button>` : ''}
                    ${a.status === 'interview' ? `<button class="btn btn-secondary btn-sm" onclick="updateAppStatus(${a.id}, 'offer')">Make offer</button>` : ''}
                    ${a.status === 'offer' ? `<button class="btn btn-secondary btn-sm" onclick="updateAppStatus(${a.id}, 'hired')">Mark hired</button>` : ''}
                    ${!['rejected', 'hired'].includes(a.status) ? `<button class="btn btn-danger btn-sm" onclick="updateAppStatus(${a.id}, 'rejected')">Reject</button>` : ''}
                    <button class="btn btn-secondary btn-sm" onclick="openEmailModal(${a.id})">Message</button>
                  </div>
                </td>
              </tr>`;
    }).join('')}
          </tbody>
        </table>` : '<p class="muted small">No applicants yet.</p>'}
      </div>
    </div>`;
  }).join('') : '<p class="muted">You haven\'t posted any roles yet.</p>';
}

function updateAppStatus(appId, status) {
  const app = STATE.applications.find(a => a.id === appId);
  app.status = status;
  showToast(`Status updated to "${status}".`);
  renderRecruiterJobs();
}

function openScheduleModal(appId) {
  openModal(`
    <h3>Schedule interview</h3>
    <form id="scheduleForm">
      <label>Date &amp; time
        <input type="datetime-local" name="datetime" required>
      </label>
      <label>Mode
        <select name="mode"><option value="online">Online</option><option value="offline">Offline</option></select>
      </label>
      <label>Meeting link / location
        <input type="text" name="link" placeholder="https://meet.example.com/...">
      </label>
      <div class="row gap end">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Schedule</button>
      </div>
    </form>
  `);
  $('#scheduleForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    STATE.interviews.push({
      id: ++_interviewId, applicationId: appId, scheduledAt: f.get('datetime'),
      mode: f.get('mode'), link: f.get('link'), interviewer: STATE.currentRecruiter.name, status: 'scheduled'
    });
    STATE.applications.find(a => a.id === appId).status = 'interview';
    closeModal();
    showToast('Interview scheduled.');
    renderRecruiterJobs();
    renderRecruiterInterviews();
  });
}

function openEmailModal(appId) {
  const app = STATE.applications.find(a => a.id === appId);
  const student = studentById(app.studentId);
  openModal(`
    <h3>Message ${escapeHtml(student.name)}</h3>
    <p class="muted small">Simulated — this logs the message instead of sending real email.</p>
    <form id="emailForm">
      <label>Subject
        <input type="text" name="subject" value="Regarding your application" required>
      </label>
      <label>Message
        <textarea name="body" rows="5" required>Hi ${student.name},\n\n</textarea>
      </label>
      <div class="row gap end">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Send</button>
      </div>
    </form>
  `);
  $('#emailForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    STATE.emailLog.push({
      id: ++_emailId, to: student.name, subject: f.get('subject'), body: f.get('body'),
      sentAt: new Date().toLocaleString(), jobTitle: jobById(app.jobId).title
    });
    closeModal();
    showToast('Message sent (simulated).');
    renderRecruiterEmailLog();
  });
}

function renderRecruiterInterviews() {
  const myJobIds = new Set(STATE.jobs.filter(j => j.companyId === STATE.currentRecruiter.companyId).map(j => j.id));
  const myAppIds = new Map(STATE.applications.filter(a => myJobIds.has(a.jobId)).map(a => [a.id, a]));
  const list = STATE.interviews.filter(i => myAppIds.has(i.applicationId));
  $('#recruiterInterviewList').innerHTML = list.length ? list.map(i => {
    const app = myAppIds.get(i.applicationId);
    const student = studentById(app.studentId);
    const job = jobById(app.jobId);
    return `<div class="card">
      <div class="job-card-top">
        <div>
          <div class="job-title">${escapeHtml(student.name)} — ${escapeHtml(job.title)}</div>
          <div class="job-company">${i.scheduledAt.replace('T', ' ')} · ${i.mode}</div>
        </div>
        <span class="pill pill-neutral">${i.status}</span>
      </div>
      ${i.link ? `<p class="small">${escapeHtml(i.link)}</p>` : ''}
    </div>`;
  }).join('') : '<p class="muted">No interviews scheduled yet.</p>';
}

function renderRecruiterEmailLog() {
  $('#recruiterEmailLog').innerHTML = STATE.emailLog.length ? STATE.emailLog.slice().reverse().map(m => `
    <div class="card">
      <div class="job-card-top">
        <div class="job-title">${escapeHtml(m.subject)}</div>
        <span class="muted small">${m.sentAt}</span>
      </div>
      <p class="small muted">To: ${escapeHtml(m.to)} · Re: ${escapeHtml(m.jobTitle)}</p>
      <p class="small">${escapeHtml(m.body).replace(/\n/g, '<br>')}</p>
    </div>
  `).join('') : '<p class="muted">No messages sent yet.</p>';
}

$('#btnRecruiterGenQuestions').addEventListener('click', async () => {
  const role = $('#recruiterQRole').value.trim() || 'Open role';
  const skills = $('#recruiterQSkills').value.split(',').map(s => s.trim()).filter(Boolean);
  const out = $('#recruiterQuestionOutput');
  out.innerHTML = `<div class="ai-block loading-line">Generating questions…</div>`;
  try {
    const result = await GeminiFeatures.generateQuestions(role, skills, 'intermediate');
    out.innerHTML = `<div class="card">
      <h4>${escapeHtml(role)}</h4>
      ${(result.questions || []).map(q => `<p class="small"><span class="pill pill-neutral">${escapeHtml(q.category)}</span> ${escapeHtml(q.question)}</p>`).join('')}
    </div>`;
  } catch (err) { aiOutputError(out, err); }
});

/* =========================================================
   ADMIN / PLACEMENT CELL PORTAL
   ========================================================= */

function renderAdminPortal() {
  renderAdminStats();
  renderAdminCharts();
  renderAdminCompanies();
  renderAdminStudents();
  populateEligibilityJobSelect();
}

function renderAdminStats() {
  const totalStudents = STATE.students.length;
  const hired = STATE.applications.filter(a => a.status === 'hired');
  const placementPct = totalStudents ? Math.round((new Set(hired.map(a => a.studentId)).size / totalStudents) * 100) : 0;
  const avgPackage = hired.length ? (hired.reduce((sum, a) => sum + jobById(a.jobId).package, 0) / hired.length).toFixed(1) : '—';
  const totalApps = STATE.applications.length;

  $('#adminStatRow').innerHTML = `
    <div class="stat-card"><div class="stat-value">${totalApps}</div><div class="stat-label">Total applications</div></div>
    <div class="stat-card"><div class="stat-value">${placementPct}%</div><div class="stat-label">Placement percentage</div></div>
    <div class="stat-card"><div class="stat-value">₹${avgPackage}</div><div class="stat-label">Average package (LPA)</div></div>
    <div class="stat-card"><div class="stat-value">${totalStudents}</div><div class="stat-label">Students in cohort</div></div>
  `;
}

function destroyChart(key) {
  if (STATE.chartInstances[key]) { STATE.chartInstances[key].destroy(); }
}

function renderAdminCharts() {
  const statusCounts = {};
  STATE.applications.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });

  destroyChart('applications');
  STATE.chartInstances.applications = new Chart($('#chartApplications'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{ data: Object.values(statusCounts), backgroundColor: ['#223159', '#C98A2E', '#2A6496', '#1E7A52', '#B3402F'] }]
    },
    options: { plugins: { legend: { position: 'bottom', labels: { font: { family: 'Inter' } } } } }
  });

  const deptPlacements = {};
  STATE.applications.filter(a => a.status === 'hired').forEach(a => {
    const dept = studentById(a.studentId).department;
    deptPlacements[dept] = (deptPlacements[dept] || 0) + 1;
  });
  destroyChart('dept');
  STATE.chartInstances.dept = new Chart($('#chartDept'), {
    type: 'bar',
    data: { labels: Object.keys(deptPlacements), datasets: [{ label: 'Placed', data: Object.values(deptPlacements), backgroundColor: '#223159' }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
  });

  // mock trend data (last 6 months)
  destroyChart('trend');
  STATE.chartInstances.trend = new Chart($('#chartTrend'), {
    type: 'line',
    data: {
      labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{ label: 'Offers made', data: [2, 4, 3, 6, 8, STATE.applications.filter(a => ['offer', 'hired'].includes(a.status)).length], borderColor: '#C98A2E', backgroundColor: 'rgba(201,138,46,0.15)', fill: true, tension: 0.35 }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });

  const skillCounts = {};
  STATE.jobs.forEach(j => j.skills.forEach(s => { skillCounts[s] = (skillCounts[s] || 0) + 1; }));
  const topSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  destroyChart('skills');
  STATE.chartInstances.skills = new Chart($('#chartSkills'), {
    type: 'bar',
    data: { labels: topSkills.map(s => s[0]), datasets: [{ label: 'Jobs requiring this skill', data: topSkills.map(s => s[1]), backgroundColor: '#2A6496' }] },
    options: { indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } } }
  });
}

function renderAdminCompanies() {
  $('#adminCompanyList').innerHTML = `
    <div class="card">
      <h3>Register a company</h3>
      <form id="adminCompanyForm" class="form-grid">
        <label>Name<input type="text" name="name" required></label>
        <label>Industry<input type="text" name="industry"></label>
        <button type="submit" class="btn btn-primary">Add company</button>
      </form>
    </div>
  ` + STATE.companies.map(c => `
    <div class="card job-card-top">
      <div>
        <div class="job-title">${escapeHtml(c.name)}</div>
        <div class="job-company">${escapeHtml(c.industry)} · ${STATE.jobs.filter(j => j.companyId === c.id).length} job(s) posted</div>
      </div>
      <div class="row gap">
        <span class="pill ${c.verified ? 'pill-open' : 'pill-ineligible'}">${c.verified ? 'Verified' : 'Pending'}</span>
        ${!c.verified ? `<button class="btn btn-secondary btn-sm" onclick="verifyCompany(${c.id})">Verify</button>` : ''}
      </div>
    </div>
  `).join('');

  $('#adminCompanyForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    STATE.companies.push({ id: ++_companyId, name: f.get('name'), industry: f.get('industry') || 'Unspecified', verified: false });
    renderAdminCompanies();
    showToast('Company added — pending verification.');
  });
}

function verifyCompany(id) {
  STATE.companies.find(c => c.id === id).verified = true;
  renderAdminCompanies();
  showToast('Company verified.');
}

function renderAdminStudents() {
  const hiredIds = new Set(STATE.applications.filter(a => a.status === 'hired').map(a => a.studentId));
  $('#adminStudentTable tbody').innerHTML = STATE.students.map(s => `
    <tr>
      <td>${escapeHtml(s.name)}${s.isMe ? ' <span class="muted small">(you)</span>' : ''}</td>
      <td>${escapeHtml(s.department)}</td>
      <td>${s.cgpa}</td>
      <td>${s.backlogs}</td>
      <td><span class="pill ${hiredIds.has(s.id) ? 'pill-open' : 'pill-neutral'}">${hiredIds.has(s.id) ? 'Placed' : 'Unplaced'}</span></td>
    </tr>
  `).join('');
}

function populateEligibilityJobSelect() {
  const sel = $('#eligibilityJobSelect');
  sel.innerHTML = `<option value="">— Custom criteria below —</option>` +
    STATE.jobs.map(j => `<option value="${j.id}">${escapeHtml(j.title)} · ${escapeHtml(companyName(j.companyId))}</option>`).join('');
  sel.addEventListener('change', () => {
    const job = jobById(sel.value);
    if (job) {
      $('#eligMinCgpa').value = job.minCgpa;
      $('#eligMaxBacklogs').value = job.maxBacklogs;
      $('#eligDepartments').value = job.eligibleDepartments.join(', ');
    }
  });
}

$('#btnRunEligibility').addEventListener('click', () => {
  const criteria = {
    minCgpa: Number($('#eligMinCgpa').value),
    maxBacklogs: Number($('#eligMaxBacklogs').value),
    eligibleDepartments: $('#eligDepartments').value.split(',').map(s => s.trim()).filter(Boolean)
  };
  const rows = STATE.students.map(s => {
    const check = eligibleForJob(s, criteria);
    return `<tr>
      <td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.department)}</td><td>${s.cgpa}</td><td>${s.backlogs}</td>
      <td><span class="pill ${check.eligible ? 'pill-eligible' : 'pill-ineligible'}">${check.eligible ? 'Eligible' : 'Not eligible'}</span></td>
      <td class="small muted">${check.reasons.join('; ') || '—'}</td>
    </tr>`;
  }).join('');
  $('#eligibilityResults').innerHTML = `<table class="data-table">
    <thead><tr><th>Name</th><th>Dept</th><th>CGPA</th><th>Backlogs</th><th>Result</th><th>Reason</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
});

/* =========================================================
   SETTINGS MODAL (Gemini API key)
   ========================================================= */

$('#apiStatusBtn').addEventListener('click', () => $('#settingsModal').classList.remove('hidden'));
$('#apiKeyCancel').addEventListener('click', () => $('#settingsModal').classList.add('hidden'));
$('#apiKeySave').addEventListener('click', () => {
  const val = $('#apiKeyInput').value.trim();
  setGeminiKey(val);
  $('#settingsModal').classList.add('hidden');
  const dot = $('#apiStatusBtn .dot');
  if (hasGeminiKey()) {
    dot.classList.remove('dot-off'); dot.classList.add('dot-on');
    showToast('Gemini API key saved for this session.');
  } else {
    dot.classList.remove('dot-on'); dot.classList.add('dot-off');
  }
});

// close modals on backdrop click
$('#genericModal').addEventListener('click', e => { if (e.target.id === 'genericModal') closeModal(); });
$('#settingsModal').addEventListener('click', e => { if (e.target.id === 'settingsModal') $('#settingsModal').classList.add('hidden'); });
