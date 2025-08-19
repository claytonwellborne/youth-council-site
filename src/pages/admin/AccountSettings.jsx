import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AccountSettings(){
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setEmail(session?.user?.email || '')
    })()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription?.unsubscribe()
  }, [])

  const saveEmail = async (e) => {
    e.preventDefault(); setMsg('')
    const { error } = await supabase.auth.updateUser({ email })
    setMsg(error ? ('Email update failed: ' + error.message) : 'Email update sent. Check your inbox to confirm.')
  }

  const savePassword = async (e) => {
    e.preventDefault(); setMsg('')
    const { error } = await supabase.auth.updateUser({ password })
    setMsg(error ? ('Password update failed: ' + error.message) : 'Password updated.')
    setPassword('')
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Account</h2>
        <form onSubmit={saveEmail} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                   className="w-full border rounded-lg px-3 py-2" />
          </div>
          <button type="submit" className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-brandRed to-brandBlue text-white font-semibold hover:opacity-95">
            Update email
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Change password</h3>
        <form onSubmit={savePassword} className="space-y-3">
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                 className="w-full border rounded-lg px-3 py-2" placeholder="New password" />
          <button type="submit" className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-brandRed to-brandBlue text-white font-semibold hover:opacity-95">
            Update password
          </button>
        </form>
      </div>

      {msg && <div className="text-sm mt-2">{msg}</div>}
    </div>
  )
}
