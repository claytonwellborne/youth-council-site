import { supabase } from '../lib/supabase';
export const Announcement = {
  async list(){ const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending:false }).limit(100); if (error) throw error; return data||[]; },
  async create({ title, body }){ const { error } = await supabase.from('announcements').insert({ title, body }); if (error) throw error; }
};
