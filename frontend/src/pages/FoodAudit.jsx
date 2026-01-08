import { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function FoodAudit() {
  const [barcode, setBarcode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // COLLAPSE TOGGLES (NEW)
  const [showIngredients, setShowIngredients] = useState(false);
  const [showAdditives, setShowAdditives] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [showPie, setShowPie] = useState(false);

  async function audit() {
    setError("");
    setResult(null);

    try {
      const res = await axios.post("http://localhost:5000/audit", { barcode });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setResult(res.data);
      }
    } catch (err) {
      setError("Server error. Ensure backend is running.");
    }
  }

  // Extract useful nutrition values for charts
  const getMacroData = () => {
    if (!result) return null;
    const n = result.nutrition || {};

    return {
      labels: ["Fat", "Saturated Fat", "Sugar", "Salt", "Carbs", "Protein"],
      datasets: [
        {
          label: "g per 100g",
          data: [
            n.fat_100g || 0,
            n["saturated-fat_100g"] || 0,
            n.sugars_100g || 0,
            n.salt_100g || 0,
            n.carbohydrates_100g || 0,
            n.proteins_100g || 0,
          ],
          backgroundColor: [
            "#ff7675",
            "#e17055",
            "#fd79a8",
            "#74b9ff",
            "#55efc4",
            "#ffeaa7",
          ],
        },
      ],
    };
  };

  const getPieData = () => {
    if (!result) return null;
    const n = result.nutrition || {};

    return {
      labels: ["Fat", "Carbs", "Protein", "Sugar"],
      datasets: [
        {
          data: [
            n.fat_100g || 0,
            n.carbohydrates_100g || 0,
            n.proteins_100g || 0,
            n.sugars_100g || 0,
          ],
          backgroundColor: ["#ff7675", "#55efc4", "#74b9ff", "#ffeaa7"],
        },
      ],
    };
  };

  const collapseBtn = {
    padding: "10px",
    background: "var(--panel)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: 20,
    marginTop: 20,
    fontWeight: "bold",
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>AI Food Consumption Audit</h1>

      {/* INPUT FIELD */}
      <div>
        <input
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Enter Barcode"
          style={{
            padding: 10,
            width: "60%",
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: "var(--input-bg)",
            color: "var(--text)"
          }}
        />

        <button
          onClick={audit}
          style={{
            padding: 10,
            marginLeft: 10,
            background: "var(--brand)",
            border: "none",
            borderRadius: 6,
            color: "#0b0f19",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Audit
        </button>
      </div>

      {error && <p style={{ color: "var(--danger)", marginTop: 10 }}>{error}</p>}

      {/* OUTPUT */}
      {result && (
        <div style={{ marginTop: 30 }}>

          {/* PRODUCT CARD */}
          <div
            style={{
              background: "var(--panel)",
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
              border: "1px solid var(--border)",
            }}
          >
            <h2>{result.identity.name}</h2>
            <p><b>Brand:</b> {result.identity.brand}</p>
            <p><b>Category:</b> {result.identity.category}</p>
          </div>

          {/* INGREDIENTS */}
          <button
            style={collapseBtn}
            onClick={() => setShowIngredients(!showIngredients)}
          >
            {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
          </button>

          {showIngredients && (
            <div style={{ marginBottom: 20 }}>
              <h3>Ingredients</h3>
              <table style={{ width: "100%", background: "var(--input-bg)", borderRadius: 8 }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 10 }}>{result.ingredients}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* ADDITIVES */}
          <button
            style={collapseBtn}
            onClick={() => setShowAdditives(!showAdditives)}
          >
            {showAdditives ? "Hide Additives" : "Show Additives"}
          </button>

          {showAdditives && (
            <div style={{ marginBottom: 20 }}>
              <h3>Additives</h3>
              <table style={{ width: "100%", background: "var(--input-bg)", borderRadius: 8 }}>
                <tbody>
                  {result.additives.length === 0 ? (
                    <tr><td style={{ padding: 10 }}>No additives found</td></tr>
                  ) : (
                    result.additives.map((a, i) => (
                      <tr key={i}>
                        <td style={{ padding: 10 }}>{a}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* NUTRITION */}
          <button
            style={collapseBtn}
            onClick={() => setShowNutrition(!showNutrition)}
          >
            {showNutrition ? "Hide Nutrition" : "Show Nutrition"}
          </button>

          {showNutrition && (
            <div style={{ marginBottom: 20 }}>
              <h3>Nutrition Facts (per 100g)</h3>
              <table style={{ width: "100%", background: "var(--input-bg)", borderRadius: 8 }}>
                <tbody>
                  {Object.entries(result.nutrition).map(([key, value]) => (
                    <tr key={key}>
                      <td style={{ padding: 10 }}>{key}</td>
                      <td style={{ padding: 10 }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* BAR GRAPH */}
          <button
            style={collapseBtn}
            onClick={() => setShowBar(!showBar)}
          >
            {showBar ? "Hide Bar Graph" : "Show Bar Graph"}
          </button>

          {showBar && (
            <div style={{ marginBottom: 40 }}>
              <h3>Macronutrient Bar Graph</h3>
              <div style={{ width: "70%", margin: "auto" }}>
                <Bar data={getMacroData()} />
              </div>
            </div>
          )}

          {/* PIE CHART */}
          <button
            style={collapseBtn}
            onClick={() => setShowPie(!showPie)}
          >
            {showPie ? "Hide Pie Chart" : "Show Pie Chart"}
          </button>

          {showPie && (
            <div style={{ marginBottom: 40 }}>
              <h3>Nutrient Distribution Pie Chart</h3>
              <div style={{ width: "40%", margin: "auto" }}>
                <Pie data={getPieData()} />
              </div>
            </div>
          )}

          {/* HEALTH RISKS */}
          <div style={{ marginBottom: 20 }}>
            <h3>Health Risk Indicators</h3>
            {result.health_risks.map((risk, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  background: "rgba(255,0,0,0.1)",
                  border: "1px solid red",
                  borderRadius: 20,
                  color: "var(--danger)",
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
                {risk}
              </span>
            ))}
          </div>

          {/* SUMMARY */}
          <div
            style={{
              background: "rgba(0,184,148,0.1)",
              padding: 20,
              borderRadius: 12,
              border: "1px solid var(--success)",
              marginTop: 30,
            }}
          >
            <h3>AI Summary</h3>
            <p>{result.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}