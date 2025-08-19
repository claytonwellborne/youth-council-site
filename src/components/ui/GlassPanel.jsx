import React from "react";
export default function GlassPanel({ className="", children }) {
  return (
    <div className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${className}`}>
      {children}
    </div>
  );
}
