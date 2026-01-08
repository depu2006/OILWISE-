// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ---- In-memory "DB" (for demo only) ----
let users = [];       // {id, name, email, password, role, state, district}
let usageEntries = []; // {id, userId, state, district, date, oilMl}
let nextUserId = 1;
let nextUsageId = 1;

// ---- Helpers ----
function makeToken(user) {
  return `user-${user.id}`;
}

function getUserFromToken(authHeader) {
  if (!authHeader) return null;
  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) return null;
  const parts = token.split('-');
  if (parts[0] !== 'user') return null;
  const id = Number(parts[1]);
  if (!id) return null;
  return users.find(u => u.id === id) || null;
}

// ---- Middleware ----
function auth(req, res, next) {
  const user = getUserFromToken(req.header('Authorization') || '');
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
}

function requirePolicymaker(req, res, next) {
  if (!req.user || req.user.role !== 'policymaker') {
    return res.status(403).json({ error: 'Policymaker only' });
  }
  next();
}

// ---- AUTH ROUTES ----

// Signup
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role, state, district } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, role required' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const user = {
    id: nextUserId++,
    name,
    email,
    password, // plain text just for demo
    role: role === 'policymaker' ? 'policymaker' : 'user',
    state: state || null,
    district: district || null,
  };

  users.push(user);
  const token = makeToken(user);
  res.json({ token, user });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const token = makeToken(user);
  res.json({ token, user });
});

// Get current user
app.get('/api/auth/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// ---- USER: usage logging ----

// Add usage entry (normal user)
app.post('/api/usage', auth, (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(400).json({ error: 'Only normal users can log usage' });
  }

  const { date, oilMl } = req.body;
  if (!date || !oilMl) {
    return res.status(400).json({ error: 'date and oilMl required' });
  }

  const entry = {
    id: nextUsageId++,
    userId: req.user.id,
    state: req.user.state || 'Unknown',
    district: req.user.district || 'Unknown',
    date,
    oilMl: Number(oilMl),
  };

  usageEntries.push(entry);
  res.json({ entry });
});

// Get current user's entries
app.get('/api/usage/mine', auth, (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(400).json({ error: 'Only normal users' });
  }

  const myEntries = usageEntries
    .filter(e => e.userId === req.user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json({ entries: myEntries });
});

// ---- POLICYMAKER: summary stats ----
app.get('/api/stats/summary', auth, requirePolicymaker, (req, res) => {
  const stateTotals = {};    // state -> { totalOilMl, districts:Set }
  const districtTotals = {}; // "state|district" -> { state, district, totalOilMl }

  usageEntries.forEach(e => {
    // state
    if (!stateTotals[e.state]) {
      stateTotals[e.state] = { totalOilMl: 0, districts: new Set() };
    }
    stateTotals[e.state].totalOilMl += e.oilMl;
    stateTotals[e.state].districts.add(e.district);

    // district
    const key = `${e.state}|${e.district}`;
    if (!districtTotals[key]) {
      districtTotals[key] = { state: e.state, district: e.district, totalOilMl: 0 };
    }
    districtTotals[key].totalOilMl += e.oilMl;
  });

  const byState = Object.entries(stateTotals).map(([state, v]) => ({
    state,
    totalOilMl: v.totalOilMl,
    districtsCount: v.districts.size,
  }));

  const byDistrict = Object.values(districtTotals);

  res.json({ byState, byDistrict });
});

// ---- Start server ----
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
