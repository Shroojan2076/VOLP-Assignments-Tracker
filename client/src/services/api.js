const API_BASE = '/api';

export const mockCourses = [
  {
    id: 1,
    courseId: 15917,
    courseOfferingLearnerId: 44021,
    code: 'CS3022',
    name: 'Distributed Operating Systems & Cloud Infrastructures',
    description: 'Architecture of distributed systems, cloud virtualization, containerization, and consensus algorithms.',
    professor: 'Dr. Ramesh K. Sharma',
    progress: 78.5,
    active: true,
    allowAssessment: true,
    archived: false,
    lastSeen: '2026-10-26T14:30:00.000Z',
    lastSyncedAt: '2026-10-27T02:15:00.000Z'
  },
  {
    id: 2,
    courseId: 15920,
    courseOfferingLearnerId: 44028,
    code: 'CS3089',
    name: 'Advanced Database Systems & Transaction Processing',
    description: 'PostgreSQL internals, MVCC, query optimization, distributed databases and WAL architecture.',
    professor: 'Prof. Ananya Sen',
    progress: 92.0,
    active: true,
    allowAssessment: true,
    archived: false,
    lastSeen: '2026-10-26T18:45:00.000Z',
    lastSyncedAt: '2026-10-27T02:15:00.000Z'
  },
  {
    id: 3,
    courseId: 16045,
    courseOfferingLearnerId: 44102,
    code: 'AI4011',
    name: 'Deep Learning & Natural Language Processing',
    description: 'Transformers, self-attention mechanisms, LLMs, and neural network fine-tuning.',
    professor: 'Dr. Siddharth Joshi',
    progress: 64.0,
    active: true,
    allowAssessment: true,
    archived: false,
    lastSeen: '2026-10-25T11:00:00.000Z',
    lastSyncedAt: '2026-10-27T02:15:00.000Z'
  },
  {
    id: 4,
    courseId: 16102,
    courseOfferingLearnerId: 44150,
    code: 'CS3104',
    name: 'Software Engineering & Agile Methodologies',
    description: 'System design, CI/CD pipelines, automated testing, and microservice boundaries.',
    professor: 'Prof. Preeti Deshmukh',
    progress: 100.0,
    active: true,
    allowAssessment: false,
    archived: false,
    lastSeen: '2026-10-24T16:20:00.000Z',
    lastSyncedAt: '2026-10-27T02:15:00.000Z'
  }
];

export const mockAssignments = [
  {
    id: 101,
    assignmentId: 88201,
    courseId: 15917,
    courseCode: 'CS3022',
    courseName: 'Distributed Operating Systems',
    question: 'Implement a Raft consensus heartbeat algorithm in Node.js or Go with simulated network partitions and leader election timeout handling.',
    marks: 25.0,
    submitted: false,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ahead
    graceDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    graded: false,
    evaluated: false,
    score: null,
    submissionFile: null,
    submissionPath: null
  },
  {
    id: 102,
    assignmentId: 88209,
    courseId: 15920,
    courseCode: 'CS3089',
    courseName: 'Advanced Database Systems',
    question: 'Analyze query execution plans using EXPLAIN ANALYZE for an unindexed vs indexed multi-table JOIN in PostgreSQL. Submit execution metrics report.',
    marks: 20.0,
    submitted: true,
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    graceDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    graded: true,
    evaluated: true,
    score: 19.5,
    submissionFile: 'Assignment_2_Query_Optimization_Report.pdf',
    submissionPath: '/submissions/learner/cs3089/ass88209.pdf'
  },
  {
    id: 103,
    assignmentId: 88215,
    courseId: 16045,
    courseCode: 'AI4011',
    courseName: 'Deep Learning & NLP',
    question: 'Fine-tune a BERT model on Stanford Sentiment Treebank (SST-2). Graph training loss vs validation accuracy and calculate F1 score.',
    marks: 30.0,
    submitted: true,
    dueDate: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // due in 18 hours
    graceDate: new Date(Date.now() + 42 * 60 * 60 * 1000).toISOString(),
    graded: false,
    evaluated: false,
    score: null,
    submissionFile: 'bert_sst2_finetune_notebook.ipynb',
    submissionPath: '/submissions/learner/ai4011/ass88215.ipynb'
  },
  {
    id: 104,
    assignmentId: 88240,
    courseId: 15917,
    courseCode: 'CS3022',
    courseName: 'Distributed Operating Systems',
    question: 'Analyze Byzantine Fault Tolerance mechanisms in permissioned blockchain topologies with N=4 nodes and f=1 adversary.',
    marks: 15.0,
    submitted: false,
    dueDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // overdue by 12 hours
    graceDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // in grace period
    graded: false,
    evaluated: false,
    score: null,
    submissionFile: null,
    submissionPath: null
  },
  {
    id: 105,
    assignmentId: 88190,
    courseId: 16102,
    courseCode: 'CS3104',
    courseName: 'Software Engineering',
    question: 'Design an automated GitHub Actions CI workflow with matrix build testing, Docker image packaging, and automated test coverage reporting.',
    marks: 20.0,
    submitted: true,
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    graceDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    graded: true,
    evaluated: true,
    score: 20.0,
    submissionFile: 'ci_cd_pipeline_workflow.yml',
    submissionPath: '/submissions/learner/cs3104/ass88190.yml'
  }
];

export async function checkBackendConnection() {
  try {
    const res = await fetch(`${API_BASE}/resync`, { method: 'GET' });
    // If it responds with anything (200, 500, etc.), the Express server is up
    return {
      connected: true,
      status: res.status,
      message: 'Backend server is running on port 3000'
    };
  } catch (err) {
    return {
      connected: false,
      status: 0,
      message: 'Could not connect to backend server at http://localhost:3000'
    };
  }
}

function normalizeCourse(c) {
  if (!c) return c;
  return {
    ...c,
    courseId: c.courseId ?? c.course_id,
    courseOfferingLearnerId: c.courseOfferingLearnerId ?? c.course_offering_learner_id,
    lastSeen: c.lastSeen ?? c.last_seen,
    allowAssessment: c.allowAssessment ?? c.allow_assessment,
    archived: c.archived ?? c.is_archived ?? false,
    lastSyncedAt: c.lastSyncedAt ?? c.last_synced_at
  };
}

function normalizeAssignment(a) {
  if (!a) return a;
  return {
    ...a,
    assignmentId: a.assignmentId ?? a.assignment_id,
    courseId: a.courseId ?? a.course_id,
    courseCode: a.courseCode ?? a.course_code ?? (a.courseId ? `Course #${a.courseId}` : ''),
    courseName: a.courseName ?? a.course_name ?? '',
    dueDate: a.dueDate ?? a.due_date,
    graceDate: a.graceDate ?? a.grace_date,
    submissionFile: a.submissionFile ?? a.submission_file,
    submissionPath: a.submissionPath ?? a.submission_path,
    lastSyncedAt: a.lastSyncedAt ?? a.last_synced_at
  };
}

export async function loginUser(email, password) {
  try {
    const user = { email, password };
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success !== false) {
      return { 
        success: true, 
        ...data, 
        user: data.user || data,
        courses: data.courses || [],
        assignments: data.assignments || []
      };
    }

    // Only flag endpoint missing if 404 and backend sent no JSON response
    if (res.status === 404 && !data.message && !data.error) {
      return { 
        success: false, 
        isEndpointMissing: true, 
        message: 'Backend endpoint POST /api/auth/login is not implemented yet.' 
      };
    }

    return { 
      success: false, 
      message: data.message || data.error || (res.status === 401 ? 'Invalid password.' : 'Login failed.') 
    };
  } catch (err) {
    return { 
      success: false, 
      isNetworkError: true, 
      message: 'Failed to connect to backend server at http://localhost:3000' 
    };
  }
}

export async function registerUser(credentials, maybePassword) {
  try {
    const user = typeof credentials === 'object'
      ? { ...credentials }
      : { email: credentials, password: maybePassword };

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success !== false) {
      return { 
        success: true, 
        ...data, 
        user: data.user || data,
        courses: data.courses || [],
        assignments: data.assignments || []
      };
    }

    // Only flag endpoint missing if 404 and backend sent no JSON response
    if (res.status === 404 && !data.message && !data.error) {
      return { 
        success: false, 
        isEndpointMissing: true, 
        message: 'Backend endpoint POST /api/auth/register is not implemented yet.' 
      };
    }

    return { 
      success: false, 
      message: data.message || data.error || 'Registration failed: VOLP verification rejected credentials.' 
    };
  } catch (err) {
    return { 
      success: false, 
      isNetworkError: true, 
      message: 'Failed to connect to backend server at http://localhost:3000' 
    };
  }
}

export async function triggerResync() {
  try {
    const res = await fetch(`${API_BASE}/resync`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, message: errData.error || 'Sync request failed on backend.' };
  } catch (err) {
    return { success: false, message: 'Could not connect to backend to trigger sync.' };
  }
}

export async function getCourses(userEmail) {
  try {
    if (!userEmail) {
      return { success: true, data: mockCourses, isMock: true };
    }
    const res = await fetch(`${API_BASE}/fetch/courses?email=${encodeURIComponent(userEmail)}`);
    if (res.ok) {
      const data = await res.json();
      const rawCourses = data.courses || (Array.isArray(data) ? data : []);
      const normalized = Array.isArray(rawCourses) ? rawCourses.map(normalizeCourse) : [];
      return { success: true, data: normalized };
    }
    return { success: false, data: mockCourses, isMock: true };
  } catch (err) {
    return { success: false, data: mockCourses, isMock: true };
  }
}

export async function getAssignments(userEmail, courseId) {
  try {
    if (!userEmail) {
      return { success: true, data: mockAssignments, isMock: true };
    }
    let url = `${API_BASE}/fetch/assignments?email=${encodeURIComponent(userEmail)}`;
    if (courseId) url += `&courseId=${encodeURIComponent(courseId)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const rawAssignments = data.assignments || (Array.isArray(data) ? data : []);
      const normalized = Array.isArray(rawAssignments) ? rawAssignments.map(normalizeAssignment) : [];
      return { success: true, data: normalized };
    }
    return { success: false, data: mockAssignments, isMock: true };
  } catch (err) {
    return { success: false, data: mockAssignments, isMock: true };
  }
}
