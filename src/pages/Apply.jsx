import { useState } from 'react'

export default function Apply(){
  const [sent, setSent] = useState(false)
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-4xl font-bold mb-3">Apply</h1>
        <p className="text-gray-600 mb-6">Demo form; we’ll wire a real backend later.</p>
        <form onSubmit={(e)=>{e.preventDefault(); setSent(true)}} className="grid gap-4">
          <input className="rounded-xl border px-3 py-2" placeholder="Full name" required />
          <input type="email" className="rounded-xl border px-3 py-2" placeholder="Email" required />
          <input className="rounded-xl border px-3 py-2" placeholder="School" />
          <select className="rounded-xl border px-3 py-2">
            <option>Join a local chapter</option>
            <option>Start a new chapter</option>
            <option>Become a mentor</option>
          </select>
          <textarea className="rounded-xl border px-3 py-2 min-h-32" placeholder="Why do you want to join?" />
          <button className="rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">Submit</button>
          {sent && <p className="text-sm text-green-700">Thanks! We’ll be in touch. (Demo only.)</p>}
        </form>
      </div>
    </section>
  )
}