import { useEffect, useState } from "react";
import { Users, UserCheck, Clock } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Member } from "../../entities/Member";
import { Announcement } from "../../entities/Announcement";
import { useAdmin } from "../../components/admin/AdminContext";
import { Link } from "react-router-dom";

export default function Overview(){
  const [stats, setStats] = useState({ total:0, active:0, pending:0 });
  const [ann, setAnn] = useState([]);
  const { profile } = useAdmin();
  const role = (profile?.role || 'ambassador').toLowerCase();
  const isExec = ['executive_director','chief_of_staff','vp_membership','vp_finance','vp_pr'].includes(role) || (profile?.is_admin ?? false);

  useEffect(()=>{ (async ()=>{
    const m = await Member.list('-created_date');
    setStats({ total:m.length, active:m.filter(x=>x.status==='active').length, pending:m.filter(x=>x.status==='pending').length });
    setAnn(await Announcement.list());
  })(); },[]);

  const publish = async (e)=>{
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = fd.get('title'); const body = fd.get('body');
    await Announcement.create({ title, body });
    e.currentTarget.reset();
    setAnn(await Announcement.list());
  };

  const tiles = [
    { label:'Total Members', value:stats.total, ring:'bg-blue-100', icon:'👥' },
    { label:'Active Members', value:stats.active, ring:'bg-green-100', icon:'✅' },
    { label:'Pending Applications', value:stats.pending, ring:'bg-yellow-100', icon:'⏳' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Quick overview</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiles.map(t=>(
          <Card key={t.label} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.label}</p>
                  <p className="text-3xl font-bold">{t.value}</p>
                </div>
                <div className={`w-12 h-12 ${t.ring} rounded-lg grid place-items-center text-xl`}>{t.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8"><Link to="/admin/directory"><Button>Open Member Management</Button></Link></div>

      {/* Announcements */}
      <div className="mt-10 grid md:grid-cols-2 gap-8">
        {isExec && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Post an announcement</h3>
              <form onSubmit={publish} className="space-y-3">
                <input name="title" required placeholder="Title" className="w-full border rounded-md px-3 py-2" />
                <textarea name="body" required placeholder="Write your announcement..." className="w-full border rounded-md px-3 py-2 h-28" />
                <Button type="submit">Publish</Button>
              </form>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Announcements</h3>
            <div className="space-y-4">
              {ann.length ? ann.map(a=>(
                <div key={a.id} className="border rounded-lg p-3 bg-white">
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-sm text-gray-600">{new Date(a.created_at).toLocaleString()}</div>
                  <p className="mt-2">{a.body}</p>
                </div>
              )) : <div className="text-gray-600">No announcements yet.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
