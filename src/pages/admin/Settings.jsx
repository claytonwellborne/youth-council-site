import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAdmin } from "../../components/admin/AdminContext";

export default function Settings(){
  const { session } = useAdmin();
  const uid = session?.user?.id;
  const [me, setMe] = useState({ email:'', full_name:'', location:'', bio:'', phone:'', links:'', avatar_url:'' });
  const [saving, setSaving] = useState(false);

  useEffect(()=>{ (async ()=>{
    if(!uid) return;
    const { data } = await supabase.from('profiles')
      .select('email,full_name,location,bio,phone,links,avatar_url')
      .eq('id', uid).maybeSingle();
    if (data) setMe({ ...data, links: JSON.stringify(data.links||{}) });
  })(); },[uid]);

  const upload = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop(); const path = `${uid}.${ext}`;
    await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    setMe(s => ({ ...s, avatar_url: data.publicUrl }));
  };

  const save = async (e)=>{
    e.preventDefault(); setSaving(true);
    let links=null; try{ links = me.links ? JSON.parse(me.links) : null; }catch{}
    await supabase.from('profiles').update({
      full_name: me.full_name, location: me.location, bio: me.bio, phone: me.phone,
      links, avatar_url: me.avatar_url
    }).eq('id', uid);
    setSaving(false);
  };

  const resetPw = async ()=>{
    const email = me.email || (await supabase.from('profiles').select('email').eq('id', uid).maybeSingle()).data?.email;
    if (!email) return alert('No email on file.');
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/#/admin/login` });
    alert('Password reset email sent.');
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <form onSubmit={save} className="space-y-4">
        <div className="flex items-center gap-4">
          <img src={me.avatar_url || 'https://placehold.co/96x96'} alt="" className="w-20 h-20 rounded-full object-cover"/>
          <label className="text-sm">
            <input type="file" accept="image/*" onChange={e=>upload(e.target.files?.[0])} className="hidden"/>
            <span className="btn border px-3 py-2 rounded-lg cursor-pointer">Upload avatar</span>
          </label>
        </div>
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Full name" value={me.full_name||''} onChange={e=>setMe(s=>({...s, full_name:e.target.value}))}/>
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Location (City, ST)" value={me.location||''} onChange={e=>setMe(s=>({...s, location:e.target.value}))}/>
        <textarea className="w-full border rounded-lg px-3 py-2 h-28" placeholder="Bio" value={me.bio||''} onChange={e=>setMe(s=>({...s, bio:e.target.value}))}/>
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Phone" value={me.phone||''} onChange={e=>setMe(s=>({...s, phone:e.target.value}))}/>
        <textarea className="w-full border rounded-lg px-3 py-2 h-24" placeholder='Links as JSON, e.g. {"instagram":"...","site":"..."}' value={me.links||''} onChange={e=>setMe(s=>({...s, links:e.target.value}))}/>
        <div className="flex items-center gap-3">
          <button className="btn btn-gradient">{saving?'Saving…':'Save changes'}</button>
          <button type="button" className="border rounded-lg px-3 py-2" onClick={resetPw}>Reset my password</button>
        </div>
      </form>
    </div>
  );
}
