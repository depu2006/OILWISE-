// src/pages/RewardsPage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/rewards.css";

export default function RewardsPage() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // USER STATS
  const [totalPoints, setTotalPoints] = useState(0);
  const [quizzesTaken, setQuizzesTaken] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [rank, setRank] = useState("N/A");

  // LEADERBOARD
  const [leaderboard, setLeaderboard] = useState([]);

  // POPUP STATUS CODE
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [statusCode, setStatusCode] = useState("");

  useEffect(() => {
    loadEverything();
  }, []);

  // --------------------------------------------------
  // LOAD EVERYTHING
  // --------------------------------------------------
  async function loadEverything() {
    setLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const uid = authData?.user?.id;
      setUserId(uid);

      if (uid) {
        await loadUserStats(uid);
        await loadLeaderboard(uid);
      }
    } catch (err) {
      console.error("Rewards load error:", err);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // LOAD USER STATS
  // --------------------------------------------------
  async function loadUserStats(uid) {
    const { data } = await supabase
      .from("quiz_results")
      .select("score, total_questions, points_earned")
      .eq("user_id", uid);

    if (!data || data.length === 0) {
      setTotalPoints(0);
      setQuizzesTaken(0);
      setAccuracy(0);
      return;
    }

    setTotalPoints(data.reduce((sum, r) => sum + r.points_earned, 0));
    setQuizzesTaken(data.length);

    const avg =
      data.reduce((sum, r) => sum + (r.score / r.total_questions) * 100, 0) /
      data.length;

    setAccuracy(Math.round(avg));
  }

  // --------------------------------------------------
  // LOAD LEADERBOARD
  // --------------------------------------------------
  async function loadLeaderboard(uid) {
    const { data } = await supabase
      .from("quiz_leaderboard")
      .select("*")
      .order("total_points", { ascending: false });

    setLeaderboard(data || []);

    const userRank = data.findIndex((u) => u.user_id === uid);
    setRank(userRank === -1 ? "N/A" : userRank + 1);
  }

  // --------------------------------------------------
  // COPY FUNCTION
  // --------------------------------------------------
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }

  // --------------------------------------------------
  // STATUS CODE GENERATOR WITH POPUP
  // --------------------------------------------------
  async function handleQuizStatusCheck() {
    if (!userId) {
      alert("Please login first.");
      return;
    }

    // 1️⃣ Check if code already exists
    const { data: existing } = await supabase
      .from("quiz_status_profiles")
      .select("status_code")
      .eq("id", userId)
      .single();

    if (existing?.status_code) {
      setStatusCode(existing.status_code);
      setShowCodePopup(true);
      return;
    }

    // 2️⃣ Generate new code
    const code =
      "QS-" +
      Math.random().toString(36).substring(2, 6).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 6).toUpperCase();

    // 3️⃣ Load profile
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // 4️⃣ Insert into status table
    await supabase.from("quiz_status_profiles").insert([
      {
        id: prof.id,
        first_name: prof.first_name,
        last_name: prof.last_name,
        email: prof.email,
        phone: prof.phone,
        state: prof.state,
        address: prof.address,
        role: prof.role,
        created_at: prof.created_at,
        status_code: code,
      },
    ]);

    setStatusCode(code);
    setShowCodePopup(true);
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="grid">
      {/* LEFT SIDE */}
      <section className="panel">
        <h2>Your Quiz Progress</h2>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <>
            <p><strong>Total Points:</strong> {totalPoints}</p>
            <p><strong>Level:</strong> {Math.floor(totalPoints / 100) + 1}</p>
            <p><strong>Rank:</strong> {rank}</p>
            <p><strong>Quizzes Taken:</strong> {quizzesTaken}</p>
            <p><strong>Accuracy:</strong> {accuracy}%</p>

            <button
              onClick={handleQuizStatusCheck}
              style={{
                marginTop: "20px",
                padding: "14px",
                width: "100%",
                fontWeight: "bold",
                borderRadius: "10px",
                cursor: "pointer",
                background: "var(--brand)",
                color: "#fff",
              }}
            >
              Check Your Quiz Status
            </button>
          </>
        )}
      </section>

      {/* RIGHT SIDE - LEADERBOARD */}
      <section className="panel">
        <h3>Leaderboard</h3>

        {leaderboard.map((u, idx) => (
          <div
            key={u.user_id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 12,
              marginBottom: 10,
              borderRadius: 10,
              background:
                idx === 0
                  ? "rgba(255,215,0,0.3)"
                  : idx === 1
                    ? "rgba(192,192,192,0.3)"
                    : idx === 2
                      ? "rgba(205,127,50,0.3)"
                      : "rgba(255,255,255,0.05)",
            }}
          >
            <div>
              <strong>{idx + 1}</strong>{" "}
              {idx === 0 && "🥇"} {idx === 1 && "🥈"} {idx === 2 && "🥉"}
            </div>
            <div>{u.full_name}</div>
            <div>{u.total_points} pts</div>
          </div>
        ))}
      </section>

      {/* POPUP FOR STATUS CODE */}
      {showCodePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#1c1f26",
              padding: "25px",
              borderRadius: "12px",
              width: "350px",
              textAlign: "center",
              boxShadow: "0 0 15px rgba(0,0,0,0.4)",
            }}
          >
            <h3>Your Quiz Status Code</h3>

            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                background: "#2d313b",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "bold",
                letterSpacing: "1px",
                color: "#7cf5ff",
                userSelect: "auto",
              }}
            >
              {statusCode}
            </div>

            <button
              onClick={() => copyToClipboard(statusCode)}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                background: "#7cf5ff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Copy Code
            </button>

            <button
              onClick={() => setShowCodePopup(false)}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                background: "gray",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}