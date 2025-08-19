import { supabase } from "../lib/supabase";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const base = import.meta.env.BASE_URL;
const LOGO = `${base}logos/Black-Logo-No-BG.png`;

// single source of truth for nav items
const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/ambassador", label: "Ambassador" },
  { to: "/press", label: "Press" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isAuthed, setAuthed] = useState(false);
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthed(!!session);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription?.unsubscribe();
  }, []);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev;
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    "px-3 py-2 rounded-md text-sm font-semibold transition-colors " +
    (isActive ? "text-brandRed" : "text-zinc-900 hover:text-brandBlue");

  return (
    <header className={"fixed top-0 inset-x-0 z-50 transition-all " + (scrolled ? "bg-white/70 backdrop-blur-md shadow-sm" : "bg-transparent")}>
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={LOGO} alt="Project 18" className="h-8 w-auto" />
          <span className="sr-only">Project 18</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.to} to={item.to} className={linkClass}>{item.label}</NavLink>
            ))}
            {isAuthed && (<a href="#/admin" className="btn btn-gradient ml-2">Admin</Link>)}
</nav>
          <Link to="/ambassador#apply" className="hidden md:inline-block btn btn-gradient ml-2">Apply</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden relative inline-flex items-center justify-center w-10 h-10"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={"absolute left-1/2 w-6 h-0.5 -translate-x-1/2 bg-zinc-900 transition-transform duration-200 " + (open ? "translate-y-0 rotate-45" : "-translate-y-[6px] rotate-0")}/>
          <span className={"absolute left-1/2 w-6 h-0.5 -translate-x-1/2 bg-zinc-900 transition-opacity duration-200 " + (open ? "opacity-0" : "opacity-100")}/>
          <span className={"absolute left-1/2 w-6 h-0.5 -translate-x-1/2 bg-zinc-900 transition-transform duration-200 " + (open ? "translate-y-0 -rotate-45" : "translate-y-[6px] rotate-0")}/>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={"md:hidden fixed inset-0 z-50 " + (open ? "" : "pointer-events-none")}>
        <div
          className={"absolute inset-0 transition-opacity duration-200 " + (open ? "opacity-100" : "opacity-0")}
          style={{ background: "rgba(255,255,255,0.98)" }}
          onClick={() => setOpen(false)}
        />
        <div
          className={"absolute inset-0 bg-white transform transition-transform duration-250 " + (open ? "translate-y-0" : "-translate-y-full")}
          role="dialog"
          aria-modal="true"
        >
          <div className="px-5 py-4 flex items-center justify-between border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <img src={LOGO} alt="" className="h-7 w-auto" />
            </div>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-zinc-200"
              aria-label="Close menu"
            >
              <span className="block w-5 h-0.5 bg-zinc-900 rotate-45 -translate-y-0.5" />
              <span className="block w-5 h-0.5 bg-zinc-900 -rotate-45 translate-y-0.5 -mt-0.5" />
            </button>
          </div>

          <nav className="px-6 pt-6 space-y-2">
            {NAV_ITEMS.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  "block text-2xl font-semibold " +
                  (isActive ? "text-brandRed" : "text-zinc-900 hover:text-brandBlue")
                }
                style={{ transition: "transform .25s ease, opacity .25s ease", transform: open ? "none" : "translateY(6px)", opacity: open ? 1 : 0, transitionDelay: open ? `${i * 50}ms` : "0ms" }}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/ambassador#apply" onClick={() => setOpen(false)} className="btn btn-gradient inline-block mt-3">Apply</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
