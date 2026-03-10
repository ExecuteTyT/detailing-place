"use client";

import { useEffect } from "react";
import { reachGoal, goals } from "@/lib/analytics";

export default function PortfolioTracker() {
  useEffect(() => {
    reachGoal(goals.PORTFOLIO_VIEW);
  }, []);

  return null;
}
