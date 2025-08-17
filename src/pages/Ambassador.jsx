import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AmbassadorForm from '../components/forms/AmbassadorForm';

export default function Ambassador() {
  const loc = useLocation();

  useEffect(() => {
    const shouldScroll = loc.search.includes('scroll=apply') || loc.hash === '#apply';
    if (shouldScroll) {
      // wait for form to render
      setTimeout(() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  }, [loc.search, loc.hash]);

  return (
    <div className="px-4 py-10">
      <section className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-3">Ambassador Program</h1>
        <p className="text-gray-600">
          Be part of Project 18’s leadership network—organize chapters, help with research & policy, and support mentorship.
        </p>
      </section>

      <AmbassadorForm id="apply-form" />
    </div>
  );
}
