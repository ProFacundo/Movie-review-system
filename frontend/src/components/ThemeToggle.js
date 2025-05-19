// ThemeToggle.js
import React, { useEffect, useState } from "react";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="ml-4 px-4 py-2 rounded border dark:border-white border-black"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

export default ThemeToggle;
