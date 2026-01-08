import Papa from "papaparse";
import { useEffect, useState } from "react";

export default function MidDayMealPage() {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    Papa.parse("/RS_Session_256_AS_299_1.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setCsvData(results.data);
      }
    });
  }, []);

  return (

    <div className="panel" style={{ padding: "24px" }}>
         <h2 style={{ marginBottom: "12px", color: "var(--brand)" }}>
         About the Mid-Day Meal Scheme
         <div style={{ textAlign: "center", marginBottom: "20px" }}></div>
        <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqN9iJ8fbAi_QZuDuTIlr3_eDq85j7mTx2Vw&s"
        style={{
        width: "80%",
        maxWidth: "450px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
         }}
         
     />
  </h2>
  <p style={{ marginBottom: "12px", fontSize: "15px", lineHeight: "1.6" , textAlign :"justify" }}>
    The Mid-Day Meal Scheme, now called PM POSHAN (Pradhan Mantri Poshan Shakti Nirman), is India's flagship program providing free, hot, nutritious cooked meals to children in government and government-aided primary and upper primary schools to boost nutrition, attendance, and concentration. Launched nationally in 1995 as the National Programme of Nutritional Support to Primary Education, it's a Centrally Sponsored Scheme that aims to combat hunger and malnutrition, ensuring children get essential nutrients while supporting education, covering millions of students across India with significant central and state funding. 
  </p>
   <h2 style={{ textAlign: "center", marginBottom: "20px", color: "var(--brand)" }}>
    Related Videos
  </h2>

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px"
  }}>
    {/* Video 1 */}
    <div
      onClick={() => window.open("https://www.youtube.com/watch?v=cw3uXxIjaIw", "_blank")}
      style={{
        cursor: "pointer",
        padding: "12px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.08)",
        textAlign: "center",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
      
      <img 
        src="https://i.ytimg.com/vi/cw3uXxIjaIw/maxresdefault.jpg"
        alt="MDM Overview"
        style={{ width: "100%", borderRadius: "12px" }}
      />
      <p style={{ marginTop: "10px" }}>Mid Day Meal Scheme – Reduction of oil content</p>
    </div>


    {/* Video 2 */}
     <div
      onClick={() => window.open("https://www.youtube.com/watch?v=ugKkddhjaRU", "_blank")}
      style={{
        cursor: "pointer",
        padding: "12px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.08)",
        textAlign: "center",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
      
      <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiW8p8McbVUBTcLVM_yeihwbDPpzG4esn87w&s"
        alt="Nutrition Benefits"
        style={{ width: "100%", borderRadius: "12px" }}
      />
      <p style={{ marginTop: "10px" }}>Nutritional Benefits for Students</p>
    </div>

    {/* Video 3 */}
    <div
      onClick={() => window.open("", "_blank")}
      style={{
        cursor: "pointer",
        padding: "12px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.08)",
        textAlign: "center",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
      
      <img 
        src="https://i.ytimg.com/vi/pU4nkP3LAM0/maxresdefault.jpg"
        alt="Impact of MDM"
        style={{ width: "100%", borderRadius: "12px" }}
      />
      <p style={{ marginTop: "10px" }}>Impact of Mid Day Meal Scheme with less consumption of oil</p>
    </div>
    
  </div>

  

  <h3 style={{ marginTop: "16px", marginBottom: "8px" ,color: "var(--brand)"}}>Objectives</h3>
  <ul style={{ textAlign: "left", margin: "0 auto", maxWidth: "600px", lineHeight: "1.7" }}>
    <li>Improve nutrition among school children</li>
    <li>Increase school enrollment and reduce dropout rates</li>
    <li>Encourage regular attendance and participation</li>
    <li>Support overall physical and mental development</li>
    <li>Reduce classroom hunger to enhance learning outcomes</li>
  </ul>
  <h3 style={{ marginTop: "16px", marginBottom: "8px" ,color: "var(--brand)"}}>Who Benefits?</h3>
  <p style={{ fontSize: "15px", lineHeight: "1.6" , textAlign:'justify' }}>
    Children from Class 1 to 8 studying in government and government-aided schools, 
    as well as special training centers and recognized Madrasas.
    The Mid-Day Meal Scheme benefits children by improving their nutrition and cognitive development, increasing school enrollment and attendance, and reducing dropout rates. It also promotes social equality by providing meals to children from all backgrounds, alleviates financial burdens on families, and creates employment opportunities for local communities, particularly women. 
  </p>
   <h2 style={{ textAlign: "center", marginBottom: "18px", color: "var(--brand)" }}>
    Measures to Reduce Oil Consumption in Mid-Day Meals
  </h2>

  <p style={{ textAlign: "center", color: "#cbd5e1", marginBottom: "18px", maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
    Practical and low-cost interventions that schools and meal program managers can adopt to reduce excess oil while keeping meals tasty and nutritious.
  </p>

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px"
  }}>
    {/* Card 1 */}
    <div style={{
      background: "rgba(255,255,255,0.03)",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      minHeight: 120
    }}>
      <h4 style={{ marginTop: 0, marginBottom: 8 }}>Use Measured Portions</h4>
      <p style={{ margin: 0, color: "#cbd5e1", fontSize: 14 }}>
        Train cooks to use measuring spoons and ladles (e.g. 1 tsp oil per serving or fixed ml per batch) to avoid free-pouring.
      </p>
    </div>

    {/* Card 2 */}
    <div style={{
      background: "rgba(255,255,255,0.03)",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      minHeight: 120
    }}>
      <h4 style={{ marginTop: 0, marginBottom: 8 }}>Adopt Healthier Cooking Methods</h4>
      <p style={{ margin: 0, color: "#cbd5e1", fontSize: 14 }}>
        Use steaming, boiling, baking, and shallow sautéing instead of deep frying to retain taste with far less oil.
      </p>
    </div>

    {/* Card 3 */}
    <div style={{
      background: "rgba(255,255,255,0.03)",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      minHeight: 120
    }}>
      <h4 style={{ marginTop: 0, marginBottom: 8 }}>Use Non-Stick Cookware</h4>
      <p style={{ margin: 0, color: "#cbd5e1", fontSize: 14 }}>
        Non-stick pans require very little oil for cooking; investing in a few reduces overall usage substantially.
      </p>
    </div>

    {/* Card 4 */}
    <div style={{
      background: "rgba(255,255,255,0.03)",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      minHeight: 120
    }}>
      <h4 style={{ marginTop: 0, marginBottom: 8 }}>Drain & Dab Fried Items</h4>
      <p style={{ margin: 0, color: "#cbd5e1", fontSize: 14 }}>
        If frying is used, let items drain on slotted spoons and dab with paper/cloth to remove surface oil before serving.
      </p>
    </div>

    {/* Card 5 */}
    <div style={{
      background: "rgba(255,255,255,0.03)",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      minHeight: 120
    }}>
      <h4 style={{ marginTop: 0, marginBottom: 8 }}>Switch to Healthier Oils</h4>
      <p style={{ margin: 0, color: "#cbd5e1", fontSize: 14 }}>
        Where oil must be used, prefer oils with better lipid profiles (e.g. locally available healthier options) and use sparingly.
      </p>
    </div>

    {/* Card 6 */}
    <div style={{
      background: "rgba(255,255,255,0.03)",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      minHeight: 120
    }}>
      <h4 style={{ marginTop: 0, marginBottom: 8 }}>Plan Menus Around Low-Oil Recipes</h4>
      <p style={{ margin: 0, color: "#cbd5e1", fontSize: 14 }}>
        Include more steamed vegetables, lentil stews, and rice dishes that use little or no oil; rotate menus to keep variety.
      </p>
    </div>
     {/* Card 7 */}
    <div style={{
      background: "rgba(255,255,255,0.03)",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      minHeight: 120
    }}>
      <h4 style={{ marginTop: 0, marginBottom: 8 }}>Centralized Bulk Cooking</h4>
      <p style={{ margin: 0, color: "#cbd5e1", fontSize: 14 }}>
        Preparing meals in centralized kitchens lowers repeated oil usage and promotes
        standardized low-oil recipe practices.
      </p>
    </div>

    {/* Card 8 */}
    <div style={{
      background: "rgba(255,255,255,0.03)",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      minHeight: 120
    }}>
      <h4 style={{ marginTop: 0, marginBottom: 8 }}>Training & Monitoring</h4>
      <p style={{ margin: 0, color: "#cbd5e1", fontSize: 14 }}>
        Conduct regular training for cooks on low-oil methods and track oil usage logs
        to prevent excess consumption and improve consistency.
      </p>
  </div>

 
    </div>
</div>
  );
}
