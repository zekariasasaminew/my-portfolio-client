import { useRef, useState } from "react";
import { Box } from "@mui/material";
import { motion, useInView } from "framer-motion";
import { forceMotion, usePactReducedMotion } from "./usePactReducedMotion";
import Figure from "./Figure";
import { usePostColors } from "./usePostColors";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const LANE_X = { a: 90, coord: 320, b: 550 };

type Tone = "call" | "ok" | "warn";

interface Message {
  from: keyof typeof LANE_X;
  to: keyof typeof LANE_X;
  label: string;
  tone: Tone;
}

const MESSAGES: Message[] = [
  { from: "a", to: "coord", label: 'claim_files(["src/auth/*.ts"])', tone: "call" },
  { from: "coord", to: "a", label: "accepted · has_conflicts: false", tone: "ok" },
  { from: "b", to: "coord", label: 'claim_files(["src/auth/session.ts"])', tone: "call" },
  { from: "coord", to: "b", label: "accepted · has_conflicts: true (agent-a)", tone: "warn" },
  { from: "b", to: "coord", label: 'send_message(agent-a, "need session.ts")', tone: "call" },
  { from: "a", to: "coord", label: "check_messages()", tone: "call" },
  { from: "coord", to: "a", label: '1 new: agent-b "need session.ts"', tone: "ok" },
  { from: "a", to: "coord", label: 'release_files(["src/auth/*.ts"])', tone: "call" },
  { from: "b", to: "coord", label: 'claim_files(["src/auth/session.ts"])', tone: "call" },
  { from: "coord", to: "b", label: "accepted · has_conflicts: false", tone: "ok" },
];

const ROW = 38;
const TOP = 74;

const LeaseSequence = () => {
  const c = usePostColors();
  const reduce = usePactReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [runId, setRunId] = useState(0);
  const play = inView || reduce;

  const toneColor = (tone: Tone) => (tone === "ok" ? c.green : tone === "warn" ? c.red : c.text);
  const height = TOP + MESSAGES.length * ROW + 20;

  return (
    <Figure
      label="Fig 3"
      title="Advisory leases through pact-coord (MCP)"
      onReplay={() => {
        forceMotion();
        setRunId((r) => r + 1);
      }}
      minContentWidth={560}
      caption="Seven MCP tools are mounted into every agent. A claim is always recorded; the conflict list is a signal, not a lock. Leases live in one SQLite database in WAL mode, with a per-agent read cursor so an agent never gets its own broadcasts echoed back."
    >
      <Box ref={ref}>
        <svg key={runId} viewBox={`0 0 640 ${height}`} width="100%" role="img" aria-label="Sequence diagram: agent A claims src/auth, agent B's overlapping claim is accepted but flagged as a conflict, B messages A, A releases, and B claims again cleanly." style={{ display: "block" }}>
          <defs>
            <marker id="ls-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={c.muted} />
            </marker>
          </defs>
          {(
            [
              ["a", "agent-a", c.blue],
              ["coord", "pact-coord", c.amber],
              ["b", "agent-b", c.purple],
            ] as const
          ).map(([key, name, color]) => (
            <g key={key}>
              <rect x={LANE_X[key] - 62} y={14} width={124} height={34} rx={8} fill={c.panelStrong} stroke={color} strokeWidth={1.5} />
              <text x={LANE_X[key]} y={36} textAnchor="middle" fontSize={14} fontWeight={600} fill={c.text} fontFamily={MONO}>
                {name}
              </text>
              <line x1={LANE_X[key]} y1={48} x2={LANE_X[key]} y2={height - 8} stroke={c.line} strokeDasharray="4 4" />
            </g>
          ))}

          {MESSAGES.map((m, i) => {
            const y = TOP + i * ROW;
            const x1 = LANE_X[m.from];
            const x2 = LANE_X[m.to];
            const dir = x2 > x1 ? 1 : -1;
            const delay = reduce ? 0 : 0.3 + i * 0.55;
            const color = toneColor(m.tone);
            const labelX = (x1 + x2) / 2;
            return (
              <g key={i}>
                <motion.line
                  x1={x1}
                  y1={y + 12}
                  x2={x2 - dir * 4}
                  y2={y + 12}
                  stroke={m.tone === "call" ? c.muted : color}
                  strokeWidth={1.5}
                  strokeDasharray={m.tone === "call" ? undefined : "5 4"}
                  markerEnd="url(#ls-arrow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={play ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay, duration: reduce ? 0 : 0.4 }}
                />
                <motion.text
                  x={labelX}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize={11.5}
                  fill={color}
                  fontFamily={MONO}
                  initial={{ opacity: 0 }}
                  animate={play ? { opacity: 1 } : {}}
                  transition={{ delay: delay + (reduce ? 0 : 0.15), duration: reduce ? 0 : 0.3 }}
                >
                  {m.label}
                </motion.text>
              </g>
            );
          })}
        </svg>
      </Box>
    </Figure>
  );
};

export default LeaseSequence;
