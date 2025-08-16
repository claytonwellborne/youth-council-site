import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    "px-3 py-2 rounded-md text-sm font-medium transition-colors " +
    (isActive ? "text-red-600" : "text-gray-700 hover:text-red-600");

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <img src={logo} alt="Project 18" className="h-8 w-auto" />
          <span className="sr-only">Project 18</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1">
          <NavLink to="/home" className={linkClass}>Home</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/programs" className={linkClass}>Programs</NavLink>
          <NavLink to="/chapters" className={linkClass}>Chapters</NavLink>
          <NavLink to="/apply" className={linkClass}>Apply</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-200"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={
              "block w-5 h-0.5 bg-gray-900 transition-transform " +
              (open ? "translate-y-1.5 rotate-45" : "-translate-y-1")
            }
          />
          <span
            className={
              "block w-5 h-0.5 bg-gray-900 my-1 transition-opacity " +
              (open ? "opacity-0" : "opacity-100")
            }
          />
          <span
            className={
              "block w-5 h-0.5 bg-gray-900 transition-transform " +
              (open ? "-translate-y-1.5 -rotate-45" : "translate-y-1")
            }
          />
        </button>
      </div>

      {/* Mobile dropdown (animated) */}
      <div
        className={
          "md:hidden origin-top transform-gpu transition-all duration-200 " +
          (open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none")
        }
      >
        <nav className="px-4 pb-4 pt-1 space-y-1 border-t border-gray-100 bg-white">
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
