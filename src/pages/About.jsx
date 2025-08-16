import React from "react";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

export default function About(){
  useReveal();

  const timeline = [
    { year: "2025", title: "Project 18 Launch", text: "Founded to give youth a real seat at the table—starting with pilot chapters in Texas." },
    { year: "2026", title: "Expansion", text: "Grow to 10+ chapters nationwide with debate forums and service sprints." },
    { year: "2027", title: "Network", text: "1,000+ members connected by shared playbooks and policy briefs." },
  ];

  const stats = [
    { label: "Founding Year", value: "2025" },
    { label: "Pilot Chapters", value: "3" },
    { label: "Programs Planned", value: "6" },
    { label: "Target Members", value: "500+" },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* color orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-brandBlue/30 to-brandRed/30 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-[22rem] w-[22rem] rounded-full bg-gradient-to-tr from-brandRed/25 to-brandBlue/25 blur-3xl"></div>

        <div className="mx-auto max-w-6xl px-4 pt-28 pb-10 text-center">
          <span className="inline-block text-[12px] tracking-wider uppercase rounded-full border border-zinc-200 px-2 py-1 reveal">About Project 18</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold reveal">Young leaders. <span className="bg-clip-text text-transparent bg-gradient-to-r from-brandRed to-brandBlue">Real outcomes.</span></h1>
          <p className="mt-3 max-w-2xl mx-auto text-zinc-700 reveal">
            We train youth to lead by doing—running forums, publishing research, and delivering community projects that actually move the needle.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3 reveal">
            <Link to="/programs" className="btn btn-gradient">Explore Programs</Link>
            <Link to="/ambassador" className="btn border border-zinc-200 rounded-xl font-semibold px-4 py-3">Start a Chapter</Link>
          </div>
        </div>
      </section>

      {/* Story + Stats */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-6">
          <article className="card p-6 reveal">
            <h2 className="text-2xl font-bold mb-2">Our story</h2>
            <p className="text-zinc-700">
              Project 18 began with a simple frustration: youth voices are loud online and absent where decisions happen. We built a space for real skills—research, debate, project management—and we apply them to local problems.
            </p>
            <p className="text-zinc-700 mt-2">
              Everything ships quickly and is measured clearly. No endless meetings. No performative politics. Just reps, results, and respect.
            </p>
          </article>

          <ul className="grid grid-cols-2 gap-4 reveal">
            {stats.map(s=>(
              <li key={s.label} className="card p-5">
                <div className="text-xl font-extrabold">{s.value}</div>
                <div className="text-zinc-600">{s.label}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-10 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold mb-6 reveal">Timeline</h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brandBlue/40 to-brandRed/40"></div>
            <div className="space-y-4">
              {timeline.map((t,i)=>(
                <div key={i} className="relative grid md:grid-cols-2 gap-4 items-start reveal">
                  <div className="hidden md:block"></div>
                  <div className="card p-5">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-r from-brandBlue to-brandRed"></span>
                      <span className="text-sm font-semibold text-zinc-500">{t.year}</span>
                    </div>
                    <h3 className="text-lg font-bold">{t.title}</h3>
                    <p className="text-zinc-700">{t.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who/What/When/Why/How */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="card p-5 reveal"><h3 className="font-bold mb-1">Who</h3><p className="text-zinc-700">Youth 14–24, educators, and partners building a stronger democracy together.</p></div>
            <div className="card p-5 reveal"><h3 className="font-bold mb-1">What</h3><p className="text-zinc-700">A network of youth-led chapters running leadership labs, debate forums, and service sprints.</p></div>
            <div className="card p-5 reveal"><h3 className="font-bold mb-1">When</h3><p className="text-zinc-700">Launched in 2025; pilots now; growth each year forward.</p></div>
          </div>
          <div className="space-y-4">
            <div className="card p-5 reveal"><h3 className="font-bold mb-1">Why</h3><p className="text-zinc-700">Because youth deserve more than a future vote—they deserve a present voice.</p></div>
            <div className="card p-5 reveal"><h3 className="font-bold mb-1">How</h3><p className="text-zinc-700">Playbooks, mentorship, and rapid cycles that turn ideas into measurable action in under 2 months.</p></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-2 reveal">Ready to build your chapter?</h2>
          <p className="text-zinc-700 max-w-2xl mx-auto mb-5 reveal">
            Launch with our starter kit: outreach templates, event guides, and a simple first project you can run in under two months.
          </p>
          <Link to="/ambassador" className="btn btn-gradient reveal">Apply to Start</Link>
        </div>
      </section>
    </main>
  );
}
