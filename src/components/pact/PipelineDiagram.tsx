import { motion, useReducedMotion } from "framer-motion";
import { usePostColors } from "./usePostColors";
import type { PostColors } from "./usePostColors";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const CYCLE_SECONDS = 6;
const HOP_SECONDS = 1.2;

interface NodeProps {
  cx: number;
  cy: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  stroke: string;
  c: PostColors;
  pill?: boolean;
}

const Node = ({ cx, cy, w, h, title, sub, stroke, c, pill }: NodeProps) => (
  <g>
    <rect
      x={cx - w / 2}
      y={cy - h / 2}
      width={w}
      height={h}
      rx={pill ? h / 2 : 10}
      fill={c.panelStrong}
      stroke={stroke}
      strokeWidth={1.5}
    />
    <text
      x={cx}
      y={sub ? cy - 4 : cy + 5}
      textAnchor="middle"
      fontSize={16}
      fontWeight={600}
      fill={c.text}
      fontFamily={MONO}
    >
      {title}
    </text>
    {sub && (
      <text x={cx} y={cy + 15} textAnchor="middle" fontSize={12.5} fill={c.muted}>
        {sub}
      </text>
    )}
  </g>
);

const EDGES = {
  taskToPlanner: "M320,56 C320,80 170,72 170,94",
  taskToPrep: "M320,56 C320,80 470,72 470,94",
  plannerToValidate: "M170,146 L170,188",
  validateToLanes: "M170,240 L170,292",
  prepToLanes: "M470,146 L470,292",
  lanesToCommit: "M320,462 L320,490",
  commitToVerify: "M320,530 L320,558",
  verifyToVerdict: "M320,602 L320,630",
  verdictToBranch: "M320,690 L320,716",
  verdictToRepair: "M362,660 L455,660",
  repairToCommit: "M530,638 L530,510 L420,510",
  retry: "M50,214 C20,214 20,120 50,120",
};

const LANES = [
  { x: 56, dur: 3.2 },
  { x: 164, dur: 4.6 },
  { x: 272, dur: 2.7 },
  { x: 380, dur: 5.4 },
  { x: 488, dur: 3.9 },
];

const PipelineDiagram = () => {
  const c = usePostColors();
  const reduce = useReducedMotion();

  const flowing = [
    { d: EDGES.taskToPlanner, begin: 0 },
    { d: EDGES.taskToPrep, begin: 0 },
    { d: EDGES.plannerToValidate, begin: 0.8 },
    { d: EDGES.validateToLanes, begin: 1.4 },
    { d: EDGES.prepToLanes, begin: 1.1 },
    { d: EDGES.lanesToCommit, begin: 2.2 },
    { d: EDGES.commitToVerify, begin: 2.6 },
    { d: EDGES.verifyToVerdict, begin: 3.0 },
    { d: EDGES.verdictToBranch, begin: 3.4 },
    { d: EDGES.verdictToRepair, begin: 3.4, color: c.red },
    { d: EDGES.repairToCommit, begin: 3.9, color: c.red },
  ];

  return (
    <svg
      viewBox="0 0 640 770"
      width="100%"
      role="img"
      aria-label="pact run pipeline: a task goes to a planner and, in parallel, a shared tree with a verification baseline. The validated plan fans out into lanes that run as sessions inside one agent process and coordinate through pact-coord. pact commits once, runs every verify command against the baseline, and either returns a branch or starts a repair lane."
      style={{ display: "block", maxWidth: 640, margin: "0 auto" }}
    >
      <defs>
        <marker id="pp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={c.muted} />
        </marker>
      </defs>

      {Object.entries(EDGES).map(([key, d]) => (
        <path
          key={key}
          d={d}
          fill="none"
          stroke={key === "verdictToRepair" || key === "repairToCommit" ? c.red : c.line}
          strokeWidth={1.6}
          strokeDasharray={key === "retry" ? "4 4" : undefined}
          markerEnd="url(#pp-arrow)"
        />
      ))}
      <text x={6} y={172} fontSize={12} fill={c.muted} fontFamily={MONO} transform="rotate(-90 14 168)">
        retry
      </text>
      <text x={372} y={652} fontSize={11.5} fill={c.red} fontFamily={MONO}>
        regressed
      </text>
      <text x={330} y={708} fontSize={11.5} fill={c.green} fontFamily={MONO}>
        passed
      </text>

      <Node cx={320} cy={36} w={150} h={40} title="task" stroke={c.accent} c={c} pill />
      <Node cx={170} cy={120} w={250} h={52} title="planner" sub="reads the repo, writes a plan" stroke={c.purple} c={c} />
      <Node cx={470} cy={120} w={250} h={52} title="shared tree" sub="deps + verify baseline, in parallel" stroke={c.blue} c={c} />
      <Node cx={170} cy={214} w={250} h={52} title="validate" sub="disjoint files, unique names" stroke={c.purple} c={c} />

      <rect x={40} y={292} width={560} height={170} rx={12} fill="none" stroke={c.accent} strokeDasharray="6 5" strokeWidth={1.4} />
      <text x={56} y={311} fontSize={12} fill={c.accent} fontFamily={MONO}>
        one agent process, one ACP session per lane
      </text>

      {LANES.map((lane, i) => (
        <g key={lane.x}>
          <rect x={lane.x} y={322} width={96} height={64} rx={8} fill={c.panelStrong} stroke={c.line} />
          <text x={lane.x + 48} y={344} textAnchor="middle" fontSize={13} fill={c.text} fontFamily={MONO}>
            lane {i + 1}
          </text>
          <rect x={lane.x + 12} y={360} width={72} height={8} rx={4} fill={c.line} />
          <motion.rect
            x={lane.x + 12}
            y={360}
            height={8}
            rx={4}
            initial={{ width: reduce ? 72 : 0, fill: c.blue }}
            animate={
              reduce
                ? { width: 72, fill: c.green }
                : { width: [0, 72, 72], fill: [c.blue, c.blue, c.green] }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: lane.dur,
                    times: [0, 0.85, 1],
                    repeat: Infinity,
                    repeatDelay: 6 - lane.dur,
                    ease: "easeInOut",
                  }
            }
          />
          <line x1={lane.x + 48} y1={386} x2={lane.x + 48} y2={408} stroke={c.line} strokeDasharray="3 3" />
          {!reduce && (
            <circle r={3} fill={c.amber}>
              <animateMotion
                dur="1.6s"
                begin={`${i * 0.37}s`}
                repeatCount="indefinite"
                keyPoints="0;1;0"
                keyTimes="0;0.5;1"
                calcMode="linear"
                path={`M${lane.x + 48},386 L${lane.x + 48},408`}
              />
            </circle>
          )}
        </g>
      ))}

      <rect x={56} y={408} width={528} height={38} rx={8} fill={c.panelStrong} stroke={c.amber} strokeWidth={1.3} />
      <text x={320} y={432} textAnchor="middle" fontSize={13} fill={c.text} fontFamily={MONO}>
        pact-coord over HTTP: claim_files · check_messages · release_files
      </text>

      <Node cx={320} cy={510} w={200} h={40} title="commit once" stroke={c.text} c={c} />
      <Node cx={320} cy={580} w={290} h={44} title="run every --verify" sub="judged against the baseline" stroke={c.blue} c={c} />

      <g>
        <polygon points="320,630 362,660 320,690 278,660" fill={c.panelStrong} stroke={c.accent} strokeWidth={1.5} />
        <text x={320} y={665} textAnchor="middle" fontSize={12.5} fill={c.text} fontFamily={MONO}>
          verdict
        </text>
      </g>
      <Node cx={530} cy={660} w={150} h={44} title="repair lane" sub="same tree" stroke={c.red} c={c} />
      <Node cx={320} cy={740} w={190} h={40} title="branch + report" stroke={c.green} c={c} pill />

      {!reduce &&
        flowing.map((edge, i) => {
          const start = edge.begin / CYCLE_SECONDS;
          const end = (edge.begin + HOP_SECONDS) / CYCLE_SECONDS;
          return (
            <circle key={i} r={4.5} fill={edge.color ?? c.accent} opacity={0}>
              <animateMotion
                dur={`${CYCLE_SECONDS}s`}
                repeatCount="indefinite"
                calcMode="linear"
                keyPoints="0;0;1;1"
                keyTimes={`0;${start};${end};1`}
                path={edge.d}
              />
              <animate
                attributeName="opacity"
                dur={`${CYCLE_SECONDS}s`}
                repeatCount="indefinite"
                values="0;0;1;1;0;0"
                keyTimes={`0;${start};${start + 0.01};${end - 0.01};${end};1`}
              />
            </circle>
          );
        })}
    </svg>
  );
};

export default PipelineDiagram;
