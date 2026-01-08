// src/pages/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const nav = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #f97316 0, #f97316 14%, transparent 60%), #020617",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1.5fr 1.2fr",
          gap: 24,
        }}
      >
        {/* Left: App description */}
        <div
          style={{
            padding: 24,
            borderRadius: 18,
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(37,99,235,0.9))",
            boxShadow: "0 24px 60px rgba(15,23,42,0.9)",
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: 8 }}>
            <span style={{ opacity: 0.8, fontSize: 18 }}>Welcome to</span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, #f97316, #facc15, #22c55e)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontSize: 40,
                fontWeight: 700,
              }}
            >
              Oilwise
            </span>
          </h1>

          <p style={{ marginBottom: 12, opacity: 0.9 }}>
            A Smart India Hackathon solution to track edible oil usage and
            measure the impact of low-oil campaigns across India.
          </p>

          <div style={{ fontSize: 14, opacity: 0.95 }}>
            <p style={{ fontWeight: 600 }}>For Normal Users</p>
            <ul>
              <li>Sign up and log your daily cooking oil usage.</li>
              <li>See your own trends and get aware of excess oil.</li>
              <li>Support a healthier, low-oil lifestyle.</li>
            </ul>

            <p style={{ fontWeight: 600, marginTop: 16 }}>For Policymakers</p>
            <ul>
              <li>View real-time dashboards by state and district.</li>
              <li>Identify high-consumption regions.</li>
              <li>
                Track the impact of mid-day meal and low-oil awareness schemes.
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Choose role */}
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          <div
            style={{
              padding: 20,
              borderRadius: 18,
              background: "#0f172a",
              border: "1px solid rgba(148,163,184,0.5)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 4 }}>Choose how you enter</h2>
            <p style={{ fontSize: 13, opacity: 0.8 }}>
              Oilwise has two experiences – one for citizens and one for
              government stakeholders.
            </p>

            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              <button
                onClick={() => nav("/user")}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  background:
                    "linear-gradient(90deg,#22c55e,#a3e635,#facc15)",
                  color: "#022c22",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                👤 Continue as Normal User
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                  You will see the user Home page where you can sign up / sign in
                  and track your oil usage.
                </div>
              </button>

              <button
                onClick={() => nav("/policymaker")}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(148,163,184,0.7)",
                  cursor: "pointer",
                  textAlign: "left",
                  background: "#020617",
                  color: "white",
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                🧑‍💼 Continue as Policymaker
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                  Login to access the real-time district/state dashboard.
                </div>
              </button>
            </div>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "#020617",
              border: "1px dashed rgba(148,163,184,0.5)",
              fontSize: 12,
              opacity: 0.85,
            }}
          >
            <strong>Note:</strong> This is a hackathon prototype. All data is
            stored locally in your browser for demo purposes only.
          </div>
        </div>
      </div>
    </div>
  );
}
