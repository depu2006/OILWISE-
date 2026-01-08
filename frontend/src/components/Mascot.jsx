export default function Mascot(){
  return (
    <div aria-label="OiloGuard Mascot" title="OiloGuard Mascot" style={{ display:'flex', alignItems:'center', gap:8 }}>
      <svg width="34" height="34" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.35))' }}>
        <defs>
          <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#7cf5ff"/>
            <stop offset="100%" stopColor="#ff9bfb"/>
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#g1)"/>
        <circle cx="24" cy="28" r="4" fill="#0b0f19"/>
        <circle cx="40" cy="28" r="4" fill="#0b0f19"/>
        <path d="M20 43c4 4 20 4 24 0" stroke="#0b0f19" strokeWidth="4" strokeLinecap="round"/>
        <path d="M32 8c6 8 10 14 10 20 0 8-8 14-10 20-2-6-10-12-10-20 0-6 4-12 10-20z" fill="#ffe35b" opacity="0.85"/>
      </svg>
    </div>
  );
}


