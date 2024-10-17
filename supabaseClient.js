import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaahxtelpfefskctxiwr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhYWh4dGVscGZlZnNrY3R4aXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NjY2MzQsImV4cCI6MjA0NDE0MjYzNH0.JzUe2xEUujt2QcxC752J8erHQFcYj_chu0J9CLd0AyM';
export const supabase = createClient(supabaseUrl, supabaseKey);
