import { useEffect, useState } from "react";
import { Users, UserCheck, Clock } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Member } from "../../entities/Member";
import { Link } from "react-router-dom";

export default function Overview(){
  const [stats, setStats] = useState({ total:0, active:0, pending:0 });
  useEffect(()=>{ (async ()=>{
    const m = await Member.list('-created_date');
    setStats({
      total: m.length,
      active: m.filter(x=>x.status==='active').length,
      pending: m.filter(x=>x.status==='pending').length
    });
  })(); },[]);

  const tiles = [
    { label:'Total Members', value:stats.total, ring:'bg-blue-100', Icon:Users, color:'text-blue-600' },
    { label:'Active Members', value:stats.active, ring:'bg-green-100', Icon:UserCheck, color:'text-green-600' },
    { label:'Pending Applications', value:stats.pending, ring:'bg-yellow-100', Icon:Clock, color:'text-yellow-600' },
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
                <div className={`w-12 h-12 ${t.ring} rounded-lg grid place-items-center`}>
                  <t.Icon className={`w-6 h-6 ${t.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Link to="/admin/directory"><Button>Open Member Management</Button></Link>
      </div>
    </div>
  );
}
