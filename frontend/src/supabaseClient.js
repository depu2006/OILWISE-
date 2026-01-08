// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://calntixukubxggaestdc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbG50aXh1a3VieGdnYWVzdGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMjY4MjIsImV4cCI6MjA4MDgwMjgyMn0.xQa8jEERgtA0oSjpgjw-eeWHnftEUCGE1Jw9wx10QyU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
