import { useRef, useState } from "react";
import { Box, ButtonBase } from "@mui/material";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Figure from "./Figure";
import { usePostColors } from "./usePostColors";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const VALUE_COL = 78;

interface Arm {
  id: string;
  what: string;
  minutes: number;
  cost: number;
  meanRam: number;
  peakRam: number;
}

const ARMS: Arm[] = [
  { id: "A", what: "v1: 3 worktrees + merge-all", minutes: 53.8, cost: 25.98, meanRam: 3.28, peakRam: 6.39 },
  { id: "A8", what: "v1: 8 worktrees + merge-all", minutes: 53.6, cost: 23.68, meanRam: 2.45, peakRam: 8.26 },
  { id: "S", what: "prototype: 8 processes, one checkout", minutes: 26.7, cost: 22.55, meanRam: 3.81, peakRam: 7.37 },
  { id: "P", what: "--shared-tree, 8 processes", minutes: 31.3, cost: 21.73, meanRam: 3.38, peakRam: 7.15 },
  { id: "Q", what: "--runtime acp: 1 process, 8 sessions", minutes: 17.2, cost: 17.47, meanRam: 1.22, peakRam: 3.8 },
  { id: "R", what: "pact run: planner splits the task", minutes: 16.3, cost: 14.95, meanRam: 0.96, peakRam: 4.27 },
  { id: "R2", what: "pact run: effort-balanced plans, no restating", minutes: 12.5, cost: 12.79, meanRam: 1.13, peakRam: 3.17 },
];

const BASELINE: Arm = {
  id: "B",
  what: "Copilot CLI's own sub-agents",
  minutes: 15.8,
  cost: 16.2,
  meanRam: 2.22,
  peakRam: 4.29,
};

const METRICS = {
  minutes: { label: "wall clock", format: (v: number) => `${v.toFixed(1)} min`, max: 56 },
  cost: { label: "cost", format: (v: number) => `$${v.toFixed(2)}`, max: 27 },
  peakRam: { label: "peak RAM", format: (v: number) => `${v.toFixed(2)} GB`, max: 8.6 },
  meanRam: { label: "mean RAM", format: (v: number) => `${v.toFixed(2)} GB`, max: 4 },
} as const;

type MetricKey = keyof typeof METRICS;

const BenchmarkRace = () => {
  const c = usePostColors();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [metric, setMetric] = useState<MetricKey>("minutes");
  const [runId, setRunId] = useState(0);
  const show = inView || reduce;
  const spec = METRICS[metric];
  const baselinePct = (BASELINE[metric] / spec.max) * 100;

  const barColor = (arm: Arm) => {
    if (arm[metric] < BASELINE[metric]) return c.green;
    if (arm.id.startsWith("A")) return c.red;
    return c.accent;
  };

  return (
    <Figure
      label="Fig 4"
      title="Same task, seven pact architectures, one baseline"
      onReplay={reduce ? undefined : () => setRunId((r) => r + 1)}
      caption={
        <>
          39-file test-writing task on a Next.js app, claude-opus-5 for every agent, same base commit, a 12-core 14 GB Windows laptop. Each bar is a single run. The dashed line is Copilot CLI fanning out to its own in-process sub-agents on the same task. Green means better than that line. Full data in{" "}
          <a href="https://github.com/zekariasasaminew/pact/issues/308" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
            issue #308
          </a>
          .
        </>
      }
    >
      <Box ref={ref}>
        <Box role="tablist" aria-label="Benchmark metric" sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2.5 }}>
          {(Object.keys(METRICS) as MetricKey[]).map((key) => (
            <ButtonBase
              key={key}
              role="tab"
              aria-selected={metric === key}
              onClick={() => setMetric(key)}
              sx={{
                fontFamily: MONO,
                fontSize: "0.75rem",
                px: 1.25,
                py: 0.5,
                borderRadius: "6px",
                border: `1px solid ${metric === key ? c.accent : c.line}`,
                color: metric === key ? c.accent : c.muted,
              }}
            >
              {METRICS[key].label}
            </ButtonBase>
          ))}
        </Box>

        <Box sx={{ position: "relative" }}>
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: {
                xs: `calc(64px + (100% - 64px - ${VALUE_COL}px) * ${baselinePct / 100})`,
                sm: `calc(84px + (100% - 84px - ${VALUE_COL}px) * ${baselinePct / 100})`,
              },
              borderLeft: `2px dashed ${c.blue}`,
              transition: "left 0.5s ease",
              opacity: 0.7,
            }}
          />
          {[...ARMS, BASELINE].map((arm, i) => {
            const pct = (arm[metric] / spec.max) * 100;
            const isBaseline = arm === BASELINE;
            return (
              <Box key={arm.id} sx={{ display: "flex", alignItems: "center", mb: 1.25, mt: isBaseline ? 2 : 0, position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    width: { xs: 64, sm: 84 },
                    flexShrink: 0,
                    fontFamily: MONO,
                    fontSize: "0.78rem",
                    color: isBaseline ? c.blue : c.text,
                    fontWeight: 600,
                  }}
                >
                  {isBaseline ? "Copilot" : `arm ${arm.id}`}
                </Box>
                <Box sx={{ flex: 1, position: "relative" }}>
                  <Box sx={{ fontSize: "0.72rem", color: c.muted, mb: 0.4, lineHeight: 1.3 }}>{arm.what}</Box>
                  <Box sx={{ position: "relative", mr: `${VALUE_COL}px`, height: 14 }}>
                    <Box
                      component={motion.div}
                      key={`${runId}-${metric}`}
                      initial={{ width: reduce ? `${pct}%` : 0 }}
                      animate={{ width: show ? `${pct}%` : 0 }}
                      transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : i * 0.12, ease: "easeOut" }}
                      sx={{
                        height: 14,
                        borderRadius: "4px",
                        background: isBaseline ? c.blue : barColor(arm),
                        opacity: isBaseline ? 0.85 : 1,
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: `calc(${pct}% + 8px)`,
                        fontFamily: MONO,
                        fontSize: "0.75rem",
                        color: c.text,
                        whiteSpace: "nowrap",
                        opacity: show ? 1 : 0,
                        transition: "left 0.5s ease, opacity 0.4s ease",
                      }}
                    >
                      {spec.format(arm[metric])}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Figure>
  );
};

export default BenchmarkRace;
