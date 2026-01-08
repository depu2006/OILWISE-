import { supabase } from "../supabaseClient";

export async function getQuizLeaderboard() {
  const { data, error } = await supabase
    .from("quiz_leaderboard")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("Leaderboard fetch error:", error);
    return [];
  }

  return data;
}