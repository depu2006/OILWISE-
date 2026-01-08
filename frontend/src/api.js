// src/api.js
export const API_URL = 'http://localhost:4000/api';

export async function api(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    // non-JSON
  }

  if (!res.ok) {
    console.error('API error', res.status, data);
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}
