const BASE_URL = "http://localhost:5000/api";

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function apiRegister(name: string, email: string, password: string, type: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, type }),
  });
  return res.json();
}

export async function getCandidates(userId: number) {
  const res = await fetch(`${BASE_URL}/candidates?user_id=${userId}`);
  return res.json();
}

export async function addCandidate(candidate: any) {
  const res = await fetch(`${BASE_URL}/candidates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  });
  return res.json();
}

export async function getJobs(userId: number) {
  const res = await fetch(`${BASE_URL}/jobs?user_id=${userId}`);
  return res.json();
}

export async function addJob(job: any) {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  return res.json();
}

export async function getAssessments(userId: number) {
  const res = await fetch(`${BASE_URL}/assessments?user_id=${userId}`);
  return res.json();
}

export async function addAssessment(assessment: any) {
  const res = await fetch(`${BASE_URL}/assessments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assessment),
  });
  return res.json();
}