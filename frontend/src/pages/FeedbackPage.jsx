// frontend/src/pages/FeedbackPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API || 'http://localhost:4000';
const DEMO_USER = 'u1';

export default function FeedbackPage() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [withLocation, setWithLocation] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await axios.get(`${API}/api/feedback`);
    setFeedbackList(res.data.feedback || []);
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setMsg('');
    let lat = null, lng = null;
    if (withLocation && navigator.geolocation) {
      try {
        const pos = await new Promise((resolve, rej) =>
          navigator.geolocation.getCurrentPosition(resolve, rej, { timeout: 8000 })
        );
        lat = pos.coords.latitude; lng = pos.coords.longitude;
      } catch (err) { console.warn('geo err', err); }
    }
    try {
      await axios.post(`${API}/api/feedback`, { userId: DEMO_USER, rating, comment, lat, lng });
      setComment(''); setRating(5);
      setMsg('Thanks — feedback submitted!');
      await load();
    } catch (err) {
      console.error(err);
      setMsg('Failed to submit. Check backend.');
    } finally { setLoading(false); setTimeout(()=>setMsg(''), 3000); }
  }

  return (
    <div className="grid">
      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Give Feedback</h2>
        <form onSubmit={submit} style={{ display:'grid', gap:8 }}>
          <label>Rating: 
            <select value={rating} onChange={e=>setRating(e.target.value)}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
            </select>
          </label>
          <textarea rows="4" placeholder="Your comments" value={comment} onChange={e=>setComment(e.target.value)} />
          <label style={{display:'flex', alignItems:'center', gap:8}}>
            <input type="checkbox" checked={withLocation} onChange={e=>setWithLocation(e.target.checked)} /> Include my location
          </label>
          <div style={{display:'flex', gap:8}}>
            <button className="secondary" type="button" onClick={()=>{ setComment(''); setRating(5); }}>Clear</button>
            <button className="primary" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Submit Feedback'}</button>
          </div>
        </form>
        {msg && <div style={{marginTop:8}} className="muted">{msg}</div>}
      </section>

      <section className="panel">
        <h3 style={{marginTop:0}}>Recent feedback</h3>
        <div style={{maxHeight:420, overflowY:'auto'}}>
          {feedbackList.slice().reverse().map(f => (
            <div key={f.id} style={{padding:10, borderRadius:8, background:'rgba(255,255,255,0.02)', marginBottom:8}}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <div><strong>{'★'.repeat(f.rating)}</strong></div>
                <div className="muted">{new Date(f.createdAt).toLocaleString()}</div>
              </div>
              <div style={{marginTop:6}}>{f.comment}</div>
              {f.lat && f.lng && <div className="muted" style={{marginTop:6}}>At: {f.lat.toFixed(4)}, {f.lng.toFixed(4)}</div>}
            </div>
          ))}
          {feedbackList.length === 0 && <div className="muted">No feedback yet.</div>}
        </div>
      </section>
    </div>
  );
}
