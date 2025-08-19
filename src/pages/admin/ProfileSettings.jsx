import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ProfileSettings(){
  const [session, setSession] = useState(null)
  const [form, setForm] = useState({ full_name:'', title:'', avatar_url:'' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(session)
      if (session?.user?.id) {
        const { data } = await supabase.from('profile_public').select('full_name,title,avatar_url').eq('id', session.user.id).single()
        if (data) setForm({ full_name: data.full_name || '', title: data.title || '', avatar_url: data.avatar_url || '' })
      }
    })()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => { mounted = false; sub.subscription?.unsubscribe() }
  }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!session?.user?.id) return
    setSaving(true); setMsg('')
    // upsert into base table with id = auth.uid()
    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      full_name: form.full_name || null,
      title: form.title || null,
      avatar_url: form.avatar_url || null
    }, { onConflict: 'id' })
    setSaving(false)
    setMsg(error ? ('Save failed: ' + error.message) : 'Saved!')
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input value={form.full_name} onChange={e=>setForm(v=>({...v, full_name:e.target.value}))}
                 className="w-full border rounded-lg px-3 py-2" placeholder="Your name"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input value={form.title} onChange={e=>setForm(v=>({...v, title:e.target.value}))}
                 className="w-full border rounded-lg px-3 py-2" placeholder="Executive Director"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Avatar URL</label>
          <input value={form.avatar_url} onChange={e=>setForm(v=>({...v, avatar_url:e.target.value}))}
                 className="w-full border rounded-lg px-3 py-2" placeholder="https://...jpg"/>
        </div>
        <button type="submit" disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brandRed to-brandBlue text-white font-semibold hover:opacity-95 disabled:opacity-60">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {msg && <div className="text-sm mt-2">{msg}</div>}
      </form>
    </div>
  )
}
