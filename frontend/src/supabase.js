import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://calntixukubxggaestdc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbG50aXh1a3VieGdnYWVzdGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMjY4MjIsImV4cCI6MjA4MDgwMjgyMn0.xQa8jEERgtA0oSjpgjw-eeWHnftEUCGE1Jw9wx10QyU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
