import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const base = import.meta.env.BASE_URL; // "/youth-council-site/"
const LOGO_LIGHT = `${base}logos/Black-Logo-No-BG.png`;
const LOGO_DARK  = `${base}logos/White-Logo-No-BG.png`;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const linkClass = ({ isActive }) =>
    "px-3 py-2 rounded-md text-sm font-medium transition-colors " +
    (isActive ? "text-red-600" : "text-gray-900 hover:text-red-600");

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <img src={LOGO_LIGHT} alt="Project 18" className="h-8 w-auto block dark:hidden" />
          <img src={LOGO_DARK}  alt="Project 18" className="h-8 w-auto hidden dark:block" />
          <span className="sr-only">Project 18</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/home" className={linkClass}>Home</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/programs" className={linkClass}>Programs</NavLink>
          <NavLink to="/chapters" className={linkClass}>Chapters</NavLink>
          <NavLink to="/apply" className={linkClass}>Apply</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden relative inline-flex items-center justify-center w-10 h-10"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={"absolute left-1/2 w-6 h-0.5 -translate-x-1/2 bg-gray-900 transition-transform duration-200 " + (open ? "translate-y-0 rotate-45" : "-translate-y-[6px] rotate-0")}/>
          <span className={"absolute left-1/2 w-6 h-0.5 -translate-x-1/2 bg-gray-900 transition-opacity duration-200 " + (open ? "opacity-0" : "opacity-100")}/>
          <span className={"absolute left-1/2 w-6 h-0.5 -translate-x-1/2 bg-gray-900 transition-transform duration-200 " + (open ? "translate-y-0 -rotate-45" : "translate-y-[6px] rotate-0")}/>
        </button>
      </div>

      {/* Full-screen mobile menu */}
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
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2">
              <img src={LOGO_LIGHT} alt="" className="h-7 w-auto" />
              <span className="sr-only">Project 18</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-200"
              aria-label="Close menu"
            >
              <span className="block w-5 h-0.5 bg-gray-900 rotate-45 -translate-y-0.5" />
              <span className="block w-5 h-0.5 bg-gray-900 -rotate-45 translate-y-0.5 -mt-0.5" />
            </button>
          </div>

          <nav className="px-6 pt-6 space-y-2">
            {[
              { to: "/home", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/programs", label: "Programs" },
              { to: "/chapters", label: "Chapters" },
              { to: "/apply", label: "Apply" },
              { to: "/contact", label: "Contact" },
            ].map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  "block text-2xl font-semibold " +
                  (isActive ? "text-red-600" : "text-gray-900 hover:text-red-600")
                }
                style={{ transition: "transform .25s ease, opacity .25s ease", transform: open ? "none" : "translateY(6px)", opacity: open ? 1 : 0, transitionDelay: open ? `${i * 50}ms` : "0ms" }}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
