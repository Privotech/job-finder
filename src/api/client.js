const getToken = () => localStorage.getItem("token");
const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

async function requestFormData(path, formData, method = "POST") {
  const token = getToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

export const authApi = {
  register: (body) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/api/auth/me"),
};

export const jobsApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/jobs${q ? `?${q}` : ""}`);
  },
  get: (id) => request(`/api/jobs/${id}`),
  recommendations: (id) => request(`/api/jobs/${id}/recommendations`),
};

export const applicationsApi = {
  my: () => request("/api/applications"),
  create: (body) =>
    request("/api/applications", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  get: (id) => request(`/api/applications/${id}`),
  withdraw: (id) => request(`/api/applications/${id}`, { method: "DELETE" }),
};

export const profileApi = {
  update: (body) =>
    request("/api/profile", { method: "PUT", body: JSON.stringify(body) }),
};

export const savedJobsApi = {
  list: () => request("/api/saved"),
  add: (jobId) =>
    request("/api/saved", { method: "POST", body: JSON.stringify({ jobId }) }),
  remove: (jobId) => request(`/api/saved/${jobId}`, { method: "DELETE" }),
};

export const resumesApi = {
  my: () => request("/api/resumes"),
  upload: (formData) => requestFormData("/api/resumes", formData),
  delete: (id) => request(`/api/resumes/${id}`, { method: "DELETE" }),
  setPrimary: (id) => request(`/api/resumes/${id}/primary`, { method: "PUT" }),
};

export const employerApi = {
  summary: () => request("/api/employer/summary"),
  jobs: () => request("/api/employer/jobs"),
  createJob: (body) =>
    request("/api/employer/jobs", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateJob: (id, body) =>
    request(`/api/employer/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteJob: (id) => request(`/api/employer/jobs/${id}`, { method: "DELETE" }),
  applications: (jobId) => request(`/api/employer/jobs/${jobId}/applications`),
  updateApplicationStatus: (id, status) =>
    request(`/api/employer/applications/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  company: () => request("/api/employer/company"),
  updateCompany: (body) =>
    request("/api/employer/company", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};

export const recommendationsApi = {
  jobs: () => request("/api/recommendations/jobs"),
};

export const adminApi = {
  summary: () => request("/api/admin/summary"),
  users: (params) => {
    const q = new URLSearchParams(params || {}).toString();
    return request(`/api/admin/users${q ? `?${q}` : ""}`);
  },
  banUser: (id) => request(`/api/admin/users/${id}/ban`, { method: "PUT" }),
  jobs: (params) => {
    const q = new URLSearchParams(params || {}).toString();
    return request(`/api/admin/jobs${q ? `?${q}` : ""}`);
  },
  hideJob: (id) => request(`/api/admin/jobs/${id}/hide`, { method: "PUT" }),
};

export default request;
