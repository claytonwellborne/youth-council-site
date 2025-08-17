import React, { useState } from 'react'

const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || 'https://script.google.com/macros/s/AKfycbzV0tUa7MSX5UrvSnqGu8qTkIAKP1AYKVD_TtDMObdvCXnCa_yb2KlDWciE7e_qx1aF/exec'
const NOTIFY_EMAIL  = import.meta.env.VITE_NOTIFY_EMAIL  || 'wellborneclayton@gmail.com'

export default function AmbassadorForm(){
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [data, setData] = useState({
    name: '', email: '', school: '', city: '', state: '',
    committee: 'Outreach & Chapters', why: '', experience: '', agree: false
  })

  const onChange = e => {
    const { name, value, type, checked } = e.target
    setData(d => ({ ...d, [name]: type==='checkbox' ? checked : value }))
  }

  const onSubmit = async e => {
    e.preventDefault()
    setStatus('loading'); setError('')
    if (!FORM_ENDPOINT) { setStatus('error'); setError('Form endpoint missing.'); return }
    if (!data.agree)    { setStatus('error'); setError('Please agree to be contacted.'); return }

    const fd = new FormData()
    Object.entries(data).forEach(([k,v]) => fd.append(k, String(v)))
    fd.append('form','ambassador'); fd.append('notify', NOTIFY_EMAIL)

    try {
      await fetch(FORM_ENDPOINT, { method:'POST', mode:'no-cors', body: fd })
      setStatus('success')
    } catch (err) {
      setStatus('error'); setError(err.message || 'Network error.')
    }
  }

  if (status==='success') {
    return (
      <div className="card p-6 text-left">
        <h3 className="text-xl font-bold mb-1">Thanks! 🎉</h3>
        <p className="text-zinc-700">We got your application. We’ll email you with next steps.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 grid gap-4 text-left">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input required name="name" value={data.name} onChange={onChange}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" placeholder="Jordan Reyes" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input required type="email" name="email" value={data.email} onChange={onChange}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" placeholder="you@school.edu" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">School / Org</label>
          <input name="school" value={data.school} onChange={onChange}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" placeholder="Central High" />
        </div>
        <div>
          <label className="block text-sm font-medium">City</label>
          <input name="city" value={data.city} onChange={onChange}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" placeholder="Austin" />
        </div>
        <div>
          <label className="block text-sm font-medium">State</label>
          <input name="state" value={data.state} onChange={onChange}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" placeholder="TX" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Preferred committee</label>
        <select name="committee" value={data.committee} onChange={onChange}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2">
          {[
            'Outreach & Chapters','Communications','Policy & Research',
            'Events','Media & Design','Tech & Ops'
          ].map(x => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Why do you want to be an ambassador?</label>
        <textarea name="why" value={data.why} onChange={onChange}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" rows="4"
          placeholder="A few sentences about your motivation..." />
      </div>

      <div>
        <label className="block text-sm font-medium">Relevant experience (optional)</label>
        <textarea name="experience" value={data.experience} onChange={onChange}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2" rows="3"
          placeholder="Clubs, events, projects, roles..." />
      </div>

      <label className="inline-flex items-center gap-2">
        <input type="checkbox" name="agree" checked={data.agree} onChange={onChange} required />
        <span className="text-sm text-zinc-700">I agree to be contacted about this application.</span>
      </label>

      <div className="flex items-center gap-3">
        <button disabled={status==='loading'} className="btn btn-gradient">
          {status==='loading' ? 'Submitting…' : 'Submit application'}
        </button>
        {status==='error' && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  )
}
