import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import jsPDF from "jspdf";

export default function OilFormsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [mode, setMode] = useState("menu");
  const [forms, setForms] = useState([]);
  const [collectorNames, setCollectorNames] = useState({});
  const [oilPercentage, setOilPercentage] = useState("");
  const [daysUsed, setDaysUsed] = useState("");
  const [oilType, setOilType] = useState("");
  const [customOilType, setCustomOilType] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");

  /*---------------------------------
        LOAD CURRENT USER
  ----------------------------------*/
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setCurrentUser({
        id: user.id,
        email: user.email,
        role: profile.role,
        firstName: profile.first_name,
        lastName: profile.last_name,
        state: profile.state,
        phone: profile.phone,
        address: profile.address,
        latitude: profile.latitude,
        longitude: profile.longitude,
      });

      // Pre-fill manual inputs if they exist
      if (profile.latitude && profile.longitude) {
        setManualLat(profile.latitude);
        setManualLng(profile.longitude);
      }
    }
    loadUser();
  }, []);

  /*---------------------------------
        SET MODE AFTER USER LOADS
  ----------------------------------*/
  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === "collector" || currentUser.role === "policy") {
      setMode("list");
    } else {
      setMode("menu");
    }
  }, [currentUser]);

  const role = currentUser?.role;

  /*---------------------------------
        FETCH COLLECTOR NAME
  ----------------------------------*/
  async function getCollectorName(id) {
    if (!id) return null;

    if (collectorNames[id]) return collectorNames[id];

    const { data } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", id)
      .single();

    if (data) {
      const fullName = `${data.first_name} ${data.last_name}`;
      setCollectorNames((prev) => ({ ...prev, [id]: fullName }));
      return fullName;
    }

    return "Unknown Collector";
  }

  async function loadCollectorNames(formsList) {
    for (const f of formsList) {
      if (f.owner_collector_id) {
        await getCollectorName(f.owner_collector_id);
      }
    }
  }

  /*---------------------------------
        LOAD FORMS
  ----------------------------------*/
  useEffect(() => {
    if (!currentUser) return;
    loadForms();
  }, [currentUser]);

  async function loadForms() {
    if (!currentUser) return;

    const me = currentUser.id;

    // USER
    if (role === "user") {
      const { data } = await supabase
        .from("oil_forms")
        .select("*")
        .eq("user_id", me)
        .order("created_at", { ascending: false });

      setForms(data || []);
      loadCollectorNames(data || []);
      return;
    }

    // COLLECTOR
    if (role === "collector") {
      const { data } = await supabase
        .from("oil_forms")
        .select("*")
        .eq("state", currentUser.state)
        .order("created_at", { ascending: false });

      const visible = (data || []).filter((f) => {
        const rejected = f.rejected_by || [];
        if (rejected.includes(me)) return false;
        if (f.status === "collected") return false;
        if (f.owner_collector_id && f.owner_collector_id !== me) return false;
        return true;
      });

      setForms(visible);
      loadCollectorNames(visible);
      return;
    }

    // POLICY
    const { data } = await supabase.from("oil_forms").select("*");
    setForms(data || []);
    loadCollectorNames(data || []);
  }

  /*---------------------------------
        USER SUBMITS FORM
  ----------------------------------*/
  async function handleSubmit(e) {
    e.preventDefault();

    if (!oilPercentage || !daysUsed) {
      alert("Fill all fields.");
      return;
    }

    const finalOilType =
      oilType === "Other" ? customOilType : oilType;
    const nowStr = new Date().toISOString();
    const nowId = Date.now();

    // 1. Get Location (Permission based)
    let lat = null;
    let lng = null;

    try {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
      } else {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          });
        });

        if (position) {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
        }
      }
    } catch (locErr) {
      console.warn("Location error:", locErr);
      if (locErr.code === 1) { // PERMISSION_DENIED
        alert("Please allow Location Access to assign a collector!");
      } else if (locErr.code === 3) { // TIMEOUT
        alert("Location request timed out. Please try again or check your signal.");
      } else {
        console.log("Location err", locErr);
      }
    }

    const form = {
      id: nowId,
      user_id: currentUser.id,
      user_name: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address,
      state: currentUser.state,
      oil_percentage: Number(oilPercentage),
      days_used: Number(daysUsed),
      created_at: nowStr,
      owner_collector_id: null,
      rejected_by: [],
      status: "submitted",
      oil_type: finalOilType,
      latitude: lat,
      longitude: lng,
    };

    const { error } = await supabase.from("oil_forms").insert(form);

    if (error) {
      console.error("Submit error:", error);
      alert("Error submitting form: " + error.message);
      return;
    }

    alert(lat ? "Form submitted with location! Finding nearest collector..." : "Form submitted (Location not provided).");
    setOilPercentage("");
    setDaysUsed("");
    setMode("list");
    loadForms();
  }

  /*---------------------------------
        COLLECTOR UPDATE LOCATION
  ----------------------------------*/
  async function saveManualLocation() {
    if (!manualLat || !manualLng) {
      alert("Please enter valid Latitude and Longitude");
      return;
    }

    const updates = {
      latitude: parseFloat(manualLat),
      longitude: parseFloat(manualLng)
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", currentUser.id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("📍 Location Updated Successfully!");
      // Update local state to reflect saved
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  }

  /*---------------------------------
        COLLECTOR ACCEPT
  ----------------------------------*/
  async function acceptForm(id) {
    await supabase
      .from("oil_forms")
      .update({
        // owner_collector_id is already set, just confirm status
        status: "accepted",
      })
      .eq("id", id);

    loadForms();
  }

  /*---------------------------------
        COLLECTOR COLLECT
  ----------------------------------*/
  async function collectForm(id) {
    await supabase
      .from("oil_forms")
      .update({ status: "collected" })
      .eq("id", id);

    loadForms();
  }

  /*---------------------------------
        COLLECTOR REJECT
  ----------------------------------*/
  async function rejectForm(id) {
    // Call RPC to reassign to next nearest collector immediately
    const { error } = await supabase.rpc('reassign_stale_form', { form_id: id });

    if (error) {
      console.error("Reassign error:", error);
      alert("Error reassigning: " + error.message);
    } else {
      // loadForms will refresh the list, removing this form from view
      loadForms();
    }
  }

  /*---------------------------------
        TRACKING TEXT
  ----------------------------------*/
  function getTracking(f) {
    if (f.status === "collected")
      return "✅ Collector Collected The Oil — Completed";

    if (f.status === "accepted")
      return "📦 Collector Accepted Your Request";

    if (f.status === "submitted") {
      if (f.owner_collector_id) return "⏳ Assigned to Collector — Waiting for Approval";
      return "📌 Form Submitted — Looking for Collector...";
    }

    return "Status Unknown";
  }

  /*---------------------------------
        DOWNLOAD PDF
  ----------------------------------*/
  function downloadPdf(f) {
    const doc = new jsPDF();
    doc.text("Oil Report", 20, 20);
    doc.text(`Name: ${f.user_name}`, 20, 40);
    doc.text(`Oil: ${f.oil_percentage}%`, 20, 60);
    doc.text(`Days Used: ${f.days_used}`, 20, 80);
    doc.text(`Type of Oil: ${f.oil_type || f.oilType || "—"}`, 20, 100);
    doc.save("report.pdf");
  }

  /*---------------------------------
        UI
  ----------------------------------*/
  return (
    <div style={{ padding: 30 }}>

      {/* USER MENU */}
      {role === "user" && (
        <div style={{ marginBottom: 20, display: "flex", gap: "10px" }}>
          <button onClick={() => setMode("submit")}>Submit Form</button>
          <button onClick={() => setMode("list")}>View Forms</button>
        </div>
      )}

      {/* COLLECTOR MENU */}
      {role === "collector" && (
        <div style={{ padding: 20, border: "1px solid var(--border)", background: "var(--panel)", borderRadius: 12, marginBottom: 20 }}>
          <h3>📋 Manage Service Location</h3>
          <p style={{ fontSize: "0.9em", color: "var(--text)" }}>Set where you operate so new requests can be assigned to you.</p>

          <div style={{ display: "flex", gap: "10px", marginTop: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85em" }}>Latitude</label>
              <input
                type="number"
                placeholder="0.0000"
                value={manualLat}
                onChange={e => setManualLat(e.target.value)}
                style={{ width: "120px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85em" }}>Longitude</label>
              <input
                type="number"
                placeholder="0.0000"
                value={manualLng}
                onChange={e => setManualLng(e.target.value)}
                style={{ width: "120px" }}
              />
            </div>

            <button
              onClick={saveManualLocation}
              style={{ background: "var(--highlight)", color: "white" }}
            >
              Update Location
            </button>

            <button
              onClick={() => {
                if (!navigator.geolocation) return alert("Geolocation not supported");
                navigator.geolocation.getCurrentPosition((pos) => {
                  setManualLat(pos.coords.latitude);
                  setManualLng(pos.coords.longitude);
                }, (err) => alert("Access denied. Please enter coordinates manually."));
              }}
              style={{ background: "#666", color: "white" }}
            >
              📍 Get Current GPS
            </button>
          </div>
          {currentUser.latitude && (
            <p style={{ marginTop: 8, fontSize: "0.85em", color: "green" }}>
              ✅ Active Service Point: {currentUser.latitude.toFixed(4)}, {currentUser.longitude.toFixed(4)}
            </p>
          )}
        </div>
      )}

      {/* SUBMIT FORM */}
      {role === "user" && mode === "submit" && (
        <form className="form-container" onSubmit={handleSubmit}
        >
          <input
            type="number"
            placeholder="Oil ml"
            value={oilPercentage}
            onChange={(e) => setOilPercentage(e.target.value)}
          />
          <input
            type="number"
            placeholder="Days Used"
            value={daysUsed}
            onChange={(e) => setDaysUsed(e.target.value)}
          />
          {/* TYPE OF OIL DROPDOWN */}
          <select
            value={oilType}
            onChange={(e) => setOilType(e.target.value)}
          >
            <option value="">Select Oil Type</option>
            <option value="Sunflower Oil">Sunflower Oil</option>
            <option value="Palm Oil">Palm Oil</option>
            <option value="Coconut Oil">Coconut Oil</option>
            <option value="Olive Oil">Olive Oil</option>
            <option value="Castor Oil">Castor Oil</option>
            <option value="Soybean oil">Soybean Oil</option>
            <option value="Canola Oil">Canola Oil</option>
            <option value="Corn Oil">Corn Oil</option>
            <option value="Other">Other</option>
          </select>
          {/* SHOW CUSTOM FIELD IF OTHER IS SELECTED */}
          {oilType === "Other" && (
            <input
              type="text"
              placeholder="Enter Oil Type"
              value={customOilType}
              onChange={(e) => setCustomOilType(e.target.value)}
            />
          )}
          <button type="submit">Submit</button>
        </form>
      )}

      {/* FORM LIST */}
      {mode === "list" && (
        <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {forms.length === 0 && <p>No forms.</p>}

          {forms.map((f) => (
            <div
              key={f.id}
              style={{
                border: "1px solid var(--border)",
                background: "var(--panel)",
                borderRadius: "12px",
                padding: 14,
                width: "fit-content",
                maxWidth: "600px"
              }}
            >
              <p><b>{f.user_name}</b></p>
              <p>Oil: {f.oil_percentage}ml</p>
              <p>Days Used: {f.days_used}</p>
              <p>Type of Oil: {f.oil_type || f.oilType}</p>
              <p>{new Date(f.created_at).toLocaleString()}</p>

              {/* USER TRACKING */}
              {role === "user" && (
                <div style={{ color: "var(--warn)", fontWeight: "bold" }}>
                  <p>{getTracking(f)}</p>

                  {f.owner_collector_id && f.status !== 'submitted' && (
                    <p>
                      {f.status === 'accepted' || f.status === 'collected' ? "Accepted by: " : "Assigned to: "}
                      {collectorNames[f.owner_collector_id] || "Loading..."}
                    </p>
                  )}
                  {/* If submitted but assigned, users might see "Assigned (Waiting)" from getTracking. The name isn't fully confirmed yet */}
                  {f.owner_collector_id && f.status === 'submitted' && (
                    <p>Pending Approval from: {collectorNames[f.owner_collector_id] || "..."}</p>
                  )}
                </div>
              )}

              {/* COLLECTOR ACTIONS - TEXT INFO */}
              {role === "collector" && f.owner_collector_id === currentUser.id && (
                <>
                  {f.status === 'submitted' && <p style={{ color: "orange" }}>⏳ Pending Your Approval</p>}
                  {f.status === 'accepted' && <p style={{ color: "var(--success)" }}>✔ You Accepted This Form</p>}

                  {f.status !== 'submitted' && (
                    <p>
                      Accepted by you: {currentUser.firstName} {currentUser.lastName}
                    </p>
                  )}

                  {f.status === "collected" && (
                    <p style={{ color: "var(--success)" }}>
                      ✔ Collected by you
                    </p>
                  )}
                </>
              )}

              {/* BUTTONS ROW */}
              <div style={{ display: "flex", gap: "10px", marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
                {role === "collector" && (
                  <>
                    {/* Show Accept/Reject if: UNASSIGNED OR ASSIGNED TO ME BUT STILL SUBMITTED */}
                    {(!f.owner_collector_id || (f.owner_collector_id === currentUser.id && f.status === 'submitted')) && (
                      <>
                        <button onClick={() => acceptForm(f.id)}>Accept</button>
                        <button onClick={() => rejectForm(f.id)}>
                          Reject
                        </button>
                      </>
                    )}

                    {f.owner_collector_id === currentUser.id && f.status === "accepted" && (
                      <button onClick={() => collectForm(f.id)}>
                        Collected Successfully
                      </button>
                    )}
                  </>
                )}

                <button onClick={() => downloadPdf(f)}>Download PDF</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}