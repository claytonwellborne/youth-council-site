import { useEffect, useState } from "react";
import { Users, Mail, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Member } from "../../entities/Member";

export default function Directory(){
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async ()=>{ setLoading(true); setMembers(await Member.list('-created_date')); setLoading(false); };
  useEffect(()=>{ load() },[]);

  const update = async (id, status)=>{ await Member.update(id, {status}); load(); };
  const statusCls = s => s==='active'?'bg-green-100 text-green-800': s==='pending'?'bg-yellow-100 text-yellow-800':'bg-gray-100 text-gray-800';

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Member Management</h2>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5"/>Members ({members.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.length? members.map((m)=>(
              <div key={m.id} className="border rounded-lg p-4">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{m.full_name}</h3>
                      <Badge className={statusCls(m.status)}>{m.status}</Badge>
                      {m.age && <Badge variant="outline">Age: {m.age}</Badge>}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1"><Mail className="w-4 h-4"/>{m.email}</div>
                      {m.phone && <div className="flex items-center gap-1"><Phone className="w-4 h-4"/>{m.phone}</div>}
                      <div className="flex items-center gap-1"><Calendar className="w-4 h-4"/>Joined: {new Date(m.created_date).toLocaleDateString()}</div>
                    </div>
                    {m.join_reason && <p className="text-sm text-gray-700 italic">"{m.join_reason.slice(0,150)}{m.join_reason.length>150?'…':''}"</p>}
                  </div>
                  <div className="flex gap-2">
                    {m.status==='pending' && <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>update(m.id,'active')}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={()=>update(m.id,'inactive')}>Decline</Button>
                    </>}
                    {m.status==='active' && <Button size="sm" variant="outline" onClick={()=>update(m.id,'inactive')}>Deactivate</Button>}
                    {m.status==='inactive' && <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={()=>update(m.id,'active')}>Reactivate</Button>}
                  </div>
                </div>
              </div>
            )): (
              <div className="text-center py-12 text-gray-600">No members yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
