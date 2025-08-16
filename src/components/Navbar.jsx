import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logoLight from "../assets/logo-black.png";   // for light mode
import logoDark from "../assets/logo-white.png";    // for dark mode

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    "px-3 py-2 rounded-md text-sm font-medium transition-colors " +
    (isActive ? "text-red-600" : "text-gray-700 hover:text-red-600 dark:text-gray-200");

  return (
    <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <img src={logoLight} alt="Project 18" className="h-8 w-auto block dark:hidden" />
          <img src={logoDark} alt="Project 18" className="h-8 w-auto hidden dark:block" />
          <span className="sr-only">Project 18</span>
        </Link>
        {/* … rest of your nav code unchanged … */}
      </div>
    </header>
  );
}
