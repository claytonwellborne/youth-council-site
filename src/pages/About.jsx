import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  const stats = [
    { label: "Founding Year", value: "2025" },
    { label: "Pilot Chapters", value: "3" },
    { label: "Programs Planned", value: "6" },
    { label: "Target Members", value: "500+" },
  ];

  const timeline = [
    {
      year: "2025",
      title: "Project 18 Launch",
      text: "Founded with the vision to give youth a real seat at the table—starting with pilot chapters in Texas.",
    },
    {
      year: "2026",
      title: "Expansion",
      text: "Grow to 10+ chapters nationwide, introducing debate forums and community sprint projects.",
    },
    {
      year: "2027",
      title: "National Network",
      text: "Build a connected hub of 1,000+ members sharing playbooks, resources, and policy briefs.",
    },
  ];

  const faqs = [
    {
      q: "What is Project 18?",
      a: "A student‑led, nonpartisan initiative building practical leadership, debate, and service programs so young people can make real change—starting locally.",
    },
    {
      q: "Who can join?",
      a: "Students and young adults 14–24. Educators and community partners can support as advisors or hosts.",
    },
    {
      q: "Is it affiliated with a party?",
      a: "No. We protect an open forum for ideas and evidence. Members can hold any view while following our civility rules.",
    },
    {
      q: "How do chapters work?",
      a: "A small founding team at a school or city forms a chapter, adopts our playbooks, and ships one 6–8 week project each term.",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <span style={styles.kicker}>About Project 18</span>
          <h1 style={styles.h1}>Young leaders. Real outcomes.</h1>
          <p style={styles.lead}>
            We’re building a nationwide network where youth learn to lead by doing—
            running forums, publishing research, and delivering community projects
            that actually move the needle.
          </p>
          <div style={styles.ctaRow}>
            <Link to="/programs" style={{...styles.btn, ...styles.btnPrimary}}>Explore Programs</Link>
            <Link to="/apply" style={{...styles.btn, ...styles.btnGhost}}>Start a Chapter</Link>
          </div>
        </div>
        <div aria-hidden style={styles.bgOrb} />
      </section>

      {/* Story */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.grid2}>
            <div>
              <h2 style={styles.h2}>Our story</h2>
              <p style={styles.p}>
                Project 18 began with a simple frustration: youth voices are loud online
                and absent where decisions happen. We set out to build a space where
                young people practice the hard skills—research, debate, project
                management—and then apply them on real problems in schools and cities.
              </p>
              <p style={styles.p}>
                Everything is designed to be shipped quickly and clearly measured. No
                endless meetings. No performative politics. Just reps, results, and
                respect.
              </p>
            </div>
            <div>
              <ul style={styles.statList}>
                {stats.map((s) => (
                  <li key={s.label} style={styles.statItem}>
                    <div style={styles.statValue}>{s.value}</div>
                    <div style={styles.statLabel}>{s.label}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{...styles.section, background: "var(--card)"}}>
        <div style={styles.container}>
          <h2 style={styles.h2}>Timeline</h2>
          <div style={styles.timeline}>
            {timeline.map((t, i) => (
              <div key={i} style={styles.timelineItem}>
                <div style={styles.timelineYear}>{t.year}</div>
                <div>
                  <h3 style={styles.h3}>{t.title}</h3>
                  <p style={styles.p}>{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who, What, When, Why, How */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.h2}>Who, What, When, Why, How</h2>
          <div style={styles.grid2}>
            <div>
              <h3 style={styles.h3}>Who</h3>
              <p style={styles.p}>Youth ages 14–24, educators, and community partners who believe in building a stronger democracy together.</p>
              <h3 style={styles.h3}>What</h3>
              <p style={styles.p}>A nationwide network of youth‑led chapters running leadership labs, debate forums, and service sprints.</p>
              <h3 style={styles.h3}>When</h3>
              <p style={styles.p}>Launched in 2025, with pilots now and growth planned each year forward.</p>
            </div>
            <div>
              <h3 style={styles.h3}>Why</h3>
              <p style={styles.p}>Because youth deserve more than a future vote—they deserve a present voice. Project 18 trains them to use it.</p>
              <h3 style={styles.h3}>How</h3>
              <p style={styles.p}>Through playbooks, mentorship, and rapid project cycles that turn ideas into measurable action in under 2 months.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{...styles.section, background: "var(--card)"}}>
        <div style={styles.container}>
          <h2 style={styles.h2}>FAQ</h2>
          <div style={styles.faqCol}>
            {faqs.map((f, i) => (
              <details key={i} style={styles.faqItem}>
                <summary style={styles.faqQ}>{f.q}</summary>
                <p style={styles.p}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.section}>
        <div style={{...styles.container, textAlign: "center"}}>
          <h2 style={styles.h2}>Ready to build your chapter?</h2>
          <p style={{...styles.p, maxWidth: 680, margin: "0 auto 24px"}}>
            Launch with our starter kit: outreach templates, event guides, and a
            simple first project you can run in under two months.
          </p>
          <Link to="/apply" style={{...styles.btn, ...styles.btnPrimary}}>Apply to Start</Link>
        </div>
      </section>
    </main>
  );
}

const styles = {
  hero: {
    position: "relative",
    padding: "96px 0 64px",
    overflow: "hidden",
    background: "var(--bg)",
  },
  heroInner: {
    width: "min(1100px, 92%)",
    margin: "0 auto",
    textAlign: "center",
  },
  kicker: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    background: "var(--card)",
    border: "1px solid var(--border)",
  },
  h1: {
    margin: "16px auto 12px",
    fontSize: 48,
    lineHeight: 1.1,
  },
  lead: {
    margin: "0 auto 22px",
    maxWidth: 760,
    fontSize: 18,
    opacity: 0.9,
  },
  ctaRow: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  btn: {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    textDecoration: "none",
  },
  btnPrimary: {
    background:
      "linear-gradient(135deg, rgba(255,0,0,0.35), rgba(0,102,255,0.35))",
    backdropFilter: "blur(6px)",
  },
  btnGhost: {
    background: "transparent",
  },
  bgOrb: {
    position: "absolute",
    inset: "-20% -20% auto auto",
    width: 520,
    height: 520,
    borderRadius: "50%",
    background:
      "radial-gradient(closest-side, rgba(0,102,255,0.35), rgba(255,0,0,0.35), transparent 70%)",
    filter: "blur(60px)",
    opacity: 0.6,
    pointerEvents: "none",
  },
  section: { padding: "56px 0" },
  container: { width: "min(1100px, 92%)", margin: "0 auto" },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 28,
  },
  statList: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  statItem: {
    padding: 16,
    border: "1px solid var(--border)",
    borderRadius: 16,
    background: "var(--card)",
  },
  statValue: { fontSize: 24, fontWeight: 700 },
  statLabel: { opacity: 0.8 },
  h2: { fontSize: 32, margin: "0 0 14px" },
  h3: { fontSize: 18, margin: "0 0 8px" },
  p: { lineHeight: 1.6, margin: "0 0 12px" },
  timeline: {
    display: "grid",
    gap: 20,
  },
  timelineItem: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    padding: 16,
    borderLeft: "3px solid var(--border)",
  },
  timelineYear: { fontWeight: 700, fontSize: 20, minWidth: 80 },
  faqCol: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
  },
  faqItem: {
    padding: 16,
    borderRadius: 14,
    border: "1px solid var(--border)",
    background: "var(--bg)",
  },
};
