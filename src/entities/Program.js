import { supabase } from '../lib/supabase';

export const Program = {
  async list(order='-created_date'){
    const { data, error } = await supabase.from('press').select('*').order('created_at', { ascending: false }).limit(1000);
    if (error && error.code !== '42P01') { // table missing -> ignore
      throw error;
    }
    return (data||[]).map(p => ({
      id: p.id,
      title: p.title || 'Untitled Program',
      category: p.category || 'general',
      is_active: p.is_active ?? true,
      description: p.description || '',
      duration: p.duration || '',
      meeting_schedule: p.meeting_schedule || '',
      max_participants: p.max_participants || null,
      current_participants: p.current_participants || 0,
      created_date: p.created_at
    }));
  }
};
