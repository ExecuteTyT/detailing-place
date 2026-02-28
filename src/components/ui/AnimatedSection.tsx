"use client";

import { type ReactNode, useSyncExternalStore, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

function useIsDesktop() {
  const subscribe = useCallback((cb: () => void) => {
    const mql = window.matchMedia("(min-width: 769px)");
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  }, []);

  const getSnapshot = () => window.matchMedia("(min-width: 769px)").matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps) {
  const prefersReduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  if (!isDesktop || prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
