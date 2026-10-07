import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { motion, useInView } from "framer-motion";
import { usePactReducedMotion } from "./usePactReducedMotion";
import Figure from "./Figure";
import { usePostColors } from "./usePostColors";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const WORKSPACES = [
  { x: 110, agent: "claude", branch: "pact/signup-validation", diff: 310, mergeStep: 5 },
  { x: 320, agent: "copilot", branch: "pact/orders-endpoint", diff: 120, mergeStep: 4 },
  { x: 530, agent: "codex", branch: "pact/prefs-endpoint", diff: 40, mergeStep: 3 },
];

const STEPS = [
  "One repository, one task per agent.",
  "git worktree add: every agent gets its own checkout and branch. node_modules is linked, not reinstalled.",
  "Agents work in isolation. Each one can claim files through pact-coord so overlaps are visible.",
  "merge-all starts with the smallest diff (+40) and lands it on a fresh integration branch.",
  "Next smallest (+120). package.json dependency tables merge as data, not as text.",
  "The largest diff conflicts. It is skipped, not aborted, and persisted for pact resolve.",
];

const STEP_MS = 1900;
const MAX_DIFF = 310;

const WorktreeDiagram = () => {
  const c = usePostColors();
  const reduce = usePactReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const [step, setStep] = useState(reduce ? STEPS.length - 1 : 0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const timer = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, STEP_MS);
    return () => clearInterval(timer);
  }, [inView, reduce, runId]);

  const replay = () => {
    setStep(0);
    setRunId((r) => r + 1);
  };

  const mergedOrder = WORKSPACES.filter((w) => step >= w.mergeStep).sort(
    (a, b) => a.mergeStep - b.mergeStep
  );

  return (
    <Figure
      label="Fig 2"
      title="v1: a git worktree per agent, merge-all at the end"
      onReplay={replay}
      minContentWidth={560}
      caption="Illustrative run with three agents. The merge order, the skip-don't-abort behaviour and the dependency-table merge are how merge-all works; the diff sizes are made up for the picture."
    >
      <Box ref={ref}>
        <svg viewBox="0 0 640 430" width="100%" role="img" aria-label="Diagram of pact's first architecture: three agents in separate git worktrees, merged one at a time onto an integration branch, smallest diff first, with the conflicting one skipped." style={{ display: "block" }}>
          <rect x={235} y={14} width={170} height={40} rx={20} fill={c.panelStrong} stroke={c.accent} strokeWidth={1.5} />
          <text x={320} y={39} textAnchor="middle" fontSize={15} fontWeight={600} fill={c.text} fontFamily={MONO}>
            repo (main)
          </text>

          {WORKSPACES.map((w) => {
            const visible = step >= 1;
            const working = step >= 2;
            const merged = step >= w.mergeStep;
            const conflicted = merged && w.mergeStep === 5;
            const stroke = conflicted ? c.red : merged ? c.green : c.blue;
            const barWidth = (w.diff / MAX_DIFF) * 130;
            return (
              <motion.g
                key={w.agent}
                initial={false}
                animate={{ opacity: visible ? 1 : 0.15 }}
                transition={{ duration: 0.5 }}
              >
                <path d={`M320,54 C320,80 ${w.x},80 ${w.x},104`} fill="none" stroke={c.line} strokeWidth={1.5} />
                <rect x={w.x - 95} y={104} width={190} height={150} rx={10} fill={c.panelStrong} stroke={stroke} strokeWidth={1.6} />
                <text x={w.x - 82} y={128} fontSize={14} fontWeight={600} fill={c.text} fontFamily={MONO}>
                  {w.agent}
                </text>
                <text x={w.x - 82} y={148} fontSize={11} fill={c.muted} fontFamily={MONO}>
                  {w.branch}
                </text>
                <text x={w.x - 82} y={176} fontSize={11.5} fill={c.muted} fontFamily={MONO}>
                  node_modules → linked
                </text>
                <text x={w.x - 82} y={204} fontSize={11.5} fill={c.text} fontFamily={MONO}>
                  diff
                </text>
                <rect x={w.x - 46} y={195} width={130} height={10} rx={5} fill={c.line} />
                <motion.rect
                  x={w.x - 46}
                  y={195}
                  height={10}
                  rx={5}
                  fill={stroke}
                  initial={false}
                  animate={{ width: working ? barWidth : 0 }}
                  transition={{ duration: reduce ? 0 : 1.2, ease: "easeOut" }}
                />
                <motion.text
                  x={w.x - 82}
                  y={236}
                  fontSize={12}
                  fontFamily={MONO}
                  fill={conflicted ? c.red : merged ? c.green : c.muted}
                  initial={false}
                  animate={{ opacity: working ? 1 : 0 }}
                >
                  {conflicted ? "conflict → pact resolve" : merged ? `+${w.diff} merged` : `+${w.diff} lines`}
                </motion.text>
              </motion.g>
            );
          })}

          <rect x={40} y={330} width={560} height={64} rx={10} fill="none" stroke={c.line} strokeDasharray="6 5" />
          <text x={56} y={322} fontSize={12} fill={c.accent} fontFamily={MONO}>
            pact/merged-&lt;id&gt; (fresh integration branch, your checkout untouched)
          </text>
          <line x1={70} y1={362} x2={570} y2={362} stroke={c.line} strokeWidth={2} />
          <circle cx={70} cy={362} r={7} fill={c.panelStrong} stroke={c.muted} strokeWidth={2} />
          <text x={70} y={386} textAnchor="middle" fontSize={10.5} fill={c.muted} fontFamily={MONO}>
            base
          </text>

          {mergedOrder.map((w, i) => {
            const conflicted = w.mergeStep === 5;
            const cx = 190 + i * 150;
            return (
              <motion.g
                key={`${runId}-${w.agent}`}
                initial={reduce ? false : { opacity: 0, y: -140, x: w.x - cx }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              >
                <circle
                  cx={cx}
                  cy={362}
                  r={9}
                  fill={conflicted ? c.panelStrong : c.green}
                  stroke={conflicted ? c.red : c.green}
                  strokeWidth={2}
                  strokeDasharray={conflicted ? "3 3" : undefined}
                />
                <text x={cx} y={386} textAnchor="middle" fontSize={10.5} fill={conflicted ? c.red : c.text} fontFamily={MONO}>
                  {conflicted ? "skipped" : `${w.agent} +${w.diff}`}
                </text>
              </motion.g>
            );
          })}
        </svg>

        <Box
          aria-live="polite"
          sx={{
            mt: 1,
            minHeight: "3.2em",
            fontFamily: MONO,
            fontSize: "0.82rem",
            color: c.text,
            display: "flex",
            gap: 1.5,
            alignItems: "flex-start",
          }}
        >
          <Box component="span" sx={{ color: c.accent, flexShrink: 0 }}>
            {step + 1}/{STEPS.length}
          </Box>
          <span>{STEPS[step]}</span>
        </Box>
      </Box>
    </Figure>
  );
};

export default WorktreeDiagram;
