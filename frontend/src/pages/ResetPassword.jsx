import { useState } from "react";
import { supabase } from "../supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const { data, error } = await supabase.auth.updateUser({
      password
    });

    if (error) setMsg(error.message);
    else setMsg("Password updated! You can now log in.");
  }

  return (
    <div className="panel" style={{ maxWidth: 450, margin: "40px auto", padding: 25 }}>
      <h2>Set New Password</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{
            padding: 10,
            border: "none",
            borderRadius: 8,
            background: "var(--brand)",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Update Password
        </button>
      </form>

      <p style={{ marginTop: 10, color: "lightgreen" }}>{msg}</p>
    </div>
  );
}
