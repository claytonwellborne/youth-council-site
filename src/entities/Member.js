import { supabase } from '../lib/supabase';

function mapStatus(appStatus){
  if (appStatus === 'accepted') return 'active';
  if (appStatus === 'rejected') return 'inactive';
  return 'pending';
}
function parseInterests(val){
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { const j = JSON.parse(val); if (Array.isArray(j)) return j; } catch {}
  return String(val).split(',').map(s=>s.trim().toLowerCase().replace(/\s+/g,'_')).filter(Boolean);
}

export const Member = {
  async list(order='-created_date'){
    const { data, error } = await supabase.from('applications').select('*').limit(1000);
    if (error) throw error;
    const rows = (data||[]).map(r=>({
      id: r.id,
      full_name: r.full_name || r.name || 'Unnamed',
      email: r.email || '',
      phone: r.phone || '',
      age: r.age || '',
      status: mapStatus(r.status),
      created_date: r.created_at,
      program_interests: parseInterests(r.interests || r.interest || ''),
      join_reason: r.notes || r.statement || ''
    }));
    if (order === '-created_date'){
      rows.sort((a,b)=> new Date(b.created_date) - new Date(a.created_date));
    }
    return rows;
  },
  async update(id, payload){
    // map UI statuses back to applications.status
    const statusMap = { active: 'accepted', inactive: 'rejected', pending: 'reviewing' };
    const status = payload.status ? statusMap[payload.status] ?? payload.status : undefined;
    const update = status ? { status } : {};
    const { error } = await supabase.from('applications').update(update).eq('id', id);
    if (error) throw error;
  }
};
