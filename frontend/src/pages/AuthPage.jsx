import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const USERS_KEY = 'ow_users_demo';
const TOKEN_KEY = 'ow_token';
const USER_KEY = 'ow_user';

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch { return {}; }
}
function saveUser(email, user) {
  const all = loadUsers(); all[email] = user; localStorage.setItem(USERS_KEY, JSON.stringify(all));
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const u = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    if (token && u) {
      if (u.role === 'policymaker') navigate('/policymaker', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [navigate]);

  function handleSignup(e) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || password.length < 5) {
      setError('Please provide name, email and password (min 5 chars).');
      return;
    }
    const users = loadUsers();
    if (users[email]) { setError('Email already registered. Try sign in.'); return; }
    const userObj = { name, email, password, role, createdAt: new Date().toISOString(), onboarded: role === 'policymaker' ? true : false, popupShown: false };
    saveUser(email, userObj);
    localStorage.setItem(TOKEN_KEY, `demo:${email}`);
    localStorage.setItem(USER_KEY, JSON.stringify(userObj));
    if (role === 'policymaker') navigate('/policymaker', { replace: true });
    else navigate('/', { replace: true });
  }

  function handleSignin(e) {
    e.preventDefault();
    setError(null);
    const users = loadUsers();
    const u = users[email];
    if (!u || u.password !== password) { setError('Invalid credentials'); return; }
    localStorage.setItem(TOKEN_KEY, `demo:${email}`);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    if (u.role === 'policymaker') navigate('/policymaker', { replace: true });
    else navigate('/', { replace: true });
  }

  return (
    <div className="auth-root">
      <div className="auth-bg" />
      <div className="auth-panel">
        <div className="auth-left">
          <div className="brand">
            <div className="brand-badge">🫙</div>
            <div>
              <h1>Oilwise</h1>
              <div className="muted">Reduce oil waste • Convert to benefit • Track consumption</div>
            </div>
          </div>

          <div className="vision">
            <h2>Vision</h2>
            <p>Reduce edible oil waste and convert it into community value and sustainable energy.</p>

            <h2>Mission</h2>
            <ul>
              <li>Make oil tracking usable and rewarding for everyone</li>
              <li>Connect used-oil collection to processing centres</li>
              <li>Provide policymakers anonymized, district-level insights</li>
            </ul>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <div className="tabs">
              <button className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setError(null); }}>Sign in</button>
              <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(null); }}>Sign up</button>
            </div>

            <form onSubmit={mode === 'signup' ? handleSignup : handleSignin} className="auth-form">
              {mode === 'signup' && (
                <>
                  <label className="label">Full name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />

                  <label className="label">Role</label>
                  <div className="role-row">
                    <label><input type="radio" name="role" value="user" checked={role === 'user'} onChange={() => setRole('user')} /> User</label>
                    <label><input type="radio" name="role" value="policymaker" checked={role === 'policymaker'} onChange={() => setRole('policymaker')} /> Policymaker</label>
                  </div>
                </>
              )}

              <label className="label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@domain.com" />

              <label className="label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="min 5 chars" />

              {error && <div className="error">{error}</div>}

              <div className="actions">
                <button type="submit" className="primary">{mode === 'signup' ? 'Create account' : 'Sign in'}</button>
                <button type="button" className="secondary" onClick={() => { setEmail(''); setPassword(''); setName(''); setError(null); }}>Reset</button>
              </div>

              <div className="muted small">Demo: credentials are stored locally for hackathon demo.</div>
            </form>
          </div>

          <div className="footer-note muted small">
            For policymakers we provide aggregated, anonymized analytics.
          </div>
        </div>
      </div>
    </div>
  );
}
