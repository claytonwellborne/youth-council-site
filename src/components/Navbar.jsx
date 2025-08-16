import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <img src={logo} alt="Project 18" className="h-8 w-auto" />
          <span className="sr-only">Project 18</span>
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link to="/home" className="hover:text-red-600">Home</Link>
          <Link to="/about" className="hover:text-red-600">About</Link>
          <Link to="/programs" className="hover:text-red-600">Programs</Link>
          <Link to="/chapters" className="hover:text-red-600">Chapters</Link>
          <Link to="/apply" className="hover:text-red-600">Apply</Link>
          <Link to="/contact" className="hover:text-red-600">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
