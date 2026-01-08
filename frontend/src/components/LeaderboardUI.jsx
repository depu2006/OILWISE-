// src/components/LeaderboardUI.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function LeaderboardUI() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    const { data, error } = await supabase
      .from("quiz_leaderboard")
      .select("*")
      .order("position", { ascending: true });

    if (!error) setLeaders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Loading quiz leaderboard…</p>;

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 12 }}>Quiz Leaderboard 🏆</h3>
      <div
        style={{
          background: "#111",
          padding: 16,
          borderRadius: 12,
          color: "white",
        }}
      >
        {leaders.length === 0 && <p>No quiz data yet.</p>}

        {leaders.map((user) => (
          <div
            key={user.user_id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #333",
            }}
          >
            <div>
              <strong>
                {user.position === 1
                  ? "🥇 "
                  : user.position === 2
                  ? "🥈 "
                  : user.position === 3
                  ? "🥉 "
                  : `#${user.position} `}
              </strong>
              {user.full_name}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#7cf5ff", fontWeight: "bold" }}>
                {user.total_score} pts
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {user.total_points} bonus
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}