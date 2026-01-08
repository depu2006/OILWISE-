import { useEffect, useState } from 'react';

export default function LevelToast({ visible=false, level=1, onClose }){
  const [show, setShow] = useState(visible);
  useEffect(()=> setShow(visible), [visible]);
  useEffect(()=>{
    if (!show) return;
    const t = setTimeout(()=>{ setShow(false); onClose && onClose(); }, 2500);
    return ()=> clearTimeout(t);
  },[show,onClose]);

  if (!show) return null;
  return (
    <div style={{ position:'fixed', right:16, bottom:16, zIndex:9999 }}>
      <div className="panel" style={{ display:'flex', alignItems:'center', gap:10, borderColor:'rgba(255,227,91,0.5)', boxShadow:'0 10px 24px rgba(255,227,91,0.25)'}}>
        <span className="badge-pill">Level Up!</span>
        <div style={{fontWeight:800}}>You reached Level {level} 🎉</div>
      </div>
    </div>
  );
}


