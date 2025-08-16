import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

console.log("P18 Home render:", new Date().toISOString());

// ---- tiny reveal helper ----
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, { threshold: 0.18 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function CountUp({ to = 100, duration = 1000 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, duration]);
  return <span>{val.toLocaleString()}</span>;
}

// ---- sections ----
function Hero() {
  const { ref, visible } = useReveal();
  return (
    <section
      ref={ref}
      className={visible ? "reveal-in" : "reveal-pre"}
      style={{
        minHeight: "88vh",
        display: "grid",
        placeItems: "center",
        padding: "6rem 1.25rem",
        background:
          "radial-gradient(1200px 600px at 80% -10%, rgba(255,0,0,0.12), transparent), linear-gradient(180deg, #fff, #f8f8f8)",
      }}
    >
      <div style={{ maxWidth: 980, textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.06,
            letterSpacing: -0.5,
            margin: 0,
            fontWeight: 800,
          }}
        >
          One Voice. One Fight. One America.
        </h1>
        <p
          style={{
            marginTop: 18,
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "#444",
          }}
        >
          Project 18 turns motivated students into credible leaders through real work,
          mentorship, and measurable impact.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
          <Link to="/apply" style={primaryBtn}>Become An Ambassador</Link>
          <Link to="/about" style={ghostBtn}>About Us</Link>
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  const pillars = [
    { title: "Diversity", blurb: "Power must reflect the people it serves." },
    { title: "Transparency", blurb: "Trust begins with truth." },
    { title: "Human Rights", blurb: "Without it, you cannot have democracy." },
    { title: "Leadership", blurb: "Leadership is not a title. It’s an obligation to act." },
    { title: "Collaboration", blurb: "The best ideas are forged in friction." },
    { title: "Service", blurb: "Politics is not a performance; it’s service." },
  ];
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} className={visible ? "reveal-in" : "reveal-pre"} style={{ padding: "64px 20px", background: "#fff" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={sectionHead}>Our Values</div>
        <div style={grid6}>
          {pillars.map((p) => (
            <div key={p.title} style={tile}>
              <div style={tileTitle}>{p.title}</div>
              <div style={tileBlurb}>{p.blurb}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Outcomes() {
  const outcomes = [
    { title: "Skills", blurb: "Ship real projects: research, policy writing, comms, events, and leadership." },
    { title: "Network", blurb: "Mentors and partners across campuses, city halls, and DC offices." },
    { title: "Track Record", blurb: "Publish wins you can show: proposals adopted, events delivered, hours served." },
    { title: "Scholarships", blurb: "Stand out with credible work—recommendations, awards, and scholarship pathways." },
  ];
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} className={visible ? "reveal-in" : "reveal-pre"} style={{ padding: "72px 20px", background: "#f7f7f7" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={sectionHead}>What You Get</div>
        <div style={panelWrap}>
          {outcomes.map((o) => (
            <div key={o.title} style={panel}>
              <div style={panelTitle}>{o.title}</div>
              <div style={panelBlurb}>{o.blurb}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} className={visible ? "reveal-in" : "reveal-pre"} style={{ padding: "60px 20px", background: "#fff" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <div style={sectionHead}>Project 18 in Numbers</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 16 }}>
          <div style={metricBox}>
            <div style={metricNum}>{visible ? <CountUp to={250} duration={1200} /> : 0}</div>
            <div style={metricLabel}>Ambassadors</div>
          </div>
          <div style={metricBox}>
            <div style={metricNum}>{visible ? <CountUp to={12} duration={1200} /> : 0}</div>
            <div style={metricLabel}>Chapters</div>
          </div>
          <div style={metricBox}>
            <div style={metricNum}>{visible ? <CountUp to={10400} duration={1400} /> : 0}</div>
            <div style={metricLabel}>Community Hours</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} className={visible ? "reveal-in" : "reveal-pre"} style={{ padding: "80px 20px", background: "linear-gradient(180deg, #fff, #f6f6f6)" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0 }}>Your America. Your Leadership. Start Now.</h2>
        <p style={{ marginTop: 12, color: "#555" }}>Apply in two minutes. We’ll follow up with next steps and a welcome call.</p>
        <div style={{ marginTop: 24 }}>
          <Link to="/apply" style={primaryBtn}>Apply Now</Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Pillars />
      <Outcomes />
      <Metrics />
      <CTA />
    </main>
  );
}

// ---- style objects ----
const primaryBtn = {
  background: "#e50914",
  color: "#fff",
  padding: "14px 18px",
  borderRadius: 12,
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-block",
};
const ghostBtn = {
  background: "transparent",
  color: "#111",
  padding: "14px 18px",
  borderRadius: 12,
  fontWeight: 600,
  textDecoration: "none",
  border: "1px solid #ddd",
};
const sectionHead = {
  fontSize: 14,
  letterSpacing: ".2em",
  textTransform: "uppercase",
  color: "#999",
  marginBottom: 18,
  fontWeight: 700,
};
const grid6 = {
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
  gap: 16,
};
const tile = {
  background: "#fafafa",
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 18,
  minHeight: 120,
};
const tileTitle = {
  fontWeight: 800,
  fontSize: 18,
  marginBottom: 6,
};
const tileBlurb = {
  color: "#555",
  fontSize: 14,
};
const panelWrap = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 18,
};
const panel = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 18,
  padding: 24,
  minHeight: 140,
};
const panelTitle = {
  fontWeight: 800,
  fontSize: 22,
  marginBottom: 8,
};
const panelBlurb = {
  color: "#555",
  fontSize: 15,
};
const metricBox = {
  background: "#fafafa",
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 18,
};
const metricNum = {
  fontWeight: 900,
  fontSize: 36,
  lineHeight: 1,
};
const metricLabel = {
  color: "#666",
  marginTop: 6,
};

// ---- reveal CSS note ----
// Add to src/index.css if not present:
// .reveal-pre { opacity: 0; transform: translateY(16px); transition: opacity .6s ease, transform .6s ease; }
// .reveal-in  { opacity: 1; transform: translateY(0); }

