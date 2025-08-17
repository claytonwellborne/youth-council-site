import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export default function Applications(){
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async ()=>{
    setLoading(true);
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending:false });
    if (error) alert(error.message); else setRows(data||[]);
    setLoading(false);
  };
  useEffect(()=>{ load() },[]);

  const setStatus = async (id, status)=>{ const { error } = await supabase.from('applications').update({ status }).eq('id', id); if (error) alert(error.message); else load();};

  const chip = (s)=> s==='accepted'?'bg-green-100 text-green-800': s==='rejected'?'bg-red-100 text-red-800': s==='reviewing'?'bg-yellow-100 text-yellow-800':'bg-gray-100 text-gray-800';

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ambassador Applications</h2>
      <Card>
        <CardHeader><CardTitle>Incoming applications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {loading? <div>Loading…</div> : rows.length? rows.map(r=>(
            <div key={r.id} className="border rounded-lg p-4">
              <div className="flex justify-between gap-3">
                <div>
                  <div className="font-semibold">{r.full_name}</div>
                  <div className="text-sm text-gray-600">{r.email}</div>
                  {r.chapter && <div className="text-sm text-gray-600">Chapter: {r.chapter}</div>}
                  {r.notes && <div className="text-sm text-gray-700 mt-1">{r.notes}</div>}
                </div>
                <div className="text-right space-y-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${chip(r.status||'reviewing')}`}>{r.status||'reviewing'}</span>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>setStatus(r.id,'accepted')}>Accept</Button>
                    <Button size="sm" variant="outline" onClick={()=>setStatus(r.id,'rejected')}>Reject</Button>
                  </div>
                </div>
              </div>
            </div>
          )): <div className="text-gray-600">No applications yet.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
