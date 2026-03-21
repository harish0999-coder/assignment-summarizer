import React, { useState, useRef } from "react";
import Logo from "../components/Logo";
import ResultCard from "../components/ResultCard";

const EXAMPLES = [
  {
    label: "Tech News",
    text: `Tesla announced its next-generation Autopilot system in early 2024, claiming it reduces accident rates by 40% compared to human drivers. The new system uses a custom AI chip processing 144 trillion operations per second, replacing the previous radar-based approach with pure vision. CEO Elon Musk stated full self-driving capability would be available in select US cities by end of year, though regulatory approval from the NHTSA remains pending.`,
  },
  {
    label: "Climate",
    text: `The global plastic pollution crisis has reached catastrophic levels, with over 8 million tonnes of plastic entering the oceans every year. Marine biologists report that more than 700 species of sea animals are now affected, with microplastics detected in the deepest ocean trenches. Despite international pledges, plastic production has increased 20% since 2015. Scientists warn that without drastic intervention within the next decade, ocean ecosystems may face irreversible collapse.`,
  },
  {
    label: "Business",
    text: `Amazon reported Q3 2024 earnings of $143 billion in net sales, a 13% increase year-over-year. AWS cloud division contributed $27.5 billion, growing at 19% and accounting for the majority of operating profit. The company added 75,000 warehouse employees ahead of the holiday season while simultaneously expanding its drone delivery program to three additional US cities.`,
  },
];

export default function AnalyzePage({ onNavigate }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  function handleChange(e) {
    setText(e.target.value);
    if (error) setError(null);
    if (result) setResult(null);
  }

  function loadExample(ex) {
    setText(ex.text);
    setError(null);
    setResult(null);
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setText(ev.target.result); setError(null); setResult(null); };
    reader.readAsText(file);
    e.target.value = "";
  }

  async function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 10) { setError("Please enter at least 10 characters."); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const API = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setResult(data);
    } catch (err) {
      setError(err.message.includes("fetch") ? "Cannot reach backend. Is the server running?" : err.message);
    } finally {
      setLoading(false);
    }
  }

  const charCount = text.length;
  const isReady = text.trim().length >= 10;

  return (
    <div style={s.page}>
      <div style={s.orb1} /><div style={s.orb2} />
      <header style={s.header}>
        <button style={s.backBtn} onClick={() => onNavigate("home")}>← Back</button>
        <div style={s.brand}>
          <Logo size={28} />
          <span style={s.brandName}>LUMINA</span>
        </div>
        <div style={s.headerRight}>
          <span style={s.statusDot} />
          <span style={s.statusText}>Ready</span>
        </div>
      </header>
      <div style={s.titleRow}>
        <h2 style={s.pageTitle}>Text Analyzer</h2>
        <p style={s.pageSubtitle}>Paste your text below and let AI do the work</p>
      </div>
      <div style={s.layout}>
        <div style={s.panel}>
          <div style={s.panelTop}>
            <span style={s.panelLabel}>INPUT TEXT</span>
            <div style={s.exampleBtns}>
              {EXAMPLES.map((ex, i) => (
                <button key={i} style={s.exBtn}
                  onClick={() => loadExample(ex)}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(240,192,96,0.5)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >{ex.label}</button>
              ))}
              <button style={s.exBtn} onClick={() => fileRef.current?.click()}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,229,204,0.5)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >📄 Upload</button>
              <input ref={fileRef} type="file" accept=".txt,.md" style={{display:"none"}} onChange={handleFile}/>
            </div>
          </div>
          <div style={s.textareaWrap}>
            <textarea
              style={s.textarea}
              value={text}
              onChange={handleChange}
              onKeyDown={e => (e.ctrlKey||e.metaKey)&&e.key==="Enter"&&handleSubmit()}
              placeholder="Paste any article, note, report, or document here…&#10;&#10;Tip: Press Ctrl+Enter to analyze"
              spellCheck={false}
            />
            <div style={s.charBadge}>
              <span style={{color: charCount > 9000 ? "var(--neg)" : "var(--text3)"}}>
                {charCount.toLocaleString()} / 10,000
              </span>
            </div>
          </div>
          <button
            style={{
              ...s.submitBtn,
              opacity: loading ? 0.7 : 1,
              background: isReady ? "linear-gradient(135deg, #f0c060, #00e5cc)" : "rgba(255,255,255,0.06)",
              color: isReady ? "#0a0818" : "var(--text3)",
              cursor: isReady ? "pointer" : "default",
            }}
            onClick={handleSubmit}
            disabled={loading}
            onMouseEnter={e => isReady && (e.currentTarget.style.transform="scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform="scale(1)")}
          >
            {loading ? (
              <span style={s.loadRow}><span style={s.spinner}/>Analyzing with AI…</span>
            ) : (
              <span style={s.loadRow}><span>⚡</span> Analyze Text<span style={{fontSize:12, opacity:0.7, marginLeft:4}}>⌘↵</span></span>
            )}
          </button>
        </div>
        <div style={s.panel}>
          <div style={s.panelTop}>
            <span style={s.panelLabel}>RESULT</span>
            {result && <span style={s.doneTag}>✓ Complete</span>}
          </div>
          <div style={s.outputArea}>
            {!result && !loading && !error && (
              <div style={s.empty}>
                <div style={s.emptyOrb}/>
                <div style={s.emptyIcon}>◎</div>
                <p style={s.emptyTitle}>Awaiting Analysis</p>
                <p style={s.emptyHint}>summary · key points · sentiment</p>
              </div>
            )}
            {loading && (
              <div style={s.empty}>
                <div style={{...s.emptyIcon, animation:"spin 1.5s linear infinite", color:"var(--gold)"}}>◌</div>
                <p style={s.emptyTitle}>Processing…</p>
                <p style={s.emptyHint}>Sending to Groq AI · Usually 2–4s</p>
              </div>
            )}
            {error && !loading && (
              <div style={s.errorBox}>
                <div style={s.errorIcon}>⚠</div>
                <div>
                  <p style={s.errorTitle}>Error</p>
                  <p style={s.errorMsg}>{error}</p>
                </div>
              </div>
            )}
            {result && !loading && <ResultCard result={result} />}
          </div>
        </div>
      </div>
      <footer style={s.footer}>Lumina AI · React + Groq · Results are AI-generated</footer>
    </div>
  );
}

const s = {
  page: { minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", position:"relative", overflow:"hidden", background:"radial-gradient(ellipse 100% 50% at 50% -10%, #0e0730 0%, #03020a 55%)" },
  orb1: { position:"absolute", width:700, height:700, borderRadius:"50%", top:"-300px", right:"-200px", background:"radial-gradient(circle, rgba(155,109,255,0.08) 0%, transparent 70%)", pointerEvents:"none" },
  orb2: { position:"absolute", width:500, height:500, borderRadius:"50%", bottom:"0", left:"-100px", background:"radial-gradient(circle, rgba(0,229,204,0.06) 0%, transparent 70%)", pointerEvents:"none" },
  header: { width:"100%", maxWidth:1200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 32px", position:"relative", zIndex:10 },
  backBtn: { background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)", color:"var(--text2)", padding:"8px 18px", borderRadius:99, fontSize:13, cursor:"pointer", fontFamily:"var(--font-body)", transition:"all 0.15s" },
  brand: { display:"flex", alignItems:"center", gap:10 },
  brandName: { fontFamily:"var(--font-head)", fontSize:22, letterSpacing:"0.1em", background:"linear-gradient(90deg,#f0c060,#00e5cc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
  headerRight: { display:"flex", alignItems:"center", gap:8 },
  statusDot: { width:8, height:8, borderRadius:"50%", background:"var(--pos)", boxShadow:"0 0 8px var(--pos)" },
  statusText: { fontFamily:"var(--font-mono)", fontSize:11, color:"var(--pos)" },
  titleRow: { textAlign:"center", padding:"4px 24px 28px", position:"relative", zIndex:5, animation:"fadeUp 0.5s ease both" },
  pageTitle: { fontFamily:"var(--font-head)", fontSize:52, letterSpacing:"0.05em", background:"linear-gradient(90deg, #f0eeff, rgba(240,240,255,0.5))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 },
  pageSubtitle: { color:"var(--text2)", fontSize:14, marginTop:8 },
  layout: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, width:"100%", maxWidth:1200, padding:"0 32px", flex:1, position:"relative", zIndex:5, height:"calc(100vh - 200px)" },
  panel: { background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", borderRadius:18, display:"flex", flexDirection:"column", overflow:"hidden", backdropFilter:"blur(16px)", boxShadow:"0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.05)", animation:"fadeUp 0.5s ease 0.1s both" },
  panelTop: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.02)" },
  panelLabel: { fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:"0.15em", color:"var(--text3)", textTransform:"uppercase" },
  exampleBtns: { display:"flex", gap:6, flexWrap:"wrap" },
  exBtn: { background:"transparent", border:"1px solid var(--border)", color:"var(--text2)", padding:"3px 10px", borderRadius:99, fontSize:11, cursor:"pointer", fontFamily:"var(--font-body)", transition:"border-color 0.15s" },
  textareaWrap: { flex:1, position:"relative" },
  textarea: { width:"100%", height:"100%", resize:"none", background:"transparent", border:"none", outline:"none", color:"var(--text)", fontFamily:"var(--font-mono)", fontSize:13, lineHeight:1.8, padding:"16px 16px 40px" },
  charBadge: { position:"absolute", bottom:10, right:14, fontFamily:"var(--font-mono)", fontSize:10 },
  submitBtn: { margin:"16px", borderRadius:12, border:"none", padding:"14px", fontFamily:"var(--font-body)", fontWeight:700, fontSize:15, transition:"transform 0.15s", boxShadow:"0 4px 24px rgba(0,0,0,0.3)" },
  loadRow: { display:"flex", alignItems:"center", justifyContent:"center", gap:10 },
  spinner: { width:16, height:16, borderRadius:"50%", border:"2px solid rgba(10,8,24,0.3)", borderTopColor:"#0a0818", display:"inline-block", animation:"spin 0.8s linear infinite" },
  outputArea: { flex:1, overflowY:"auto", padding:16 },
  empty: { height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, position:"relative" },
  emptyOrb: { position:"absolute", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(155,109,255,0.08) 0%, transparent 70%)" },
  emptyIcon: { fontSize:40, color:"var(--purple)", lineHeight:1, position:"relative" },
  emptyTitle: { fontFamily:"var(--font-head)", fontSize:20, letterSpacing:"0.05em", color:"var(--text2)", position:"relative" },
  emptyHint: { fontFamily:"var(--font-mono)", fontSize:11, color:"var(--text3)", letterSpacing:"0.08em", position:"relative" },
  errorBox: { display:"flex", gap:14, alignItems:"flex-start", background:"rgba(255,95,126,0.08)", border:"1px solid rgba(255,95,126,0.25)", padding:"16px", borderRadius:12 },
  errorIcon: { fontSize:20, color:"var(--neg)", flexShrink:0 },
  errorTitle: { fontWeight:700, fontSize:14, color:"var(--neg)", marginBottom:4 },
  errorMsg: { fontSize:13, color:"var(--text2)", lineHeight:1.6 },
  doneTag: { fontFamily:"var(--font-mono)", fontSize:10, color:"var(--pos)", background:"rgba(34,212,138,0.1)", padding:"3px 10px", borderRadius:99, border:"1px solid rgba(34,212,138,0.2)" },
  footer: { fontFamily:"var(--font-mono)", fontSize:10, color:"var(--text3)", padding:"16px", textAlign:"center", letterSpacing:"0.06em", position:"relative", zIndex:5 },
};
