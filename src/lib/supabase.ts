import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://icsthwfclnlfuszertrz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljc3Rod2ZjbG5sZnVzemVydHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MzU0MjAsImV4cCI6MjEwNTExMTQyMH0.q_8SV6ASwoBR7iWVGAybiO4zmriEbLWUDihTa7sm0Io';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);