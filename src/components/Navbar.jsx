import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logoLight from "../assets/logo-black.png";   // light mode
import logoDark from "../assets/logo-white.png";    // dark mode

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const linkClass = ({ isActive }) =>
    "block px-3 py-2 rounded-md text-base md:text-sm font-medium transition-colors " +
    (isActive
      ? "text-red-600"
      : "text-gray-800 hover:text-red-600 dark:text-gray-200");

  return (
    <header className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <img src={logoLight} alt="Project 18" className="h-8 w-auto block dark:hidden" />
          <img src={logoDark} alt="Project 18" className="h-8 w-auto hidden dark:block" />
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
          className="md:hidden relative inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 dark:border-gray-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {/* three bars perfectly stacked */}
          <span
            className={
              "absolute left-1/2 w-6 h-0.5 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 transition-transform duration-200 ease-out " +
              (open ? "translate-y-0 rotate-45" : "-translate-y-[6px] rotate-0")
            }
          />
          <span
            className={
              "absolute left-1/2 w-6 h-0.5 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 transition-opacity duration-200 " +
              (open ? "opacity-0" : "opacity-100")
            }
          />
          <span
            className={
              "absolute left-1/2 w-6 h-0.5 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 transition-transform duration-200 ease-out " +
              (open ? "translate-y-0 -rotate-45" : "translate-y-[6px] rotate-0")
            }
          />
        </button>
      </div>

      {/* Mobile overlay + drawer */}
      {/* Overlay */}
      <div
        className={
          "md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity " +
          (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
        onClick={() => setOpen(false)}
      />
      {/* Drawer */}
      <div
        className={
          "md:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl " +
          "transform transition-transform duration-200 " +
          (open ? "translate-x-0" : "translate-x-full")
        }
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <img src={logoLight} alt="" className="h-7 w-auto block dark:hidden" />
            <img src={logoDark} alt="" className="h-7 w-auto hidden dark:block" />
            <span className="sr-only">Project 18</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-200 dark:border-gray-700"
            aria-label="Close menu"
          >
            <span className="block w-5 h-0.5 bg-gray-900 dark:bg-gray-100 rotate-45 -translate-y-0.5" />
            <span className="block w-5 h-0.5 bg-gray-900 dark:bg-gray-100 -rotate-45 translate-y-0.5 -mt-0.5" />
          </button>
        </div>
        <nav className="px-4 py-3 space-y-1">
          <NavLink to="/home" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/programs" className={linkClass} onClick={() => setOpen(false)}>Programs</NavLink>
          <NavLink to="/chapters" className={linkClass} onClick={() => setOpen(false)}>Chapters</NavLink>
          <NavLink to="/apply" className={linkClass} onClick={() => setOpen(false)}>Apply</NavLink>
          <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
