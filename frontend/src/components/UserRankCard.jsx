// src/components/UserRankCard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function UserRankCard() {
  const [rankData, setRankData] = useState(null);

  const loadRank = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return;

    const userId = auth.user.id;

    const { data, error } = await supabase
      .from("quiz_leaderboard")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!error) {
      setRankData(data);
    }
  };

  useEffect(() => {
    loadRank();
  }, []);

  if (!rankData)
    return (
      <div
        style={{
          background: "#111",
          padding: 16,
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        <p style={{ margin: 0 }}>Loading your quiz rank…</p>
      </div>
    );

  return (
    <div
      style={{
        background: "#111",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 8 }}>Your Quiz Rank</h2>
      <p style={{ margin: "4px 0" }}>
        <strong>Position:</strong>{" "}
        <span style={{ color: "#7cf5ff" }}>#{rankData.position}</span>
      </p>
      <p style={{ margin: "4px 0" }}>
        <strong>Total Quiz Score:</strong> {rankData.total_score}
      </p>
      <p style={{ margin: "4px 0" }}>
        <strong>Total Quiz Points:</strong> {rankData.total_points}
      </p>
    </div>
  );
}