export function getApiBase() {
  const custom = localStorage.getItem('volp_custom_backend_url');
  if (custom && custom.trim()) {
    let clean = custom.trim().replace(/\/+$/, '');
    if (!clean.endsWith('/api')) {
      clean = `${clean}/api`;
    }
    return clean;
  }
  return import.meta.env.VITE_API_BASE_URL || '/api';
}

export function setCustomBackendUrl(url) {
  if (!url || !url.trim()) {
    localStorage.removeItem('volp_custom_backend_url');
  } else {
    localStorage.setItem('volp_custom_backend_url', url.trim());
  }
}

export function getCustomBackendUrl() {
  return localStorage.getItem('volp_custom_backend_url') || '';
}

export function getTargetHost() {
  const apiBase = getApiBase();
  if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
    try {
      return new URL(apiBase).host;
    } catch {
      return apiBase;
    }
  }
  return 'localhost:3000';
}

export async function checkBackendConnection() {
  const apiBase = getApiBase();
  const fallbackHost = getTargetHost();
  try {
    const res = await fetch(`${apiBase}/health`, { method: 'GET' });
    const data = await res.json().catch(() => ({}));
    const dynamicHost = data.host || fallbackHost;

    if (res.ok) {
      return {
        connected: true,
        status: res.status,
        host: dynamicHost,
        message: `Backend server online at ${dynamicHost}`
      };
    }

    return {
      connected: true,
      status: res.status,
      host: dynamicHost,
      message: `Backend reachable at ${dynamicHost} (Status: ${res.status})`
    };
  } catch {
    return {
      connected: false,
      status: 0,
      host: fallbackHost,
      message: `Cannot connect to backend server at ${fallbackHost}`
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
  const apiBase = getApiBase();
  const host = getTargetHost();
  try {
    const user = { email, password };
    const res = await fetch(`${apiBase}/auth/login`, {
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

    return { 
      success: false, 
      message: data.message || data.error || (res.status === 401 ? 'Invalid password.' : 'Login failed.') 
    };
  } catch {
    return { 
      success: false, 
      isNetworkError: true, 
      message: `Failed to connect to backend server at ${host}` 
    };
  }
}

export async function registerUser(credentials, maybePassword) {
  const apiBase = getApiBase();
  const host = getTargetHost();
  try {
    const user = typeof credentials === 'object'
      ? { ...credentials }
      : { email: credentials, password: maybePassword };

    const res = await fetch(`${apiBase}/auth/register`, {
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

    return { 
      success: false, 
      message: data.message || data.error || 'Registration failed: verification rejected credentials.' 
    };
  } catch {
    return { 
      success: false, 
      isNetworkError: true, 
      message: `Failed to connect to backend server at ${host}` 
    };
  }
}

export async function getCourses(userEmail) {
  const apiBase = getApiBase();
  try {
    if (!userEmail) {
      return { success: false, data: [] };
    }
    const res = await fetch(`${apiBase}/fetch/courses?email=${encodeURIComponent(userEmail)}`);
    if (res.ok) {
      const data = await res.json();
      const rawCourses = data.courses || (Array.isArray(data) ? data : []);
      const normalized = Array.isArray(rawCourses) ? rawCourses.map(normalizeCourse) : [];
      return { success: true, data: normalized };
    }
    return { success: false, data: [] };
  } catch {
    return { success: false, data: [] };
  }
}

export async function getAssignments(userEmail, courseId) {
  const apiBase = getApiBase();
  try {
    if (!userEmail) {
      return { success: false, data: [] };
    }
    let url = `${apiBase}/fetch/assignments?email=${encodeURIComponent(userEmail)}`;
    if (courseId) url += `&courseId=${encodeURIComponent(courseId)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const rawAssignments = data.assignments || (Array.isArray(data) ? data : []);
      const normalized = Array.isArray(rawAssignments) ? rawAssignments.map(normalizeAssignment) : [];
      return { success: true, data: normalized };
    }
    return { success: false, data: [] };
  } catch {
    return { success: false, data: [] };
  }
}
