import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useInView } from "framer-motion";
import { usePactReducedMotion } from "./usePactReducedMotion";
import Figure from "./Figure";
import { usePostColors } from "./usePostColors";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const LANES = 8;
const SPEEDUP = 10;
const PROCESS = { seconds: 50.9, mb: 2456 };
const SESSION = { seconds: 5.6, mb: 445 };

interface PanelProps {
  title: string;
  subtitle: string;
  seconds: number;
  totalSeconds: number;
  mb: number;
  totalMb: number;
  ready: number;
  shared: boolean;
}

const MAX_MB = PROCESS.mb;

const Panel = ({ title, subtitle, seconds, totalSeconds, mb, totalMb, ready, shared }: PanelProps) => {
  const c = usePostColors();
  const done = seconds >= totalSeconds;
  return (
    <Box sx={{ flex: 1, minWidth: 0, border: `1px solid ${c.line}`, borderRadius: "10px", p: 2, background: c.panelStrong }}>
      <Box sx={{ fontFamily: MONO, fontSize: "0.85rem", fontWeight: 600, color: c.text }}>{title}</Box>
      <Box sx={{ fontSize: "0.75rem", color: c.muted, mb: 2 }}>{subtitle}</Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0.75,
          p: shared ? 1 : 0,
          border: shared ? `1.5px dashed ${c.accent}` : "none",
          borderRadius: "8px",
          mb: 2,
        }}
      >
        {Array.from({ length: LANES }, (_, i) => {
          const isReady = i < ready;
          return (
            <Box
              key={i}
              sx={{
                height: 34,
                borderRadius: shared ? "16px" : "6px",
                border: `1.5px solid ${isReady ? c.green : c.line}`,
                background: isReady ? `${c.green}22` : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontSize: "0.68rem",
                color: isReady ? c.text : c.muted,
                transition: "all 0.25s ease",
              }}
            >
              {shared ? `session ${i + 1}` : `proc ${i + 1}`}
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: "0.75rem", color: c.muted }}>
        <span>startup</span>
        <Box component="span" sx={{ color: done ? c.text : c.accent, fontWeight: 600 }}>
          {Math.min(seconds, totalSeconds).toFixed(1)} s
        </Box>
      </Box>
      <Box sx={{ height: 8, borderRadius: 4, background: c.line, my: 0.75, overflow: "hidden" }}>
        <Box sx={{ height: "100%", width: `${(Math.min(seconds, totalSeconds) / PROCESS.seconds) * 100}%`, background: c.accent }} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: "0.75rem", color: c.muted, mt: 1.5 }}>
        <span>memory</span>
        <Box component="span" sx={{ color: done ? c.text : c.purple, fontWeight: 600 }}>
          {Math.round(Math.min(mb, totalMb)).toLocaleString()} MB
        </Box>
      </Box>
      <Box sx={{ height: 8, borderRadius: 4, background: c.line, my: 0.75, overflow: "hidden" }}>
        <Box sx={{ height: "100%", width: `${(Math.min(mb, totalMb) / MAX_MB) * 100}%`, background: c.purple }} />
      </Box>
    </Box>
  );
};

const ProcessVsSession = () => {
  const reduce = usePactReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sim, setSim] = useState(reduce ? PROCESS.seconds : 0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const simSeconds = ((now - start) / 1000) * SPEEDUP;
      setSim(simSeconds);
      if (simSeconds < PROCESS.seconds) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, runId]);

  const perProcess = PROCESS.seconds / LANES;
  const processesReady = Math.min(LANES, Math.floor(sim / perProcess));
  const sessionsReady = Math.min(LANES, Math.floor((sim / SESSION.seconds) * LANES));

  return (
    <Figure
      label="Fig 5"
      title="Eight processes vs. eight sessions in one process"
      onReplay={() => {
        setSim(0);
        setRunId((r) => r + 1);
      }}
      caption="Measured with Copilot CLI 1.0.90 on a trivial one-file task, played back at 10x. A separate process costs about 6 s and 330 MB per lane, all of it startup. A session inside a running process costs about 20 MB and no startup."
    >
      <Box ref={ref} sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
        <Panel
          title="8 × copilot -p"
          subtitle="one cold process per lane"
          seconds={sim}
          totalSeconds={PROCESS.seconds}
          mb={processesReady * (PROCESS.mb / LANES)}
          totalMb={PROCESS.mb}
          ready={processesReady}
          shared={false}
        />
        <Panel
          title="1 × copilot --acp"
          subtitle="eight Agent Client Protocol sessions"
          seconds={sim}
          totalSeconds={SESSION.seconds}
          mb={(Math.min(sim, SESSION.seconds) / SESSION.seconds) * SESSION.mb}
          totalMb={SESSION.mb}
          ready={sessionsReady}
          shared
        />
      </Box>
    </Figure>
  );
};

export default ProcessVsSession;
