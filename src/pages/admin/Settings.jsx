import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAdmin } from "../../components/admin/AdminContext";

export default function Settings(){
  const { session } = useAdmin();
  const uid = session?.user?.id;
  const [p, setP] = useState({ full_name:'', location:'', bio:'', phone:'', links:'', avatar_url:'' });
  const [saving, setSaving] = useState(false);

  useEffect(()=>{ (async ()=>{
    if(!uid) return;
    const { data } = await supabase.from('profiles').select('full_name,location,bio,phone,links,avatar_url').eq('id', uid).maybeSingle();
    if (data) setP({ ...data, links: JSON.stringify(data.links||{}) });
  })(); },[uid]);

  const upload = async (file) => {
    const ext = file.name.split('.').pop(); const path = `${uid}.${ext}`;
    await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    setP(s => ({ ...s, avatar_url: data.publicUrl }));
  };

  const save = async (e)=>{
    e.preventDefault(); setSaving(true);
    let links=null; try{ links = p.links ? JSON.parse(p.links) : null; }catch{}
    await supabase.from('profiles').update({
      full_name: p.full_name, location: p.location, bio: p.bio, phone: p.phone,
      links, avatar_url: p.avatar_url
    }).eq('id', uid);
    setSaving(false);
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <form onSubmit={save} className="space-y-4">
        <div className="flex items-center gap-4">
          <img src={p.avatar_url || 'https://placehold.co/96x96'} alt="" className="w-20 h-20 rounded-full object-cover"/>
          <label className="text-sm">
            <input type="file" accept="image/*" onChange={e=>upload(e.target.files[0])} className="hidden"/>
            <span className="btn border px-3 py-2 rounded-lg cursor-pointer">Upload avatar</span>
          </label>
        </div>
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Full name" value={p.full_name||''} onChange={e=>setP(s=>({...s, full_name:e.target.value}))}/>
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Location (City, ST)" value={p.location||''} onChange={e=>setP(s=>({...s, location:e.target.value}))}/>
        <textarea className="w-full border rounded-lg px-3 py-2 h-28" placeholder="Bio" value={p.bio||''} onChange={e=>setP(s=>({...s, bio:e.target.value}))}/>
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Phone" value={p.phone||''} onChange={e=>setP(s=>({...s, phone:e.target.value}))}/>
        <textarea className="w-full border rounded-lg px-3 py-2 h-24" placeholder='Links as JSON, e.g. {"instagram":"...","site":"..."}' value={p.links||''} onChange={e=>setP(s=>({...s, links:e.target.value}))}/>
        <button className="btn btn-gradient">{saving?'Saving…':'Save changes'}</button>
      </form>
    </div>
  );
}
