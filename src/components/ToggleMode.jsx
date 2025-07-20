import React, { useEffect, useState } from "react";
import "./ToggleMode.css";

const ToggleMode = () => {
  const [dark, setDark] = useState(false);

  // Charger la préférence au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("theme") === "dark";
    setDark(saved);
    document.documentElement.setAttribute(
      "data-theme",
      saved ? "dark" : "light"
    );
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light"
    );
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="toggle-mode-button"
      aria-label="Toggle dark/light mode"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
};

export default ToggleMode;
