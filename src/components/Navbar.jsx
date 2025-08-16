import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/chapters', label: 'Chapters' },
  { to: '/apply', label: 'Apply' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 nav-surface">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Auto light/dark logo for the tab/header */}
          <a href="/" className="flex items-center gap-2">
            <picture>
              <source srcSet="/logos/White-Logo-No-BG.png" media="(prefers-color-scheme: dark)" />
              <img
                src="/logos/Black-Logo-No-BG.png"
                alt="Project 18"
                className="h-8 w-auto"
                loading="eager"
                decoding="async"
              />
            </picture>
          </a>

          {/* Desktop nav with gradient on active link */}
          <nav className="hidden lg:flex items-center gap-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors duration-200 text-sm font-medium hover:opacity-90 ${
                    isActive ? 'text-gradient-america' : 'text-[var(--fg)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--nav-border)]/60 bg-[var(--nav-bg)]"
          >
            <span className="relative block h-[14px] w-5">
              <span className={`absolute left-0 top-0 h-[2px] w-5 bg-[var(--fg)] transition-transform ${open ? 'translate-y-[6px] rotate-45' : ''}`}></span>
              <span className={`absolute left-0 top-[6px] h-[2px] w-5 bg-[var(--fg)] transition-opacity ${open ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`absolute left-0 top-[12px] h-[2px] w-5 bg-[var(--fg)] transition-transform ${open ? '-translate-y-[6px] -rotate-45' : ''}`}></span>
            </span>
          </button>
        </div>
      </div>

      {/* Fullscreen mobile panel for visibility */}
      {open && (
        <div className="fixed inset-0 z-40 bg-[var(--bg)]/98 lg:hidden" onClick={() => setOpen(false)}>
          <div className="mx-auto max-w-7xl px-6 pt-24">
            <nav className="flex flex-col gap-4 text-xl">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `py-3 transition-colors ${isActive ? 'font-semibold' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
