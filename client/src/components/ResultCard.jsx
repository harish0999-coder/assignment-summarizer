import React from "react";

const SENTIMENT = {
  positive: { label:"Positive", color:"#22d48a", bg:"rgba(34,212,138,0.08)", border:"rgba(34,212,138,0.2)", icon:"↑", bar:0.82 },
  neutral:  { label:"Neutral",  color:"#f0c060", bg:"rgba(240,192,96,0.08)",  border:"rgba(240,192,96,0.2)",  icon:"→", bar:0.50 },
  negative: { label:"Negative", color:"#ff5f7e", bg:"rgba(255,95,126,0.08)",  border:"rgba(255,95,126,0.2)",  icon:"↓", bar:0.22 },
};

export default function ResultCard({ result }) {
  const st = SENTIMENT[result.sentiment] || SENTIMENT.neutral;

  return (
    <div style={s.card}>
      {/* Glow accent */}
      <div style={{...s.glow, background:`radial-gradient(circle, ${st.color}22 0%, transparent 70%)`}}/>

      {/* Sentiment header */}
      <div style={{...s.sentHeader, background:st.bg, borderColor:st.border}}>
        <div style={s.sentLeft}>
          <span style={{...s.sentIcon, color:st.color}}>{st.icon}</span>
          <div>
            <div style={s.sentSmall}>Sentiment</div>
            <div style={{...s.sentLabel, color:st.color}}>{st.label}</div>
          </div>
        </div>
        <div style={s.sentBar}>
          <div style={s.sentBarBg}>
            <div style={{...s.sentBarFill, width:`${st.bar*100}%`, background:st.color}}/>
          </div>
          <span style={{...s.sentPct, color:st.color}}>{Math.round(st.bar*100)}%</span>
        </div>
      </div>

      {/* Summary */}
      <div style={s.block}>
        <div style={s.blockHead}>
          <span style={s.blockDot}/> Summary
        </div>
        <p style={s.summaryText}>"{result.summary}"</p>
      </div>

      <div style={s.divider}/>

      {/* Key points */}
      <div style={s.block}>
        <div style={s.blockHead}>
          <span style={{...s.blockDot, background:"var(--teal)"}}/> Key Points
        </div>
        <div style={s.points}>
          {result.keyPoints.map((pt, i) => (
            <div key={i} style={s.point}>
              <div style={s.pointNum}>{String(i+1).padStart(2,"0")}</div>
              <p style={s.pointText}>{pt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer meta */}
      <div style={s.meta}>
        <span style={s.metaItem}>⚡ Groq AI</span>
        <span style={s.metaItem}>◈ 3 insights</span>
        <span style={s.metaItem}>✓ Validated</span>
      </div>
    </div>
  );
}

const s = {
  card: {
    position:"relative", overflow:"hidden",
    borderRadius:14,
    border:"1px solid rgba(255,255,255,0.08)",
    background:"rgba(255,255,255,0.02)",
    animation:"slide-result 0.4s ease both",
  },
  glow: {
    position:"absolute", top:-60, right:-60,
    width:200, height:200, borderRadius:"50%",
    pointerEvents:"none",
  },
  sentHeader: {
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"14px 16px", margin:"12px 12px 0",
    borderRadius:10, border:"1px solid",
  },
  sentLeft: { display:"flex", alignItems:"center", gap:12 },
  sentIcon: { fontSize:24, fontWeight:700, lineHeight:1 },
  sentSmall: { fontFamily:"var(--font-mono)", fontSize:9, color:"var(--text3)", letterSpacing:"0.1em", textTransform:"uppercase" },
  sentLabel: { fontFamily:"var(--font-head)", fontSize:20, letterSpacing:"0.05em", lineHeight:1.2 },
  sentBar: { display:"flex", alignItems:"center", gap:10 },
  sentBarBg: { width:80, height:4, background:"rgba(255,255,255,0.08)", borderRadius:99, overflow:"hidden" },
  sentBarFill: { height:"100%", borderRadius:99, transition:"width 0.8s ease", boxShadow:"0 0 8px currentColor" },
  sentPct: { fontFamily:"var(--font-mono)", fontSize:12, fontWeight:500 },
  block: { padding:"16px 16px 4px" },
  blockHead: {
    display:"flex", alignItems:"center", gap:8,
    fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:"0.12em",
    color:"var(--text3)", textTransform:"uppercase", marginBottom:10,
  },
  blockDot: {
    display:"inline-block", width:6, height:6,
    borderRadius:"50%", background:"var(--gold)",
    boxShadow:"0 0 6px var(--gold)",
  },
  summaryText: {
    fontSize:14, lineHeight:1.8, color:"var(--text)",
    fontStyle:"italic", paddingLeft:14,
    borderLeft:"2px solid rgba(240,192,96,0.3)",
  },
  divider: { height:1, background:"var(--border)", margin:"12px 16px" },
  points: { display:"flex", flexDirection:"column", gap:10 },
  point: { display:"flex", gap:12, alignItems:"flex-start" },
  pointNum: {
    fontFamily:"var(--font-mono)", fontSize:10, color:"var(--teal)",
    minWidth:22, paddingTop:3, letterSpacing:"0.05em",
  },
  pointText: { fontSize:13, lineHeight:1.7, color:"var(--text2)", flex:1 },
  meta: {
    display:"flex", gap:16, padding:"12px 16px",
    borderTop:"1px solid var(--border)",
    background:"rgba(255,255,255,0.01)",
  },
  metaItem: {
    fontFamily:"var(--font-mono)", fontSize:10, color:"var(--text3)",
    letterSpacing:"0.06em",
  },
};
