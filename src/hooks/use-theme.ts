"use client";

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (
    (localStorage.getItem("flexstudio-theme") as Theme) ||
    (localStorage.getItem("flexstudioo-theme") as Theme) ||
    "system"
  );
}

function getInitialResolved(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  // Read from DOM class that was set by the inline script
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return getSystemTheme();
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    setResolvedTheme(getInitialResolved());
    setMounted(true);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const stored =
        (localStorage.getItem("flexstudio-theme") as Theme | null) ||
        (localStorage.getItem("flexstudioo-theme") as Theme | null);
      if (!stored || stored === "system") {
        setResolvedTheme(getSystemTheme());
        applyTheme("system");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("flexstudio-theme", newTheme);
    applyTheme(newTheme);
    setResolvedTheme(newTheme === "system" ? getSystemTheme() : newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return { theme, resolvedTheme, setTheme, toggleTheme, mounted };
}
