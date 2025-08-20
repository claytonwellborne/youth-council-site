import React from "react";

export default function Press(){
  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-[#ff4d4d] via-[#a15cff] to-[#2a6dfd] py-16">
      <div className="max-w-5xl mx-auto px-4 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow">Press (In Development)</h1>
        <p className="mt-3 text-white/90">We’re moving press updates to Substack. New posts will sync here automatically.</p>
        <div className="mt-8 bg-white rounded-xl p-4 shadow-xl">
          {/* Substack embed (replace with your publication if needed) */}
          <iframe
            src="https://substack.com/embed"
            title="Substack"
            width="100%"
            height="380"
            style={{border:"0"}}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
