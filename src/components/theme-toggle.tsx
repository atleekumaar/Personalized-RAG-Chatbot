import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("folio_theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("folio_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("folio_theme", "light");
    }
  };

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 rounded-lg text-muted"
        aria-label="Toggle theme"
      >
        <Moon className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="size-8 rounded-lg text-muted hover:text-fg hover:bg-raised transition-colors"
      title={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="size-4 text-warn" /> : <Moon className="size-4 text-primary" />}
    </Button>
  );
}
