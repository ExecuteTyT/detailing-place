"use client";

import { useEffect, useRef } from "react";
import { reachGoal, goals } from "@/lib/analytics";

export default function ScrollTracker() {
  const fired50 = useRef(false);
  const fired100 = useRef(false);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = scrollTop / docHeight;

      if (!fired50.current && percent >= 0.5) {
        fired50.current = true;
        reachGoal(goals.PAGE_SCROLL_50);
      }

      if (!fired100.current && percent >= 0.95) {
        fired100.current = true;
        reachGoal(goals.PAGE_SCROLL_100);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
