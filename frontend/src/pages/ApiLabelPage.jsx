import { useState, useEffect } from "react";

export default function ApiLabelPage() {
  const [dishInput, setDishInput] = useState("");
  const [restaurantInput, setRestaurantInput] = useState("");
  const [menu, setMenu] = useState([]);

  // Inject Premium Glassmorphism CSS
  useEffect(() => {
    if (document.getElementById("api-label-page-theme-css")) return;

    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');

      :root {
        --glass-bg: rgba(255, 255, 255, 0.7);
        --glass-border: rgba(255, 255, 255, 0.5);
        --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        --page-bg: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        --text-primary: #1e293b;
        --text-secondary: #64748b;
        --accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        --danger-gradient: linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%);
        --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        --card-bg: rgba(255, 255, 255, 0.25);
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --glass-bg: rgba(30, 41, 59, 0.7);
          --glass-border: rgba(255, 255, 255, 0.1);
          --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          --page-bg: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;
          --card-bg: rgba(30, 41, 59, 0.4);
        }
      }

      .api-page-container {
        font-family: 'Outfit', sans-serif;
        min-height: 100vh;
        background: var(--page-bg);
        color: var(--text-primary);
        padding: 40px 20px;
        transition: all 0.3s ease;
      }

      .glass-panel {
        background: var(--glass-bg);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        box-shadow: var(--glass-shadow);
      }

      .input-group {
        position: relative;
      }

      .input-group input {
        width: 100%;
        padding: 14px 20px;
        border-radius: 12px;
        border: 1px solid rgba(148, 163, 184, 0.3);
        background: rgba(255, 255, 255, 0.5);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
        outline: none;
      }
      
      .input-group input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        background: rgba(255, 255, 255, 0.8);
      }

      .btn-primary {
        background: var(--accent-gradient);
        color: white;
        border: none;
        padding: 14px 28px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.9rem;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(118, 75, 162, 0.3);
      }
      
      .btn-primary:active {
        transform: translateY(0);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 700;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      .action-btn {
        background: transparent;
        border: 1px solid var(--glass-border);
        color: var(--text-secondary);
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .action-btn:hover {
        background: rgba(255,255,255,0.1);
        color: var(--text-primary);
        border-color: var(--text-primary);
      }
      
      /* Table Styles */
      .glass-table-container {
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid var(--glass-border);
        box-shadow: var(--glass-shadow);
      }

      .glass-table {
        width: 100%;
        border-collapse: collapse;
        background: var(--glass-bg);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      
      .glass-table th {
        text-align: left;
        padding: 18px 24px;
        background: rgba(255, 255, 255, 0.3);
        color: var(--text-secondary);
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 1px;
        border-bottom: 1px solid var(--glass-border);
      }
      
      .glass-table td {
        padding: 16px 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        font-size: 0.95rem;
        vertical-align: middle;
      }
      
      /* Remove border from last row */
      .glass-table tr:last-child td {
        border-bottom: none;
      }
      
      .glass-table tr {
        transition: background 0.2s;
      }
      
      .glass-table tbody tr:hover {
        background: rgba(255, 255, 255, 0.15);
      }

      /* Animations */
      @keyframes popIn {
        from { opacity: 0; transform: scale(0.95) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      
      .animate-enter {
        animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
    `;

    const style = document.createElement("style");
    style.id = "api-label-page-theme-css";
    style.innerHTML = css;
    document.head.appendChild(style);
  }, []);

  // Oil analyzer
  const analyzeOilLevel = (dish) => {
    if (!dish) return "medium";
    const lowercase = dish.toLowerCase();

    if (
      lowercase.includes("fried") ||
      lowercase.includes("pakoda") ||
      lowercase.includes("poori") ||
      lowercase.includes("vada") ||
      lowercase.includes("bajji") ||
      lowercase.includes("fries") ||
      lowercase.includes("bhatura")
    ) {
      return "high";
    }

    if (
      lowercase.includes("idli") ||
      lowercase.includes("upma") ||
      lowercase.includes("salad") ||
      lowercase.includes("grilled") ||
      lowercase.includes("steamed") ||
      lowercase.includes("soup")
    ) {
      return "low";
    }

    return "medium";
  };

  // Badge renderer
  const OilBadge = ({ level }) => {
    if (level === "high")
      return <span className="badge" style={{ background: "var(--danger-gradient)" }}>🔥 High Oil</span>;
    if (level === "medium")
      return <span className="badge" style={{ background: "linear-gradient(135deg, #f09819 0%, #edde5d 100%)" }}>⚠ Medium</span>;
    return <span className="badge" style={{ background: "var(--success-gradient)" }}>🌿 Healthy Choice</span>;
  };

  // Add dish
  const addToMenu = () => {
    const dish = dishInput.trim();
    if (!dish) return;

    const restaurant = restaurantInput.trim();
    const oilLevel = analyzeOilLevel(dish);

    const id = Date.now() + Math.random().toString(36).slice(2, 7);

    setMenu((m) => [{ id, dish, restaurant, oilLevel }, ...m]);
    setDishInput("");
  };

  const removeItem = (id) => setMenu((m) => m.filter((it) => it.id !== id));

  const openSwiggyFor = ({ dish, restaurant }) => {
    const q = encodeURIComponent(`${dish}${restaurant ? " " + restaurant : ""}`);
    const url = `https://www.swiggy.com/search?query=${q}`;
    window.open(url, "_blank");
  };

  return (
    <div className="api-page-container">
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }} className="animate-enter">
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            background: "var(--accent-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "10px"
          }}>
            Smart Menu Analyzer
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)" }}>
            Instant oil-level detection for safer dining choices.
          </p>
        </div>

        {/* Input Panel */}
        <div className="glass-panel animate-enter" style={{ padding: "30px", marginBottom: "40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", alignItems: "end" }}>

            <div className="input-group">
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.9rem" }}>Dish Name</label>
              <input
                value={dishInput}
                onChange={(e) => setDishInput(e.target.value)}
                placeholder="e.g. Chicken Biryani, Paneer Tikka..."
                onKeyDown={(e) => e.key === 'Enter' && addToMenu()}
              />
            </div>

            <div className="input-group">
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.9rem" }}>Restaurant (Optional)</label>
              <input
                value={restaurantInput}
                onChange={(e) => setRestaurantInput(e.target.value)}
                placeholder="e.g. Paradise, Mehfil"
                onKeyDown={(e) => e.key === 'Enter' && addToMenu()}
              />
            </div>

            <button className="btn-primary" onClick={addToMenu} style={{ height: "52px" }}>
              Analyze Dish ✨
            </button>
          </div>
        </div>

        {/* Results Table */}
        {menu.length > 0 ? (
          <div className="glass-table-container animate-enter" style={{ animationDelay: '0.1s' }}>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Dish Name</th>
                  <th>Restaurant</th>
                  <th style={{ width: "150px" }}>Health Score</th>
                  <th style={{ textAlign: "right", width: "180px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menu.map((item, index) => (
                  <tr key={item.id} style={{ animationDelay: `${index * 0.05}s` }}>
                    <td style={{ fontWeight: 600, fontSize: "1rem" }}>{item.dish}</td>

                    <td style={{ color: "var(--text-secondary)" }}>
                      {item.restaurant ? (
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          📍 {item.restaurant}
                        </span>
                      ) : "—"}
                    </td>

                    <td>
                      <OilBadge level={item.oilLevel} />
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button
                          className="action-btn"
                          onClick={() => openSwiggyFor(item)}
                          title="Order on Swiggy"
                        >
                          🛵 Order
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => removeItem(item.id)}
                          style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
                          title="Remove from list"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)", fontStyle: "italic" }} className="glass-panel animate-enter">
            Add a dish above to see the magic happen...
          </div>
        )}

      </div>
    </div>
  );
}
