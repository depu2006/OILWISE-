// src/pages/PolicyDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import IndiaUsageMap from "../components/IndiaUsageMap";
import OilCollectionMap from "../components/OilCollectionMap";
import { syntheticUsers, syntheticOilConsumption } from "../data/syntheticUsers";

export default function PolicyDashboard({ currentUser }) {
  const [profile, setProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("synthetic"); // synthetic, real, centers
  const useSyntheticData = viewMode === "synthetic";

  const normalize = (s) => (s || "").trim().toLowerCase();
  const fixStateName = (raw) => {
    const s = normalize(raw);
    if (["hyderabad", "hydrabad", "hyderbad"].includes(s)) return "telangana";
    return s;
  };

  useEffect(() => { loadEverything(); }, []);

  async function loadEverything() {
    setLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const uid = authData?.user?.id;

      // 1. Try fetching profile from DB
      let { data: prof, error: profError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();

      // 2. Fallback to passed prop if DB fetch failed or empty
      if (!prof && currentUser) {
        prof = currentUser;
      }

      setProfile(prof);

      // If we still don't have a profile/state, we can't really load state-specific data
      if (!prof) {
        console.warn("No profile found for dashboard");
        return;
      }

      const { data: usersData } = await supabase
        .from("profiles")
        .select("id, state");
      setAllUsers(usersData || []);

      const { data: logsData } = await supabase
        .from("food_analysis_logs")
        .select("user_id, oil_content, created_at");
      setAllLogs(logsData || []);

      const { data: noti } = await supabase
        .from("notifications")
        .select("*")
        .eq("state", prof.state || "") // Handle missing state safely
        .order("created_at", { ascending: false });
      setNotifications(noti || []);

    } catch (err) {
      console.error("Dashboard verify error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostNotification(e) {
    e.preventDefault();
    if (!newNotification.trim()) return;

    const { error } = await supabase.from("notifications").insert({
      message: newNotification.trim(),
      state: profile.state,
      created_by: profile.id,
    });

    if (!error) {
      setMessage("🎉 Posted!");
      setNewNotification("");

      const { data: updated } = await supabase
        .from("notifications")
        .select("*")
        .eq("state", profile.state)
        .order("created_at", { ascending: false });

      setNotifications(updated || []);
    } else {
      setMessage("❌ Error posting notification");
    }
  }

  const stateUserCount = useMemo(() => {
    const userCount = {};
    const usersToCount = useSyntheticData ? syntheticUsers : allUsers;

    usersToCount.forEach((user) => {
      if (!user.state) return;
      const st = fixStateName(user.state);
      userCount[st] = (userCount[st] || 0) + 1;
    });
    return userCount;
  }, [allUsers, useSyntheticData]);

  const stateOilUsage = useMemo(() => {
    if (useSyntheticData) {
      // Use synthetic oil consumption data
      const normalized = {};
      Object.entries(syntheticOilConsumption).forEach(([state, consumption]) => {
        const st = fixStateName(state);
        normalized[st] = consumption;
      });
      return normalized;
    } else {
      // Calculate from real tracker logs
      const oilByState = {};
      const usersByState = {};

      // Group users by state
      allUsers.forEach((user) => {
        if (!user.state) return;
        const st = fixStateName(user.state);
        if (!usersByState[st]) usersByState[st] = [];
        usersByState[st].push(user.id);
      });

      // Calculate average oil consumption per state
      Object.entries(usersByState).forEach(([state, userIds]) => {
        const stateLogs = allLogs.filter(log => userIds.includes(log.user_id));

        if (stateLogs.length > 0) {
          // Count unique dates to get actual days of data
          const uniqueDates = new Set(
            stateLogs.map(log => new Date(log.created_at).toDateString())
          );
          const daysWithData = uniqueDates.size || 1; // Avoid division by zero

          const totalOil = stateLogs.reduce((sum, log) => sum + (Number(log.oil_content) || 0), 0);
          // Calculate daily average (oil_content is already in grams)
          const avgPerDay = totalOil / (userIds.length * daysWithData);
          oilByState[state] = Math.round(avgPerDay);
        } else {
          // If no real data, use synthetic data as fallback
          const normalizedState = Object.keys(syntheticOilConsumption).find(
            s => fixStateName(s) === state
          );
          oilByState[state] = normalizedState ? syntheticOilConsumption[normalizedState] : 20;
        }
      });

      // Debug: Log the calculated oil usage
      console.log('Real Data - State Oil Usage:', oilByState);
      console.log('Total users by state:', Object.keys(usersByState).length);
      console.log('Total logs:', allLogs.length);

      return oilByState;
    }
  }, [allUsers, allLogs, useSyntheticData]);

  if (loading) return <p>Loading Dashboard…</p>;
  if (!profile || profile.role !== "policy") return <p>You are not authorized.</p>;

  return (
    <div className="policy-container">

      {/* INTERNAL CSS */}
      <style>{`
        :root {
          --bg-light: #f8f9ff;
          --card-bg-light: #ffffff;
          --text-primary-light: #222;
          --border-light: #d4d7dd;

          --bg-dark: #0b0f17;
          --card-bg-dark: #141a26;
          --text-primary-dark: #f1f5f9;
          --border-dark: #2a3242;
        }

        body.light-theme {
          --bg: var(--bg-light);
          --card-bg: var(--card-bg-light);
          --text-primary: var(--text-primary-light);
          --border-color: var(--border-light);
        }

        body.dark-theme {
          --bg: var(--bg-dark);
          --card-bg: var(--card-bg-dark);
          --text-primary: var(--text-primary-dark);
          --border-color: var(--border-dark);
        }

        .policy-container {
          width: 100%;
          min-height: 100vh;
          background: var(--bg);
          padding: 20px;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .logged-in {
          margin-bottom: 20px;
          color: var(--text-primary);
        }

        /* PANEL FIXED WIDTH — FULL WIDTH + CENTERED */
        .panel {
          width: 100%;
          max-width: 1400px;    /* panel width increased */
          margin: 20px auto;    /* center align */
          background: var(--card-bg);
          padding: 25px;
          border-radius: 14px;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .panel-title {
          font-size: 1.6rem;
          margin-bottom: 8px;
        }

        .muted {
          opacity: 0.7;
          margin-bottom: 10px;
        }

        .notify-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }

        .input-box {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          color: var(--text-primary);
        }

        .send-btn {
          background: #0055ff;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 1rem;
        }

        .notif-item {
          padding: 10px;
          border-bottom: 1px solid var(--border-color);
        }

        .toggle-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
          padding: 10px;
          background: rgba(123, 31, 162, 0.1);
          border-radius: 8px;
        }

        .toggle-btn {
          background: #7B1FA2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .toggle-btn:hover {
          background: #9C27B0;
          transform: translateY(-1px);
        }

        .toggle-btn.inactive {
          background: #ccc;
          color: #666;
        }

        .data-info {
          font-size: 0.85rem;
          color: var(--text-primary);
          opacity: 0.8;
        }

        /* MOBILE RESPONSIVE STYLES */
        @media (max-width: 768px) {
          .policy-container {
            padding: 12px;
          }

          .page-title {
            font-size: 1.5rem;
            margin-bottom: 10px;
          }

          .logged-in {
            font-size: 0.9rem;
            margin-bottom: 15px;
          }

          .panel {
            max-width: 100%;
            padding: 18px;
            margin: 15px auto;
            border-radius: 12px;
          }

          .panel-title {
            font-size: 1.3rem;
            margin-bottom: 6px;
          }

          .muted {
            font-size: 0.85rem;
          }

          .toggle-container {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            padding: 12px;
          }

          .toggle-btn {
            width: 100%;
            padding: 10px 14px;
            font-size: 0.85rem;
          }

          .data-info {
            font-size: 0.8rem;
            text-align: center;
          }

          .notify-form {
            gap: 10px;
          }

          .input-box {
            padding: 10px;
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .send-btn {
            padding: 14px;
            font-size: 1rem;
          }

          .notif-item {
            padding: 8px;
          }
        }

        @media (max-width: 480px) {
          .policy-container {
            padding: 8px;
          }

          .page-title {
            font-size: 1.3rem;
          }

          .panel {
            padding: 14px;
            margin: 12px auto;
          }

          .panel-title {
            font-size: 1.1rem;
          }

          .toggle-btn {
            padding: 8px 12px;
            font-size: 0.8rem;
          }

          .send-btn {
            padding: 12px;
            font-size: 0.95rem;
          }
        }
      `}</style>

      <h1 className="page-title">Policy Dashboard</h1>
      <p className="logged-in">Logged in as: <b>{profile.state}</b></p>

      <div className="panel">
        <h2 className="panel-title">Oil Consumption Map</h2>
        <p className="muted">State-wise oil usage with color indicators (🟢 Green: &lt;20g, 🟠 Orange: 20-30g, 🔴 Red: &gt;30g per person/day)</p>

        <div className="toggle-container" style={{ gap: "10px", flexWrap: "wrap" }}>
          <button
            className={`toggle-btn ${viewMode === "synthetic" ? "" : "inactive"}`}
            onClick={() => setViewMode("synthetic")}
          >
            Synthetic Data
          </button>
          <button
            className={`toggle-btn ${viewMode === "real" ? "" : "inactive"}`}
            onClick={() => setViewMode("real")}
          >
            Real Data
          </button>
          <button
            className={`toggle-btn ${viewMode === "centers" ? "" : "inactive"}`}
            onClick={() => setViewMode("centers")}
          >
            Collection Centers
          </button>
        </div>

        {viewMode === "centers" ? (
          <div style={{ marginTop: 20 }}>
            <p className="muted" style={{ marginBottom: 15 }}>
              📍 Verified used oil collection centers across India.
            </p>
            <OilCollectionMap />
          </div>
        ) : (
          <>
            <span
              className="data-info"
              style={{ display: "block", marginTop: 10, marginBottom: 10 }}
            >
              {viewMode === "synthetic"
                ? `📊 Showing ${Object.values(stateUserCount).reduce(
                  (a, b) => a + b,
                  0
                )} synthetic users`
                : `📊 Showing ${Object.values(stateUserCount).reduce(
                  (a, b) => a + b,
                  0
                )} real users (Note: New database starts empty)`}
            </span>

            {/* EMPTY STATE MESSAGE */}
            {viewMode === "real" && Object.keys(stateUserCount).length === 0 && (
              <div style={{
                padding: "20px",
                background: "#fffde7",
                border: "1px solid #fbc02d",
                borderRadius: "8px",
                color: "#f57f17",
                marginBottom: "15px"
              }}>
                <strong>No Data Found?</strong>
                <p style={{ margin: "5px 0 0" }}>
                  It looks like there are no users with valid states in the database yet.
                  <br />
                  Try switching to <b>Synthetic Data</b> to see the demo visualization, or sign up more users!
                </p>
              </div>
            )}

            <IndiaUsageMap
              stateUserCount={stateUserCount}
              stateOilUsage={stateOilUsage}
              highlightState={profile.state}
            />
          </>
        )}
      </div>

      <div className="panel">
        <h2 className="panel-title">Send Notification to {profile.state}</h2>

        <form onSubmit={handlePostNotification} className="notify-form">
          <textarea
            rows={3}
            placeholder="Write notification…"
            className="input-box"
            value={newNotification}
            onChange={(e) => setNewNotification(e.target.value)}
          />
          <button className="send-btn">Post Notification</button>
          {message && <p>{message}</p>}
        </form>

        <h3 className="panel-title" style={{ marginTop: 20 }}>Notifications</h3>

        {notifications.map((n) => (
          <div key={n.id} className="notif-item">
            <p>{n.message}</p>
            <small className="muted">
              {new Date(n.created_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
