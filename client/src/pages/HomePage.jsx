import React, { useEffect, useRef } from "react";
import Logo from "../components/Logo";

const FEATURES = [
  { icon: "◈", label: "One-Line Summary", desc: "Distils any text into a single precise sentence" },
  { icon: "◉", label: "3 Key Points",     desc: "Extracts the most important ideas instantly" },
  { icon: "◎", label: "Sentiment Score",  desc: "Positive, neutral, or negative — in milliseconds" },
];

export default function HomePage({ onNavigate }) {
  const canvasRef = useRef(null);

  /* animated particle field */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, particles, raf;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function makeParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: 120 }, makeParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155,109,255,${p.alpha})`;
        ctx.fill();
      });
      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(155,109,255,${0.12 * (1 - dist/80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div style={s.page}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={s.canvas} />

      {/* Ambient orbs */}
      <div style={s.orb1} />
      <div style={s.orb2} />
      <div style={s.orb3} />

      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <Logo size={34} />
          <span style={s.navName}>LUMINA</span>
        </div>
        <div style={s.navBadge}>AI · Powered</div>
      </nav>

      {/* Hero */}
      <main style={s.hero}>
        {/* Floating logo */}
        <div style={s.logoWrap}>
          <div style={s.logoPulse} />
          <div style={s.logoPulse2} />
          <div style={s.logoInner}>
            <Logo size={72} />
          </div>
        </div>

        <div style={s.eyebrow}>Text Intelligence Engine</div>

        <h1 style={s.headline}>
          <span style={s.headLine1}>UNDERSTAND</span>
          <span style={s.headLine2}>ANY TEXT</span>
          <span style={s.headLine3}>INSTANTLY</span>
        </h1>

        <p style={s.sub}>
          Paste any document, article, or note — get a clean summary,<br/>
          key insights, and sentiment in under 3 seconds.
        </p>

        {/* CTA */}
        <button style={s.cta} onClick={() => onNavigate("analyze")}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(240,192,96,0.45), 0 0 120px rgba(0,229,204,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(240,192,96,0.25), 0 0 80px rgba(0,229,204,0.1)"; }}
        >
          <span style={s.ctaIcon}>⚡</span>
          Start Analyzing
          <span style={s.ctaArrow}>→</span>
        </button>

        <p style={s.hint}>No sign-up required · Free to use · Instant results</p>
      </main>

      {/* Features row */}
      <div style={s.features}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{ ...s.featureCard, animationDelay: `${0.6 + i * 0.15}s` }}>
            <span style={s.featureIcon}>{f.icon}</span>
            <div>
              <p style={s.featureLabel}>{f.label}</p>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={s.footer}>
        Built with React · Node.js · Groq AI &nbsp;·&nbsp; AI Developer Intern Assignment
      </footer>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    display: "flex", flexDirection: "column", alignItems: "center",
    position: "relative", overflow: "hidden",
    background: "radial-gradient(ellipse 80% 60% at 50% 0%, #120a2e 0%, #03020a 60%)",
  },
  canvas: {
    position: "absolute", inset: 0, width: "100%", height: "100%",
    pointerEvents: "none",
  },
  orb1: {
    position: "absolute", width: 600, height: 600,
    borderRadius: "50%", top: "-200px", left: "-150px",
    background: "radial-gradient(circle, rgba(155,109,255,0.12) 0%, transparent 70%)",
    animation: "orb-drift 18s ease-in-out infinite",
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute", width: 500, height: 500,
    borderRadius: "50%", top: "10%", right: "-100px",
    background: "radial-gradient(circle, rgba(0,229,204,0.10) 0%, transparent 70%)",
    animation: "orb-drift 22s ease-in-out infinite reverse",
    pointerEvents: "none",
  },
  orb3: {
    position: "absolute", width: 400, height: 400,
    borderRadius: "50%", bottom: "5%", left: "30%",
    background: "radial-gradient(circle, rgba(240,192,96,0.07) 0%, transparent 70%)",
    animation: "orb-drift 26s ease-in-out infinite",
    pointerEvents: "none",
  },
  nav: {
    width: "100%", maxWidth: 1100,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "24px 40px", position: "relative", zIndex: 10,
    animation: "fadeIn 0.6s ease both",
  },
  navBrand: { display: "flex", alignItems: "center", gap: 12 },
  navName: {
    fontFamily: "var(--font-head)", fontSize: 26, letterSpacing: "0.12em",
    background: "linear-gradient(90deg, #f0c060, #00e5cc)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  navBadge: {
    fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--teal)",
    border: "1px solid rgba(0,229,204,0.3)", padding: "4px 12px",
    borderRadius: 99, letterSpacing: "0.1em",
    background: "rgba(0,229,204,0.06)",
  },
  hero: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    textAlign: "center", padding: "20px 24px 0",
    position: "relative", zIndex: 5, maxWidth: 800,
  },
  logoWrap: {
    position: "relative", marginBottom: 36,
    animation: "float 6s ease-in-out infinite",
  },
  logoPulse: {
    position: "absolute", inset: -20,
    borderRadius: "50%",
    border: "1px solid rgba(240,192,96,0.25)",
    animation: "pulse-ring 2.5s ease-out infinite",
  },
  logoPulse2: {
    position: "absolute", inset: -10,
    borderRadius: "50%",
    border: "1px solid rgba(0,229,204,0.2)",
    animation: "pulse-ring 2.5s ease-out infinite 1.25s",
  },
  logoInner: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 24, padding: 20,
    backdropFilter: "blur(12px)",
    boxShadow: "0 0 60px rgba(155,109,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
  },
  eyebrow: {
    fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em",
    color: "var(--teal)", textTransform: "uppercase",
    marginBottom: 20,
    animation: "fadeUp 0.7s ease 0.1s both",
  },
  headline: {
    display: "flex", flexDirection: "column", gap: 0,
    marginBottom: 28,
    animation: "fadeUp 0.7s ease 0.2s both",
  },
  headLine1: {
    fontFamily: "var(--font-head)", fontSize: "clamp(64px, 12vw, 110px)",
    lineHeight: 0.9, letterSpacing: "0.04em",
    color: "var(--text)",
  },
  headLine2: {
    fontFamily: "var(--font-head)", fontSize: "clamp(64px, 12vw, 110px)",
    lineHeight: 0.9, letterSpacing: "0.04em",
    background: "linear-gradient(90deg, #f0c060 0%, #00e5cc 50%, #9b6dff 100%)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    animation: "fadeUp 0.7s ease 0.2s both, shimmer 4s linear infinite",
  },
  headLine3: {
    fontFamily: "var(--font-head)", fontSize: "clamp(64px, 12vw, 110px)",
    lineHeight: 0.9, letterSpacing: "0.04em",
    color: "rgba(255,255,255,0.15)",
    WebkitTextStroke: "1px rgba(255,255,255,0.2)",
  },
  sub: {
    fontSize: 17, color: "var(--text2)", lineHeight: 1.8,
    marginBottom: 44, maxWidth: 520,
    animation: "fadeUp 0.7s ease 0.35s both",
  },
  cta: {
    display: "flex", alignItems: "center", gap: 12,
    background: "linear-gradient(135deg, #f0c060 0%, #e8a030 40%, #00e5cc 100%)",
    border: "none", borderRadius: 99,
    padding: "18px 44px", cursor: "pointer",
    fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 17,
    color: "#0a0818",
    boxShadow: "0 0 40px rgba(240,192,96,0.25), 0 0 80px rgba(0,229,204,0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    animation: "fadeUp 0.7s ease 0.5s both",
    letterSpacing: "0.02em",
  },
  ctaIcon: { fontSize: 20 },
  ctaArrow: { fontSize: 20, marginLeft: 4 },
  hint: {
    marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 11,
    color: "var(--text3)", letterSpacing: "0.08em",
    animation: "fadeUp 0.7s ease 0.65s both",
  },
  features: {
    display: "flex", gap: 16, padding: "48px 40px 40px",
    flexWrap: "wrap", justifyContent: "center",
    position: "relative", zIndex: 5, width: "100%", maxWidth: 1000,
  },
  featureCard: {
    display: "flex", alignItems: "flex-start", gap: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14, padding: "18px 22px",
    flex: "1 1 260px", maxWidth: 320,
    backdropFilter: "blur(12px)",
    animation: "fadeUp 0.6s ease both",
    transition: "border-color 0.2s, background 0.2s",
  },
  featureIcon: {
    fontSize: 22, color: "var(--gold)", flexShrink: 0, marginTop: 2,
  },
  featureLabel: {
    fontWeight: 600, fontSize: 14, marginBottom: 4, color: "var(--text)",
  },
  featureDesc: { fontSize: 13, color: "var(--text2)", lineHeight: 1.5 },
  footer: {
    fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)",
    padding: "20px", textAlign: "center",
    position: "relative", zIndex: 5, letterSpacing: "0.06em",
  },
};
