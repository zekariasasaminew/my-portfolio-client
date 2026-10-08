import { Box, useTheme } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects } from "../../data/projects";
import { PIXEL_EXCLUDE_ATTR, collectBlockers } from "./blockers";

type Tone = "base" | "punc" | "accent" | 0 | 1 | 2 | 3;
type Token = [string, Tone];

const OPEN: Token[] = [
  ["zekarias", "base"],
  [".", "punc"],
  ["build", "accent"],
  ["({", "punc"],
];
const CLOSE: Token[] = [
  ["})", "punc"],
  [".", "punc"],
  ["ship", "accent"],
  ["()", "punc"],
];
const ITEMS: Token[][] = projects
  .slice(0, 4)
  .map((p, i) => [[`${p.name},`, i as Tone]]);
const FIRST_SPOT = { x: 0.766, y: 0.21 };
const AVOID_MARGIN = 24;

const TONES = {
  dark: {
    base: "#e6e6e6",
    punc: "#7a7a7a",
    accent: "#7fd8a6",
    items: ["#15BDFF", "#FFE938", "#F56031", "#FF5CAD"],
  },
  light: {
    base: "#241F1A",
    punc: "#8a8178",
    accent: "#0a8f4f",
    items: ["#0A7FC0", "#B88A00", "#D9441A", "#D42A84"],
  },
};

type Phase = "idle" | "run" | "fade";

interface Props {
  trigger: number;
  /** The tile layer the card is positioned in. */
  layerRef: React.RefObject<HTMLElement | null>;
  /** Page content whose text the card must not overlap. */
  contentRef: React.RefObject<HTMLElement | null>;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), Math.max(lo, hi));
}

const CodeCard = ({ trigger, layerRef, contentRef }: Props) => {
  const theme = useTheme();
  const tones = TONES[theme.palette.mode];
  const measureRef = useRef<HTMLDivElement>(null);
  const plays = useRef(0);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    const content = contentRef.current;
    if (
      !trigger ||
      !layer ||
      !content ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const box = {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const card = measureRef.current?.getBoundingClientRect();
    const w = card?.width ?? 200;
    const h = card?.height ?? 160;
    const avoid = collectBlockers(content, layer).map((b) => ({
      left: b.left - window.scrollX,
      right: b.right - window.scrollX,
      top: b.top - window.scrollY,
      bottom: b.bottom - window.scrollY,
    }));
    const padX = 0.06 * box.width;
    const padY = 0.06 * box.height;
    const minX = padX + w / 2;
    const maxX = box.width - padX - w / 2;
    const minY = padY + h / 2;
    const maxY = box.height - padY - h / 2;
    const isFree = (x: number, y: number) => {
      const l = box.left + x - w / 2;
      const r = box.left + x + w / 2;
      const t = box.top + y - h / 2;
      const b = box.top + y + h / 2;
      return !avoid.some(
        (a) =>
          l < a.right + AVOID_MARGIN &&
          r > a.left - AVOID_MARGIN &&
          t < a.bottom + AVOID_MARGIN &&
          b > a.top - AVOID_MARGIN,
      );
    };

    const candidates: { x: number; y: number }[] = [];
    if (plays.current === 0)
      candidates.push({
        x: clamp(box.width * FIRST_SPOT.x + w / 2, minX, maxX),
        y: clamp(box.height * FIRST_SPOT.y + h / 2, minY, maxY),
      });
    plays.current += 1;
    for (let i = 0; i < 60; i += 1)
      candidates.push({
        x: minX + Math.random() * Math.max(0, maxX - minX),
        y: minY + Math.random() * Math.max(0, maxY - minY),
      });
    const free = candidates.find((c) => isFree(c.x, c.y));
    const origin = layer.getBoundingClientRect();
    setSpot(free ? { x: free.x - origin.left, y: free.y - origin.top } : null);
  }, [trigger, layerRef, contentRef]);

  useEffect(() => {
    if (!trigger || !spot) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms));
    at(0, () => setPhase("run"));
    let t = 0;
    for (let i = 1; i <= ITEMS.length; i += 1) {
      t += i === 1 ? 0 : 140;
      at(t, () => setShown(i));
    }
    t += 440;
    for (let i = ITEMS.length - 1; i >= 0; i -= 1) {
      t += 45;
      at(t, () => setShown(i));
    }
    t += 180;
    at(t, () => setPhase("fade"));
    at(t + 350, () => {
      setPhase("idle");
      setSpot(null);
    });
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [trigger, spot]);

  const color = (tone: Tone) =>
    typeof tone === "number" ? tones.items[tone] : tones[tone];
  const line = (tokens: Token[]) =>
    tokens.map(([text, tone], i) => (
      <span key={i} style={{ color: color(tone) }}>
        {text}
      </span>
    ));

  return (
    <Box
      {...(phase !== "idle" ? { [PIXEL_EXCLUDE_ATTR]: "" } : {})}
      sx={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        fontFamily:
          '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        fontSize: "clamp(11px, 0.78vw, 16px)",
        lineHeight: 1.5,
        letterSpacing: "0.02em",
        whiteSpace: "pre",
        textAlign: "left",
      }}
      style={{
        left: spot?.x ?? 0,
        top: spot?.y ?? 0,
        opacity: phase === "run" ? 1 : 0,
        transition: phase === "fade" ? "opacity 350ms ease-out" : "none",
        visibility: spot ? "visible" : "hidden",
      }}
    >
      <Box ref={measureRef} sx={{ position: "absolute", visibility: "hidden" }}>
        <div>{line(OPEN)}</div>
        {ITEMS.map((item, i) => (
          <div key={i} style={{ marginTop: i === 0 ? "0.5em" : 0 }}>
            {"  "}
            {line(item)}
          </div>
        ))}
        <div style={{ marginTop: "0.5em" }}>{line(CLOSE)}</div>
      </Box>
      <div>{line(OPEN)}</div>
      {ITEMS.map((item, i) => (
        <div
          key={i}
          style={{
            overflow: "hidden",
            marginTop: i === 0 ? "0.5em" : 0,
            height: i < shown ? "1.5em" : 0,
            transition: "height 180ms cubic-bezier(.2,.8,.2,1)",
          }}
        >
          {"  "}
          {line(item)}
        </div>
      ))}
      <div style={{ marginTop: "0.5em" }}>{line(CLOSE)}</div>
    </Box>
  );
};

export default CodeCard;
