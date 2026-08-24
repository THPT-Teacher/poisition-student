import { createClient } from '@supabase/supabase-js';
import type { Classroom } from '../types/classroom';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xiieyrbqsjnpdphyjioi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaWV5cmJxc2pucGRwaHlqaW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MjA4OTgsImV4cCI6MjEwMTQ5Njg5OH0.Js8U1dCRzdoDS63tEBSY42y43x35Vx_afPIYsis7i8U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LOCAL_STORAGE_KEY = 'random_seat_classroom_current';

export async function saveClassroomData(classroom: Classroom): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(classroom));
  } catch (err) {
    console.warn('Không thể lưu localStorage:', err);
  }

  try {
    const { error } = await supabase
      .from('classes')
      .upsert({
        id: classroom.id,
        name: classroom.name,
        num_groups: classroom.numGroups,
        desks_per_group: classroom.desksPerGroup,
        door_position: classroom.doorPosition,
        data: classroom,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.info('Supabase sync info:', error.message);
    }
  } catch (err) {
    console.info('Supabase background sync silent catch:', err);
  }
}

export async function loadSavedClassroom(): Promise<Classroom | null> {
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      return JSON.parse(local) as Classroom;
    }
  } catch (err) {
    console.warn('Lỗi đọc localStorage:', err);
  }
  return null;
}

export function clearSavedClassroom(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {}
}
