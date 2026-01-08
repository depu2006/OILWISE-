import { useEffect, useState } from "react";
import "../styles/theme-toggle.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check saved preference or system preference
    const saved = localStorage.getItem("theme");
    const systemPrefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = saved || (systemPrefers ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.className = initialTheme;
  }, []);

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="theme-toggle-container">
      <span className={`theme-icon sun ${theme === "light" ? "active" : ""}`}>☀️</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={handleThemeChange}
          aria-label="Toggle dark mode"
        />
        <span className="slider"></span>
      </label>
      <span className={`theme-icon moon ${theme === "dark" ? "active" : ""}`}>🌙</span>
    </div>
  );
}

