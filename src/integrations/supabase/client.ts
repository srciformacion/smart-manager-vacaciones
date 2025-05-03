
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xanmwzeewtcfgcutusia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhbm13emVld3RjZmdjdXR1c2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTczMDIsImV4cCI6MjA2MDgzMzMwMn0.h4Kto8E50HGCrxapNIIC_xuJJPRBQwDYNXDs2CKzuVo';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
