import { useRef } from "react";
import { Box } from "@mui/material";
import { motion, useInView } from "framer-motion";
import { usePactReducedMotion } from "./usePactReducedMotion";
import Figure from "./Figure";
import { usePostColors } from "./usePostColors";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const RUNS = [
  { lanes: 8, wall: 12.5, agentMinutes: 53.7, cost: 12.79 },
  { lanes: 12, wall: 12.4, agentMinutes: 84.2, cost: 15.2 },
];

const SHELL_SHARE = 56;

const LaneScaling = () => {
  const c = usePostColors();
  const reduce = usePactReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const show = inView || reduce;
  const grow = (pct: number, delay: number) => ({
    initial: { width: reduce ? `${pct}%` : 0 },
    animate: { width: show ? `${pct}%` : 0 },
    transition: { duration: reduce ? 0 : 1, delay: reduce ? 0 : delay, ease: "easeOut" as const },
  });

  return (
    <Figure
      label="Fig 7"
      title="More lanes, same wall clock"
      caption="Left: arms R2 and R3, same task, 8 lanes against 12. Right: where a lane's time went, from the agent sessions' own event logs. Twelve lanes each running a whole-project type-check on twelve cores made a scoped eslint on three files take 80 to 150 s."
    >
      <Box ref={ref} sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", sm: "row" } }}>
        <Box sx={{ flex: 1 }}>
          {RUNS.map((run, i) => (
            <Box key={run.lanes} sx={{ mb: 2 }}>
              <Box sx={{ fontFamily: MONO, fontSize: "0.8rem", fontWeight: 600, color: c.text, mb: 0.75 }}>{run.lanes} lanes</Box>
              {(
                [
                  ["wall clock", run.wall, 14, `${run.wall} min`, c.blue],
                  ["agent-minutes", run.agentMinutes, 90, `${run.agentMinutes}`, c.accent],
                  ["cost", run.cost, 16, `$${run.cost.toFixed(2)}`, c.purple],
                ] as const
              ).map(([label, value, max, text, color], j) => (
                <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Box sx={{ width: 96, flexShrink: 0, fontFamily: MONO, fontSize: "0.7rem", color: c.muted }}>{label}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Box component={motion.div} {...grow((value / max) * 100, i * 0.3 + j * 0.1)} sx={{ height: 10, borderRadius: "3px", background: color }} />
                  </Box>
                  <Box sx={{ width: 64, fontFamily: MONO, fontSize: "0.72rem", color: c.text, textAlign: "right" }}>{text}</Box>
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ fontFamily: MONO, fontSize: "0.8rem", fontWeight: 600, color: c.text, mb: 0.75 }}>one lane's time</Box>
          <Box sx={{ display: "flex", height: 34, borderRadius: "6px", overflow: "hidden", border: `1px solid ${c.line}` }}>
            <Box component={motion.div} {...grow(SHELL_SHARE, 0.4)} sx={{ background: c.red, display: "flex", alignItems: "center", pl: 1, fontFamily: MONO, fontSize: "0.72rem", color: "#fff", whiteSpace: "nowrap", overflow: "hidden" }}>
              {SHELL_SHARE}% shell
            </Box>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", pr: 1, fontFamily: MONO, fontSize: "0.72rem", color: c.muted }}>
              {100 - SHELL_SHARE}% the rest
            </Box>
          </Box>
          <Box component="ul" sx={{ pl: 2.5, mt: 1.5, mb: 0, fontSize: "0.82rem", color: c.muted, lineHeight: 1.6 }}>
            <li>shell: whole-project type-checks, lints and test runs, because the task said they must stay clean</li>
            <li>the rest: about three minutes of model generation, plus reading and editing files</li>
          </Box>
        </Box>
      </Box>
    </Figure>
  );
};

export default LaneScaling;
