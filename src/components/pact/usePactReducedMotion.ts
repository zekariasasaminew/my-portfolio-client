import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

// Shared across every figure so one explicit replay opts the whole post into motion.
let forced = false;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const forceMotion = () => {
  if (forced) return;
  forced = true;
  listeners.forEach((listener) => listener());
};

export const usePactReducedMotion = () => {
  const prefersReduced = useReducedMotion();
  const isForced = useSyncExternalStore(subscribe, () => forced, () => false);
  return !!prefersReduced && !isForced;
};
