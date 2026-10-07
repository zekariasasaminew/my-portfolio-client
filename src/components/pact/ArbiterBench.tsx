import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import Figure from "./Figure";
import { usePostColors } from "./usePostColors";
import type { PostColors } from "./usePostColors";
import { ARBITER_BENCH } from "../../data/arbiterBench";
import type { Outcome, Origin } from "../../data/arbiterBench";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

const outcomeStyle = (c: PostColors): Record<Outcome, { color: string; label: string }> => ({
  match: { color: c.green, label: "identical to the maintainers' own merge" },
  faithful: { color: c.blue, label: "kept every change the maintainers kept, worded or ordered differently" },
  partial: { color: c.red, label: "silently dropped a change, and the tests still passed" },
  caught: { color: c.purple, label: "broke a test, so the gate threw it out" },
  declined: { color: c.muted, label: "declined by Arbiter's own checks" },
});

const ORDER: Outcome[] = ["match", "faithful", "partial", "caught", "declined"];

const originColor = (c: PostColors, origin: Origin) => (origin === "ours" ? c.blue : origin === "theirs" ? c.purple : c.green);

const CountUp = ({ to, play, delay }: { to: number; play: boolean; delay: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!play || reduce) {
      node.textContent = String(play ? to : 0);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.2,
      delay,
      ease: EASE_OUT,
      onUpdate: (v) => {
        node.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [to, play, delay, reduce]);
  return <span ref={ref}>0</span>;
};

const Pane = ({ title, tone, lines, from, play, reduce }: { title: string; tone: string; lines: string[]; from: number; play: boolean; reduce: boolean | null }) => {
  const c = usePostColors();
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, transform: reduce ? "none" : `translateX(${from}px)` }}
      animate={play ? { opacity: 1, transform: "translateX(0px)" } : undefined}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      sx={{ border: `1px solid ${c.line}`, borderTop: `3px solid ${tone}`, borderRadius: "8px", background: c.panelStrong, minWidth: 0 }}
    >
      <Box sx={{ px: 1.25, py: 0.6, fontFamily: MONO, fontSize: "0.68rem", color: tone, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${c.line}` }}>
        {title}
      </Box>
      <Box component="pre" sx={{ m: 0, p: 1.25, fontFamily: MONO, fontSize: "0.72rem", lineHeight: 1.6, overflowX: "auto", color: c.text }}>
        {lines.join("\n")}
      </Box>
    </Box>
  );
};

const ArbiterBench = () => {
  const c = usePostColors();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });
  const [runId, setRunId] = useState(0);
  const play = inView || !!reduce;
  const playGrid = gridInView || !!reduce;
  const styles = outcomeStyle(c);
  const { example, tiles, outcomes } = ARBITER_BENCH;

  const markerLines = [
    { text: "<<<<<<< ours", color: c.red },
    ...example.ours.map((text) => ({ text, color: c.blue })),
    { text: "=======", color: c.red },
    ...example.theirs.map((text) => ({ text, color: c.purple })),
    { text: ">>>>>>> theirs", color: c.red },
  ];

  const t = (seconds: number) => (reduce ? 0 : seconds);
  const resolveAt = 0.9 + markerLines.length * 0.06 + 1.2;
  const testsAt = resolveAt + example.resolved.length * 0.12 + 0.3;

  return (
    <Figure
      label="Fig 8"
      title={`Arbiter vs ${ARBITER_BENCH.cases} real merge conflicts`}
      onReplay={reduce ? undefined : () => setRunId((r) => r + 1)}
      caption={
        <>
          Every tile is a real merge conflict replayed from the 2021 to 2026 history of {ARBITER_BENCH.repoList}, sorted by outcome. Arbiter saw only BASE, OURS and THEIRS plus the incoming branch's commit subjects, never the maintainers' answer. Line colors in the merged pane show which side each line came from. {ARBITER_BENCH.model}, one attempt per conflict, median {ARBITER_BENCH.secondsMedian} s. Hover a tile for its commit. Harness and raw results in{" "}
          <a href={ARBITER_BENCH.harnessUrl} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
            bench/arbiter
          </a>
          .
        </>
      }
    >
      <Box ref={ref} key={runId}>
        <Box sx={{ fontFamily: MONO, fontSize: "0.72rem", color: c.muted, mb: 1.5 }}>
          {example.repo} · {example.file} · <span style={{ color: c.text }}>{example.subject}</span>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1.6fr 1fr" }, gap: 1.5, alignItems: "start" }}>
          <Pane title="ours" tone={c.blue} lines={example.ours} from={-24} play={play} reduce={reduce} />

          <Box sx={{ border: `1px solid ${c.line}`, borderTop: `3px solid ${c.green}`, borderRadius: "8px", background: c.panelStrong, minWidth: 0, position: "relative" }}>
            <Box sx={{ px: 1.25, py: 0.6, fontFamily: MONO, fontSize: "0.68rem", color: c.green, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${c.line}` }}>
              merged by arbiter
            </Box>
            <Box sx={{ position: "relative", p: 1.25, fontFamily: MONO, fontSize: "0.72rem", lineHeight: 1.6, minHeight: markerLines.length * 19 + 4 }}>
              {markerLines.map((line, i) => (
                <Box
                  key={`m-${i}`}
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={play ? { opacity: reduce ? 0 : [0, 1, 1, 0] } : undefined}
                  transition={{ duration: 1.2, times: [0, 0.15, 0.75, 1], delay: t(0.9 + i * 0.06), ease: "easeOut" }}
                  sx={{ position: "absolute", left: 10, right: 10, top: 10 + i * 19.2, whiteSpace: "pre", overflow: "hidden", textOverflow: "ellipsis", color: line.color }}
                >
                  {line.text}
                </Box>
              ))}
              {example.resolved.map((line, i) => (
                <Box
                  key={`r-${i}`}
                  component={motion.div}
                  initial={{ opacity: 0, transform: reduce ? "none" : "translateY(4px)" }}
                  animate={play ? { opacity: 1, transform: "translateY(0px)" } : undefined}
                  transition={{ duration: 0.35, delay: t(resolveAt + i * 0.12), ease: EASE_OUT }}
                  sx={{ whiteSpace: "pre", overflowX: "hidden", textOverflow: "ellipsis", borderLeft: `3px solid ${originColor(c, line.from)}`, pl: 1, color: c.text }}
                >
                  {line.text || " "}
                </Box>
              ))}
            </Box>
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={play ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: t(testsAt), ease: EASE_OUT }}
              sx={{ display: "flex", gap: 1, flexWrap: "wrap", px: 1.25, pb: 1.25 }}
            >
              <Box sx={{ fontFamily: MONO, fontSize: "0.68rem", px: 1, py: 0.25, borderRadius: "999px", border: `1px solid ${c.green}`, color: c.green }}>
                ✓ {example.tests}
              </Box>
              <Box sx={{ fontFamily: MONO, fontSize: "0.68rem", px: 1, py: 0.25, borderRadius: "999px", border: `1px solid ${c.line}`, color: c.muted }}>
                {example.verdict}
              </Box>
            </Box>
          </Box>

          <Pane title="theirs" tone={c.purple} lines={example.theirs} from={24} play={play} reduce={reduce} />
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1.25, fontFamily: MONO, fontSize: "0.68rem", color: c.muted }}>
          {(["ours", "theirs", "both"] as Origin[]).map((origin) => (
            <Box key={origin} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "2px", background: originColor(c, origin) }} />
              {origin === "both" ? "combined / new" : `from ${origin}`}
            </Box>
          ))}
        </Box>
      </Box>

      <Box ref={gridRef} key={`g-${runId}`} sx={{ mt: 4, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" }, gap: 3, alignItems: "center" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(15, 1fr)", gap: "5px" }} role="img" aria-label={ORDER.map((o) => `${outcomes[o]} ${styles[o].label}`).join(", ")}>
          {tiles.map((tile, i) => (
            <Box
              key={tile.id}
              title={`${tile.id} · ${tile.files.join(", ")}`}
              component={motion.div}
              initial={{ opacity: 0, transform: reduce ? "none" : "scale(0.9)" }}
              animate={playGrid ? { opacity: 1, transform: "scale(1)" } : undefined}
              transition={{ duration: 0.3, delay: t(0.2 + i * 0.025), ease: EASE_OUT }}
              sx={{ aspectRatio: "1", borderRadius: "3px", background: styles[tile.outcome].color, opacity: tile.outcome === "declined" ? 0.45 : 1 }}
            />
          ))}
        </Box>
        <Box>
          {ORDER.filter((o) => outcomes[o] > 0).map((o, i) => (
            <Box key={o} sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 1.25 }}>
              <Box sx={{ fontFamily: MONO, fontSize: { xs: "1.4rem", md: "1.7rem" }, fontWeight: 700, color: styles[o].color, minWidth: "2.6ch", textAlign: "right" }}>
                <CountUp to={outcomes[o]} play={playGrid} delay={0.3 + i * 0.15} />
              </Box>
              <Box sx={{ fontSize: "0.85rem", color: c.text, lineHeight: 1.4 }}>{styles[o].label}</Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Figure>
  );
};

export default ArbiterBench;
