import React, { useEffect, useRef, useState } from "react";

const WORDS = ["Summarize.", "Analyze.", "Understand.", "Illuminate."];

export default function LandingPage({ onEnter }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % WORDS.length); setVisible(true); }, 400);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let raf;
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      o: Math.random() * 0.35 + 0.08,
    }));
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,201,122,${p.o})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx*dx+dy*dy);
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(232,201,122,${0.055*(1-d/110)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div style={S.page}>
      <canvas ref={canvasRef} style={S.canvas} />
      <div style={{...S.orb,width:600,height:600,top:-200,left:-150,
        background:"radial-gradient(circle,rgba(232,201,122,0.07) 0%,transparent 70%)",animationDuration:"14s"}} />
      <div style={{...S.orb,width:500,height:500,bottom:-100,right:-100,
        background:"radial-gradient(circle,rgba(78,205,196,0.06) 0%,transparent 70%)",animationDuration:"18s",animationDelay:"-6s"}} />
      <div style={{...S.orb,width:300,height:300,top:"40%",right:"18%",
        background:"radial-gradient(circle,rgba(255,107,157,0.05) 0%,transparent 70%)",animationDuration:"11s",animationDelay:"-3s"}} />

      <nav style={S.nav}>
        <div style={S.logoRow}>
          <div style={S.logoBox}>✦</div>
          <span style={S.logoName}>Luminary</span>
        </div>
        <div style={S.navRight}>
          <span style={S.navTag}>AI · Free · Instant</span>
          <button style={S.navBtn} onClick={onEnter}>Launch App →</button>
        </div>
      </nav>

      <main style={S.hero}>
        <div style={S.heroLeft}>
          <div style={S.badge}>
            <span style={S.badgeDot} />
            Powered by Groq LLM · Sub-2s responses
          </div>

          <h1 style={S.h1}>
            <span style={S.h1a}>Turn Chaos Into</span>
            <br />
            <span style={{
              ...S.h1b,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
            }}>{WORDS[wordIdx]}</span>
          </h1>

          <p style={S.sub}>
            Drop any unstructured text — articles, meeting notes, reports — and receive
            a crisp summary, three key insights, and a sentiment reading in seconds.
          </p>

          <div style={S.ctaRow}>
            <button style={S.ctaBtn} onClick={onEnter}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{flexShrink:0}}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Start Analyzing
            </button>
            <div style={S.orDivider}>
              <span style={S.orText}>or try an example below ↓</span>
            </div>
          </div>

          <div style={S.stats}>
            {[{v:"< 2s",l:"Response"},{v:"3",l:"Key Points"},{v:"100%",l:"Free"}].map((s,i)=>(
              <div key={i} style={{...S.stat, animationDelay:`${0.7+i*0.12}s`}}>
                <span style={S.statN}>{s.v}</span>
                <span style={S.statL}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={S.heroRight}>
          <MockCard />
        </div>
      </main>

      <section style={S.strip}>
        {[
          {icon:"⚡",t:"Blazing Fast",d:"Groq's LPU inference delivers results in under 2 seconds"},
          {icon:"🎯",t:"Always Structured",d:"Summary, 3 key points, sentiment — consistent every time"},
          {icon:"🔒",t:"Secure",d:"API keys stay server-side. Nothing stored in your browser"},
          {icon:"📁",t:"File Upload",d:"Paste text or drag in .txt / .md files directly"},
        ].map((f,i)=>(
          <div key={i} style={S.stripItem}>
            <span style={S.stripIcon}>{f.icon}</span>
            <div>
              <p style={S.stripT}>{f.t}</p>
              <p style={S.stripD}>{f.d}</p>
            </div>
          </div>
        ))}
      </section>

      <style>{`
        @keyframes floatOrb{0%,100%{transform:translate(0,0)scale(1);}33%{transform:translate(30px,-20px)scale(1.05);}66%{transform:translate(-20px,15px)scale(0.97);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        @keyframes countUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
        @keyframes cardFloat{0%,100%{transform:translateY(0px) rotate(-1.5deg);}50%{transform:translateY(-14px) rotate(-1.5deg);}}
        @keyframes dotPulse2{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.35;transform:scale(0.65);}}
        button:hover{filter:brightness(1.1);}
      `}</style>
    </div>
  );
}

function MockCard() {
  return (
    <div style={{
      background:"var(--bg2)", border:"1px solid rgba(232,201,122,0.15)",
      borderRadius:22, padding:28, width:"100%", maxWidth:400,
      animation:"cardFloat 5s ease-in-out infinite",
      boxShadow:"0 50px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(232,201,122,0.08)",
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <span style={{fontFamily:"var(--ff-mono)",fontSize:10,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.1em"}}>
          Intelligence Report
        </span>
        <span style={{background:"rgba(86,222,160,0.1)",color:"#56dea0",border:"1px solid rgba(86,222,160,0.2)",
          padding:"3px 10px",borderRadius:99,fontSize:11,fontFamily:"var(--ff-mono)"}}>
          ↑ Positive
        </span>
      </div>
      <div style={{marginBottom:18}}>
        <p style={{fontSize:10,color:"var(--text2)",fontFamily:"var(--ff-mono)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>
          Summary
        </p>
        <p style={{fontSize:13,color:"var(--text)",lineHeight:1.65,fontStyle:"italic",fontFamily:"var(--ff-head)"}}>
          "GPT-4o delivers multimodal AI at twice the speed of its predecessor while matching top benchmark scores."
        </p>
      </div>
      <div style={{height:1,background:"var(--border)",marginBottom:18}} />
      <div>
        <p style={{fontSize:10,color:"var(--text2)",fontFamily:"var(--ff-mono)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>
          Key Points
        </p>
        {["Real-time audio, vision & text in one model","88.7% MMLU — matches prior flagship","2× faster than GPT-4 Turbo"].map((pt,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:9,alignItems:"flex-start"}}>
            <div style={{minWidth:22,height:22,borderRadius:6,
              background:"rgba(232,201,122,0.1)",border:"1px solid rgba(232,201,122,0.2)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"var(--ff-mono)",fontSize:10,color:"var(--gold)",flexShrink:0}}>
              {i+1}
            </div>
            <span style={{fontSize:12,color:"var(--text)",lineHeight:1.55}}>{pt}</span>
          </div>
        ))}
      </div>
      <div style={{height:2,marginTop:18,borderRadius:99,
        background:"linear-gradient(90deg,var(--gold),var(--teal),transparent)"}} />
    </div>
  );
}

const S = {
  page:{minHeight:"100vh",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column"},
  canvas:{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0},
  orb:{position:"absolute",borderRadius:"50%",pointerEvents:"none",animation:"floatOrb 14s ease-in-out infinite",zIndex:0},
  nav:{position:"relative",zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",
    padding:"18px 48px",borderBottom:"1px solid var(--border)",
    backdropFilter:"blur(14px)",background:"rgba(5,5,10,0.65)"},
  logoRow:{display:"flex",alignItems:"center",gap:10},
  logoBox:{width:36,height:36,borderRadius:10,
    background:"linear-gradient(135deg,#e8c97a 0%,#f5dfa0 50%,#4ecdc4 100%)",
    display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:18,fontWeight:900,boxShadow:"0 0 22px rgba(232,201,122,0.4)"},
  logoName:{fontFamily:"var(--ff-head)",fontSize:20,fontWeight:700,color:"var(--text)"},
  navRight:{display:"flex",alignItems:"center",gap:14},
  navTag:{fontFamily:"var(--ff-mono)",fontSize:11,color:"var(--gold)",
    background:"rgba(232,201,122,0.08)",border:"1px solid rgba(232,201,122,0.18)",
    padding:"3px 10px",borderRadius:99},
  navBtn:{background:"transparent",border:"1px solid var(--border-hi)",
    color:"var(--text)",padding:"8px 18px",borderRadius:8,
    fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"var(--ff-body)"},
  hero:{position:"relative",zIndex:5,flex:1,
    display:"flex",alignItems:"center",justifyContent:"space-between",
    gap:48,padding:"72px 48px 56px",maxWidth:1280,margin:"0 auto",width:"100%"},
  heroLeft:{flex:1,maxWidth:600},
  heroRight:{flex:"0 0 auto",display:"flex",alignItems:"center",justifyContent:"center",
    animation:"fadeUp 0.6s ease 0.4s both"},
  badge:{display:"inline-flex",alignItems:"center",gap:8,
    fontFamily:"var(--ff-mono)",fontSize:11,color:"var(--gold)",
    background:"rgba(232,201,122,0.07)",border:"1px solid rgba(232,201,122,0.18)",
    padding:"6px 14px",borderRadius:99,marginBottom:26,
    animation:"fadeUp 0.5s ease both"},
  badgeDot:{width:6,height:6,borderRadius:"50%",background:"var(--gold)",display:"inline-block",
    animation:"dotPulse2 2s ease-in-out infinite"},
  h1:{fontFamily:"var(--ff-head)",lineHeight:1.08,marginBottom:22,
    animation:"fadeUp 0.5s ease 0.1s both"},
  h1a:{fontSize:"clamp(38px,4.5vw,60px)",fontWeight:700,color:"var(--text)",display:"block"},
  h1b:{display:"block",fontSize:"clamp(38px,4.5vw,60px)",fontWeight:900,fontStyle:"italic",
    background:"linear-gradient(135deg,var(--gold) 0%,var(--gold2) 40%,var(--teal) 100%)",
    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
    backgroundSize:"200% auto",animation:"shimmer 4s linear infinite"},
  sub:{fontSize:16,color:"var(--text2)",lineHeight:1.85,maxWidth:490,
    marginBottom:32,fontWeight:300,animation:"fadeUp 0.5s ease 0.2s both"},
  ctaRow:{display:"flex",alignItems:"center",gap:18,marginBottom:44,
    animation:"fadeUp 0.5s ease 0.3s both"},
  ctaBtn:{background:"linear-gradient(135deg,#c9a84c,#e8c97a,#4ecdc4)",
    border:"none",color:"#05050a",padding:"13px 28px",borderRadius:12,
    fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"var(--ff-body)",
    boxShadow:"0 8px 30px rgba(232,201,122,0.3)",
    display:"flex",alignItems:"center",gap:8},
  orDivider:{display:"flex",alignItems:"center"},
  orText:{fontSize:13,color:"var(--text3)",fontFamily:"var(--ff-mono)"},
  stats:{display:"flex",gap:28,animation:"fadeUp 0.5s ease 0.4s both"},
  stat:{display:"flex",flexDirection:"column",gap:2,animation:"countUp 0.5s ease both"},
  statN:{fontFamily:"var(--ff-head)",fontSize:30,fontWeight:700,color:"var(--gold)"},
  statL:{fontFamily:"var(--ff-mono)",fontSize:10,color:"var(--text2)",
    textTransform:"uppercase",letterSpacing:"0.1em"},
  strip:{position:"relative",zIndex:5,
    display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,
    borderTop:"1px solid var(--border)",background:"var(--border)"},
  stripItem:{display:"flex",gap:14,alignItems:"flex-start",padding:"24px 28px",background:"var(--bg2)"},
  stripIcon:{fontSize:20,flexShrink:0,marginTop:1},
  stripT:{fontSize:13,fontWeight:600,marginBottom:3,color:"var(--text)"},
  stripD:{fontSize:11,color:"var(--text2)",lineHeight:1.6},
};
