import { useEffect, useMemo, useState } from 'react';

export default function ProgressRing({ value=0, max=100, size=120, stroke=12, colors=['#7cf5ff','#ff9bfb','#ffe35b'] }){
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value / max));
  const [progress, setProgress] = useState(0);

  useEffect(()=>{
    const id = requestAnimationFrame(()=> setProgress(pct));
    return ()=> cancelAnimationFrame(id);
  }, [pct]);

  const dash = useMemo(()=> String(circ * progress), [circ, progress]);
  const dashArray = `${circ} ${circ}`;
  const gradientId = useMemo(()=> `prg-${Math.random().toString(36).slice(2)}`, []);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="50%" stopColor={colors[1]} />
          <stop offset="100%" stopColor={colors[2]} />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} fill="none" />
      <circle cx={size/2} cy={size/2} r={radius} stroke={`url(#${gradientId})`} strokeWidth={stroke} fill="none" strokeDasharray={dashArray} strokeDashoffset={String(circ - dash)} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontWeight="800" fill="#fbfbff">{Math.round(pct*100)}%</text>
    </svg>
  );
}


