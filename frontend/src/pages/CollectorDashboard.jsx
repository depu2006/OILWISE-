import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CollectorDashboard() {
  const [forms, setForms] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadCollector();
  }, []);

  async function loadCollector() {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(prof);

    loadForms(prof.state);
  }

  async function loadForms(state) {
    const { data } = await supabase
      .from("oil_forms")
      .select("*")
      .eq("state", state)
      .order("created_at", { ascending: false });

    setForms(data || []);
  }

  async function acceptForm(id) {
    await supabase
      .from("oil_forms")
      .update({ status: "accepted", collector_id: profile.id })
      .eq("id", id);

    loadForms(profile.state);
  }

  async function rejectForm(id) {
    await supabase
      .from("oil_forms")
      .update({ status: "rejected", collector_id: profile.id })
      .eq("id", id);

    loadForms(profile.state);
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Oil Collector Dashboard</h1>

      <h2>Forms in Your State</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "12px" }}>
        {forms.map((f) => (
          <div key={f.id} style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "12px", padding: 12, width: "fit-content", maxWidth: "600px" }}>
            <p>User ID: {f.user_id}</p>
            <p>Oil: {f.oil_percentage}%</p>
            <p>Days Used: {f.days_used}</p>
            <p>Address: {f.address}</p>
            <p>Status: {f.status}</p>

            {f.status === "pending" && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => acceptForm(f.id)}>Accept</button>
                <button onClick={() => rejectForm(f.id)}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
