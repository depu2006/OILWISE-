// backend.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Generate AI-style health summary
function generateSummary(product) {
  const name = product.product_name || "this product";

  return `Based on available nutrition and ingredient data, ${name} may pose risks such as high sugar, fat, or salt depending on consumption level. Consider limiting intake if you have lifestyle diseases.`;
}

// Risk analysis
function riskAnalysis(p) {
  const nutr = p.nutriments || {};
  const risks = [];

  const fat = nutr.fat_100g || 0;
  const sat = nutr["saturated-fat_100g"] || 0;
  const sugar = nutr.sugars_100g || 0;
  const salt = nutr.salt_100g || 0;
  const kcal = nutr["energy-kcal_100g"] || 0;

  if (p.nova_group === 4) risks.push("Ultra-processed food (NOVA 4)");
  if (fat > 17.5) risks.push(`High fat: ${fat}g`);
  if (sat > 5) risks.push(`High saturated fat: ${sat}g`);
  if (sugar > 22.5) risks.push(`High sugar: ${sugar}g`);
  if (salt > 1.5) risks.push(`High salt: ${salt}g`);
  if (kcal > 400) risks.push(`High calories: ${kcal} kcal`);

  return risks;
}

// MAIN ENDPOINT
app.post("/audit", async (req, res) => {
  try {
    const { barcode } = req.body;

    if (!barcode) return res.json({ error: "Barcode missing" });

    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    const apiRes = await axios.get(url);
    const product = apiRes.data.product;

    if (!product) {
      return res.json({ error: "Product not found" });
    }

    const result = {
      identity: {
        name: product.product_name || "Unknown",
        brand: product.brands || "Unknown",
        category: product.categories_old || "Unknown",
      },

      ingredients: product.ingredients_text || "Unavailable",

      additives: product.additives_tags || [],

      nutrition: product.nutriments || {},

      health_risks: riskAnalysis(product),

      summary: generateSummary(product),
    };

    return res.json(result);
  } catch (err) {
    console.log("Server error:", err);
    return res.json({ error: "Server crashed" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
