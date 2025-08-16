import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const base = import.meta.env.BASE_URL;
const LOGO = `${base}logos/Black-Logo-No-BG.png`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
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
    <header
      className={
        "fixed top-0 inset-x-0 z-50 transition-all " +
        (scrolled ? "bg-white/70 backdrop-blur-md shadow-sm" : "bg-transparent")
      }
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <img src={LOGO} alt="Project 18" className="h-8 w-auto" />
          <span className="sr-only">Project 18</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <nav className="flex items-center gap-1">
            <NavLink to="/home" className={linkClass}>Home</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/ambassador" className={linkClass}>Ambassador</NavLink>
            <NavLink to="/chapters" className={linkClass}>Chapters</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          
          </nav>
          <Link to="/ambassador" className="hidden md:inline-block btn btn-gradient ml-2">Apply</Link>
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
          className={
            "absolute inset-0 bg-white transform transition-transform duration-250 " +
            (open ? "translate-y-0" : "-translate-y-full")
          }
          role="dialog"
          aria-modal="true"
        >
          <div className="px-5 py-4 flex items-center justify-between border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <img src={LOGO} alt="" className="h-7 w-auto" />
              <span className="sr-only">Project 18</span>
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
            {[
              { to: "/home", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/ambassador", label: "Ambassador" },
              { to: "/chapters", label: "Chapters" },
              { to: "/contact", label: "Contact" },
            ].map((item, i) => (
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
            <Link to="/ambassador" onClick={() => setOpen(false)} className="btn btn-gradient inline-block mt-3">Apply</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
