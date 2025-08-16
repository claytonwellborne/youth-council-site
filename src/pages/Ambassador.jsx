import React from "react";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";
import AmbassadorForm from "../components/AmbassadorForm";

export default function Ambassador(){
  useReveal();

  const committees = [
    {
      title: "Outreach & Chapters",
      points: [
        "Recruit ambassadors and launch new chapters",
        "School partnerships + club onboarding",
        "Run interest meetings + info sessions"
      ]
    },
    {
      title: "Communications",
      points: [
        "Instagram, email, and newsletter ops",
        "Brand voice + content calendar",
        "Ambassador spotlights"
      ]
    },
    {
      title: "Policy & Research",
      points: [
        "Short policy briefs and fact sheets",
        "Debate topics + sources",
        "Support for chapter forums"
      ]
    },
    {
      title: "Events",
      points: [
        "Town halls, debates, service sprints",
        "Run-of-show and hosts",
        "Partnerships + guest speakers"
      ]
    },
    {
      title: "Media & Design",
      points: [
        "Graphics, reels, and photo/video",
        "Template kits for chapters",
        "Website content updates"
      ]
    },
    {
      title: "Tech & Ops",
      points: [
        "Website and forms",
        "Data/CRM hygiene",
        "Playbook + onboarding tooling"
      ]
    },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* color orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-brandBlue/30 to-brandRed/30 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-[22rem] w-[22rem] rounded-full bg-gradient-to-tr from-brandRed/25 to-brandBlue/25 blur-3xl"></div>

        <div className="mx-auto max-w-6xl px-4 pt-28 pb-10 text-center">
          <span className="inline-block text-[12px] tracking-wider uppercase rounded-full border border-zinc-200 px-2 py-1 reveal">
            Ambassador Program
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold reveal">
            Become a Project 18 <span className="bg-clip-text text-transparent bg-gradient-to-r from-brandRed to-brandBlue">Ambassador</span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-zinc-700 reveal">
            Ambassadors are builders. You’ll help launch chapters, run events, and publish useful work—while growing real leadership skills and a national network.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3 reveal">
            <a href="#apply" className="btn btn-gradient">Apply now</a>
            <Link to="/about" className="btn border border-zinc-200 rounded-xl font-semibold px-4 py-3">Learn more</Link>
          </div>
        </div>
      </section>

      {/* WHAT YOU DO */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-6">
          <article className="card p-6 reveal">
            <h2 className="text-2xl font-bold mb-2">What you’ll do</h2>
            <ul className="list-disc pl-5 text-zinc-700 space-y-2">
              <li>Recruit students and help launch/mentor local chapters</li>
              <li>Plan a 6–8 week project (debate forum or service sprint)</li>
              <li>Publish short briefs or highlights from your work</li>
              <li>Coordinate partners, speakers, and venues</li>
            </ul>
          </article>
          <article className="card p-6 reveal">
            <h2 className="text-2xl font-bold mb-2">Time & support</h2>
            <ul className="list-disc pl-5 text-zinc-700 space-y-2">
              <li>~3–5 hrs/week during project cycles</li>
              <li>Playbooks, templates, and weekly check-ins</li>
              <li>Portfolio pieces + recommendation letters</li>
              <li>Leadership pathway to Chapter Lead</li>
            </ul>
          </article>
        </div>
      </section>

      {/* COMMITTEES */}
      <section className="py-10 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold mb-6 reveal">Ambassador Committees</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {committees.map((c, i) => (
              <div key={i} className="card p-5 reveal">
                <h3 className="font-bold mb-1">{c.title}</h3>
                <ul className="list-disc pl-5 text-zinc-700 space-y-1">
                  {c.points.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION */}
      <section id="apply" className="py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-2 reveal">Ambassador Application</h2>
          <p className="text-zinc-700 max-w-2xl mx-auto mb-5 reveal">
            Fill out the form below. We review weekly and follow up with next steps.
          </p>
          <AmbassadorForm />
        </div>
      </section>

    </main>
  );
}
