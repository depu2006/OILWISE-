import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Papa from "papaparse";
import { supabase } from "../supabaseClient";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* ---------------- Gemini Setup ---------------- */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export default function AdvisoryPage() {
  const [step, setStep] = useState(0);
  const [anim, setAnim] = useState("");
  const [report, setReport] = useState(null);
  const [dietData, setDietData] = useState([]);

  const reportRef = useRef();

  /* ---------------- Form State ---------------- */
  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    weight: "",
    height: "",
    phone: "",
    daily_oil: "",
    diseases: "",
  });

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  /* ---------------- Load CSV ---------------- */
  useEffect(() => {
    Papa.parse("/src/data/diet_recommendations_dataset.csv", {
      download: true,
      header: true,
      complete: (results) => setDietData(results.data),
    });
  }, []);

  /* ---------------- Slides ---------------- */
  const slides = [
    { title: "What is Your Name?", field: "name", placeholder: "Enter your name" },
    { title: "Your Gender", field: "gender", type: "dropdown", placeholder: "Select Gender" },
    { title: "Your Age", field: "age", placeholder: "Age", type: "number" },
    { title: "Your Weight (kg)", field: "weight", placeholder: "Weight in kg", type: "number" },
    { title: "Your Height (cm)", field: "height", placeholder: "Height in cm", type: "number" },
    { title: "Phone Number", field: "phone", placeholder: "Phone Number" },
    { title: "Daily Oil Consumption", field: "daily_oil", placeholder: "e.g. 4 tsp / 15 ml / 2 tbsp" },
    { title: "Any Diseases?", field: "diseases", type: "textarea", placeholder: "Example: Diabetes, BP, Thyroid, None" },
  ];

  const nextSlide = () => {
    setAnim("slide-out");
    setTimeout(() => {
      setStep((prev) => prev + 1);
      setAnim("slide-in");
    }, 250);
    setTimeout(() => setAnim(""), 500);
  };

  /* ---------------- CSV Match ---------------- */
  const findMatchingProfile = () => {
    if (!dietData || dietData.length === 0) return null;

    const age = Number(form.age);
    const gender = form.gender?.toLowerCase();
    const disease = form.diseases?.toLowerCase();

    return (
      dietData.find(
        (row) =>
          row.Gender?.toLowerCase() === gender &&
          Math.abs(Number(row.Age) - age) <= 5 &&
          row.Disease_Type?.toLowerCase().includes(disease)
      ) || null
    );
  };

  /* ---------------- Oil Intake Analysis ---------------- */
  const analyzeOilIntake = (input) => {
    if (!input) return { level: "Unknown", message: "No oil intake given." };

    let ml = 0;
    const f = input.toLowerCase();

    if (f.includes("tsp")) ml = parseFloat(f) * 5;
    else if (f.includes("tbsp")) ml = parseFloat(f) * 15;
    else if (f.includes("ml")) ml = parseFloat(f);
    else ml = parseFloat(f) * 5;

    if (!ml) return { level: "Unknown", message: "Invalid oil input." };
    if (ml <= 10) return { level: "Low", message: "Healthy oil intake." };
    if (ml <= 25) return { level: "Moderate", message: "Moderate. Try to reduce slightly." };
    return { level: "High", message: "High intake. Reduce deep-fried foods immediately." };
  };

  /* ---------------- Rule-Based Oil Suggestion ---------------- */
  const getOilSuggestion = (diseaseRaw, bmi, age) => {
    const disease = diseaseRaw.toLowerCase();
    let oil = "Groundnut / Sunflower / Rice Bran Oil (4–5 tsp/day).";

    if (disease.includes("diabetes")) oil = "Mustard Oil / Rice Bran Oil (3–4 tsp/day).";
    if (disease.includes("bp") || disease.includes("hypertension"))
      oil = "Olive Oil / Rice Bran Oil (3 tsp/day).";
    if (Number(bmi) >= 25) oil = "Mustard Oil / Rice Bran Oil (3 tsp/day).";
    if (Number(age) >= 55) oil = "Rice Bran / Olive Oil (3 tsp/day).";

    return oil;
  };

  /* ---------------- Rule-Based Food ---------------- */
  const getFoodSuggestions = (diseaseRaw, bmi) => {
    const disease = diseaseRaw.toLowerCase();
    const arr = [];

    if (disease.includes("diabetes"))
      arr.push("Prefer millets/oats over white rice.", "High-fibre vegetables daily.", "Avoid sweets and fried snacks.");

    if (disease.includes("bp") || disease.includes("hypertension"))
      arr.push("Reduce salt.", "Eat beetroot, banana, spinach.");

    if (Number(bmi) >= 25)
      arr.push("Avoid fried snacks.", "Half plate vegetables.", "No sugary drinks.");

    if (!arr.length) arr.push("Balanced thali with vegetables, protein, whole grains.");
    return arr;
  };

  /* ---------------- Rule-Based Exercise ---------------- */
  const getExercisePlan = (d, bmi, age) => {
    const arr = [];

    if (age < 30) arr.push("Jog 30–40 min/day.", "Strength training 2–3 days/week.");
    else if (age <= 50) arr.push("Brisk walk 30 min/day.", "Yoga 10–15 min.");
    else arr.push("Slow walking 20 min/day.", "Light yoga.");

    if (bmi >= 30) arr.push("Avoid jumping exercises.", "Use low-impact workouts.");
    if (d.includes("diabetes")) arr.push("Walk 10 minutes after meals.");

    return arr;
  };

  /* ---------------- Gemini Refinement ---------------- */
  const refineWithGemini = async (base) => {
    if (!genAI) return base;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `
Refine this into structured health guidance. Return VALID JSON only:
${JSON.stringify(base)}
`;

      const out = await model.generateContent(prompt);
      const txt = out.response.text().replace(/```json|```/g, "").trim();
      return { ...base, ...JSON.parse(txt) };
    } catch (err) {
      console.log("Gemini Error → Using fallback");
      return base;
    }
  };

  /* ---------------- Generate Report ---------------- */
  const generateReport = async () => {
    const bmi = (
      form.weight /
      ((form.height / 100) * (form.height / 100))
    ).toFixed(1);

    const match = findMatchingProfile();
    const oil = getOilSuggestion(form.diseases, bmi, form.age);
    const oilInfo = analyzeOilIntake(form.daily_oil);
    const food = getFoodSuggestions(form.diseases, bmi);
    const exercise = getExercisePlan(form.diseases.toLowerCase(), bmi, form.age);

    const basePlan = {
      bmi,
      oil,
      oil_risk: oilInfo.level,
      oil_msg: oilInfo.message,
      food: food.join(" "),
      exercise: exercise.join(" "),
      lifestyle: match?.Physical_Activity_Level || "Maintain healthy lifestyle.",
      risks: match?.Dietary_Restrictions || "No significant risks.",
    };

    const finalPlan = await refineWithGemini(basePlan);

    setReport(finalPlan);
    saveReportToSupabase(finalPlan);
  };

  /* ---------------- Save to Supabase ---------------- */
  const saveReportToSupabase = async (generated) => {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) return;

      await supabase.from("health_reports").insert({
        user_id: user.id,
        ...form,
        ...generated,
      });
    } catch (e) {
      console.log("Supabase save failed");
    }
  };

  /* ---------------- PDF ---------------- */
  const downloadPDF = async () => {
    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4", true);
    const width = 210;
    const height = (canvas.height * 210) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save(`${form.name}_Health_Report.pdf`);
  };

  /* ---------------- Reset ---------------- */
  const resetAll = () => {
    setForm({
      name: "",
      gender: "",
      age: "",
      weight: "",
      height: "",
      phone: "",
      daily_oil: "",
      diseases: "",
    });
    setReport(null);
    setStep(0);
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={{ maxWidth: 550, margin: "auto", padding: 20 }}>
      {!report && (
        <div className={`slide-card ${anim}`} style={styles.slideCard}>
          <h2>{slides[step].title}</h2>

          {/* Input field types */}
          {slides[step].type === "textarea" ? (
            <textarea
              placeholder={slides[step].placeholder}
              value={form[slides[step].field]}
              onChange={(e) => update(slides[step].field, e.target.value)}
              style={styles.textarea}
            />
          ) : slides[step].type === "dropdown" ? (
            <select
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
              style={styles.input}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <input
              type={slides[step].type || "text"}
              placeholder={slides[step].placeholder}
              value={form[slides[step].field]}
              onChange={(e) => update(slides[step].field, e.target.value)}
              style={styles.input}
            />
          )}

          {step < slides.length - 1 ? (
            <button style={styles.button} onClick={nextSlide}>
              Next →
            </button>
          ) : (
            <button style={styles.button} onClick={generateReport}>
              Generate Report
            </button>
          )}
        </div>
      )}

      {report && (
        <div style={styles.reportWrapper} ref={reportRef}>
          <div style={styles.header}>Health Report Card</div>

          <div style={{ padding: 20 }}>
            <h2>Personal Details</h2>

            <p><b>Name:</b> {form.name}</p>
            <p><b>Gender:</b> {form.gender}</p>
            <p><b>Age:</b> {form.age}</p>
            <p><b>Height:</b> {form.height} cm</p>
            <p><b>Weight:</b> {form.weight} kg</p>
            <p><b>Daily Oil:</b> {form.daily_oil}</p>
            <p><b>BMI:</b> {report.bmi}</p>

            <table style={styles.table}>
              <tbody>
                <tr><td style={styles.td}>Recommended Oil</td><td style={styles.td}>{report.oil}</td></tr>
                <tr><td style={styles.td}>Oil Intake Level</td><td style={styles.td}>{report.oil_risk}</td></tr>
                <tr><td style={styles.td}>Oil Advice</td><td style={styles.td}>{report.oil_msg}</td></tr>
                <tr><td style={styles.td}>Food Suggestions</td><td style={styles.td}>{report.food}</td></tr>
                <tr><td style={styles.td}>Exercise Plan</td><td style={styles.td}>{report.exercise}</td></tr>
                <tr><td style={styles.td}>Lifestyle Tips</td><td style={styles.td}>{report.lifestyle}</td></tr>
                <tr><td style={styles.td}>Warnings</td><td style={styles.td}>{report.risks}</td></tr>
              </tbody>
            </table>

            <button style={styles.button} onClick={downloadPDF}>Download PDF</button>
            <button style={{ ...styles.button, marginTop: 10 }} onClick={resetAll}>
              Start New Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- CSS ---------------- */
const styles = {
  input: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: 16,
  },
  textarea: {
    width: "100%",
    height: 90,
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 12,
    background: "var(--btn-primary)",
    color: "#0b0f19",
    border: "none",
    fontSize: 16,
    borderRadius: 10,
    marginTop: 20,
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  slideCard: {
    background: "var(--panel)",
    padding: 24,
    borderRadius: 18,
    boxShadow: "var(--shadow)",
    border: "1px solid var(--border)",
    transition: "0.4s",
  },
  reportWrapper: {
    background: "var(--panel)",
    borderRadius: 12,
    boxShadow: "var(--shadow)",
    border: "1px solid var(--border)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(90deg, var(--brand), var(--brand-accent))",
    color: "#0b0f19",
    padding: 25,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 15,
  },
  td: {
    padding: 12,
    border: "1px solid var(--border)",
    verticalAlign: "top",
    color: "var(--text)"
  },
};
