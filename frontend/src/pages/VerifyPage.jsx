// src/pages/VerifyPage.jsx
import { useState } from "react";
import { supabase } from "../supabase";

export default function VerifyPage() {
  const [codeInput, setCodeInput] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleVerifyCode() {
    setError("");
    setLoading(true);
    setReport(null);

    try {
      const code = codeInput.trim();
      if (!code) {
        setError("Please enter your quiz status code.");
        setLoading(false);
        return;
      }

      // 1️⃣ FIND THE USER IN quiz_status_profiles USING THE CODE
      const { data: statusRow, error: statusErr } = await supabase
        .from("quiz_status_profiles")
        .select("*")
        .eq("status_code", code)
        .single();

      if (statusErr || !statusRow) {
        console.error(statusErr);
        setError("Invalid status code ❌");
        setLoading(false);
        return;
      }

      const userId = statusRow.id; // this matches profiles.id & quiz_results.user_id

      // 2️⃣ GET QUIZ RESULTS FOR THIS USER
      const { data: quizResults, error: qrErr } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", userId);

      if (qrErr) {
        console.error(qrErr);
      }

      const results = quizResults || [];

      const quizzesTaken = results.length;
      const totalScore = results.reduce((sum, row) => sum + (row.score || 0), 0);
      const totalQuestions = results.reduce(
        (sum, row) => sum + (row.total_questions || 0),
        0
      );
      const totalPoints = results.reduce(
        (sum, row) => sum + (row.points_earned || 0),
        0
      );

      const accuracy =
        totalQuestions > 0
          ? Math.round((totalScore / totalQuestions) * 100)
          : 0;

      // 3️⃣ GET RANK FROM quiz_leaderboard VIEW
      const { data: leaderboard, error: lbErr } = await supabase
        .from("quiz_leaderboard")
        .select("*")
        .order("position", { ascending: true });

      if (lbErr) {
        console.error(lbErr);
      }

      const row = (leaderboard || []).find((u) => u.user_id === userId);
      const rank = row?.position ?? "N/A";

      // 4️⃣ BUILD REPORT USING quiz_status_profiles FOR USER DETAILS
      const displayProfile = {
        first_name: statusRow.first_name,
        last_name: statusRow.last_name,
        email: statusRow.email,
        phone: statusRow.phone,
        state: statusRow.state,
        address: statusRow.address,
        role: statusRow.role,
      };

      setReport({
        ...displayProfile,
        quizzesTaken,
        accuracy,
        totalPoints,
        rank,
        statusCode: statusRow.status_code,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching your report.");
      setLoading(false);
    }
  }

  // ======================
  // STEP 1: ENTER CODE
  // ======================
  if (!report)
    return (
      <div style={styles.page}>
        <div style={styles.box}>
          <h2 style={{ marginBottom: 20, color: "white" }}>
            Verify Your Quiz Status
          </h2>

          <input
            type="text"
            placeholder="Enter Status Code (e.g., QS-7LPA-0UMB)"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            style={styles.input}
          />

          {error && (
            <p style={{ color: "salmon", marginTop: 10, fontSize: 14 }}>
              {error}
            </p>
          )}

          <button onClick={handleVerifyCode} style={styles.button}>
            {loading ? "Checking..." : "Verify"}
          </button>
        </div>
      </div>
    );

  // ======================
  // STEP 2: SHOW REPORT
  // ======================

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>HEALTH & QUIZ REPORT CARD</h1>

        {/* USER INFO */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>User Information</h3>
          <p>
            <b>Name:</b> {report.first_name} {report.last_name}
          </p>
          <p>
            <b>Email:</b> {report.email}
          </p>
          <p>
            <b>Phone:</b> {report.phone}
          </p>
          <p>
            <b>State:</b> {report.state}
          </p>
          <p>
            <b>Address:</b> {report.address}
          </p>
          <p>
            <b>Role:</b> {report.role}
          </p>
        </div>

        {/* QUIZ PERFORMANCE */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Quiz Performance</h3>
          <p>
            <b>Total Points:</b> {report.totalPoints}
          </p>
          <p>
            <b>Rank:</b> {report.rank}
          </p>
          <p>
            <b>Quizzes Taken:</b> {report.quizzesTaken}
          </p>
          <p>
            <b>Accuracy:</b> {report.accuracy}%
          </p>
        </div>

        {/* STATUS CODE */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Verification Code</h3>
          <div style={styles.codeBox}>{report.statusCode}</div>
          <p style={{ marginTop: 8, fontSize: 13 }}>
            Share this code if someone wants to verify your quiz performance.
          </p>
        </div>

        {/* SUGGESTIONS */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Suggestions</h3>
          {report.accuracy >= 80 && (
            <p>Excellent performance! Keep maintaining your healthy habits 🎉</p>
          )}
          {report.accuracy >= 50 && report.accuracy < 80 && (
            <p>
              Good job! Review questions you got wrong and try one more quiz to
              push your score higher 💪
            </p>
          )}
          {report.accuracy < 50 && (
            <p>
              Your current score shows there’s room to grow. Read the campaign
              tips and retake quizzes to build strong healthy-oil habits 📘
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============== STYLES ==============

const styles = {
  page: {
    minHeight: "100vh",
    background: "#11131a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  box: {
    background: "#1c1f27",
    padding: 30,
    borderRadius: 12,
    width: 420,
    textAlign: "center",
    color: "white",
    boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #555",
    background: "#2a2d36",
    color: "white",
    fontSize: 15,
  },
  button: {
    marginTop: 18,
    width: "100%",
    padding: 12,
    background:
      "linear-gradient(90deg, #00d4ff 0%, #7cf5ff 50%, #ffe35b 100%)",
    border: "none",
    color: "#11131a",
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 999,
    cursor: "pointer",
  },
  card: {
    width: 880,
    background: "#d8f4f6",
    padding: 40,
    borderRadius: 14,
    boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#006c75",
    marginTop: 0,
    marginBottom: 24,
  },
  section: {
    background: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderLeft: "6px solid #0099a5",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: 10,
    color: "#00717c",
  },
  codeBox: {
    background: "#0099a5",
    color: "white",
    padding: "10px 18px",
    borderRadius: 8,
    fontSize: 22,
    fontWeight: "bold",
    display: "inline-block",
  },
};