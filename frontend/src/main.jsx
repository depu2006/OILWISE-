// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";   // 👈 important: .jsx
import "./index.css";
import "leaflet/dist/leaflet.css"; // FIX: Ensure Leaflet CSS is loaded globally

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
