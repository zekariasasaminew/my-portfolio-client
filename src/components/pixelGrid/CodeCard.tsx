import { Box, useTheme } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects } from "../../data/projects";
import { PIXEL_EXCLUDE_ATTR, collectBlockers } from "./blockers";

type Tone = "base" | "punc" | "accent" | 0 | 1 | 2 | 3;
type Token = [string, Tone];

interface Snippet {
  open: Token[];
  items: Token[][];
  close: Token[];
}

function snippet(
  subject: string,
  verb: string,
  items: string[],
  finish: string,
): Snippet {
  return {
    open: [
      [subject, "base"],
      [".", "punc"],
      [verb, "accent"],
      ["({", "punc"],
    ],
    items: items.slice(0, 4).map((item, i) => [[`${item},`, i as Tone]]),
    close: [
      ["})", "punc"],
      [".", "punc"],
      [finish, "accent"],
      ["()", "punc"],
    ],
  };
}

const SNIPPETS: Snippet[] = [
  snippet(
    "zekarias",
    "build",
    projects.map((p) => p.name),
    "ship",
  ),
  snippet("pact", "spawn", ["claude", "copilot", "codex", "gemini"], "merge"),
  snippet("alert", "trace", ["logs", "commit", "fix"], "draftPR"),
  snippet(
    "zekarias",
    "stack",
    ["typescript", "python", "react", "langgraph"],
    "run",
  ),
];

const FIRST_SPOT = { x: 0.766, y: 0.21 };
const NEAR_RADIUS = 320;
const AVOID_MARGIN = 24;
const ROW_STAGGER_MS = 220;
const ROW_GROW_MS = 240;
const HOLD_MS = 2600;
const ROW_COLLAPSE_MS = 70;
const FADE_MS = 350;

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

export interface CardTrigger {
  count: number;
  /** Viewport point to place the card near, e.g. the cursor. */
  near?: { x: number; y: number };
}

interface Props {
  trigger: CardTrigger;
  /** The tile layer the card is positioned in. */
  layerRef: React.RefObject<HTMLElement | null>;
  /** Page content whose text the card must not overlap. */
  contentRef: React.RefObject<HTMLElement | null>;
}

interface Play {
  x: number;
  y: number;
  snippet: number;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), Math.max(lo, hi));
}

const CodeCard = ({ trigger, layerRef, contentRef }: Props) => {
  const theme = useTheme();
  const tones = TONES[theme.palette.mode];
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const plays = useRef(0);
  const lastSnippet = useRef(-1);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [play, setPlay] = useState<Play | null>(null);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    const content = contentRef.current;
    if (
      !trigger.count ||
      !layer ||
      !content ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const options = SNIPPETS.map((_, i) => i).filter(
      (i) => i !== lastSnippet.current,
    );
    const index =
      plays.current === 0
        ? 0
        : options[Math.floor(Math.random() * options.length)];
    const card = measureRefs.current[index]?.getBoundingClientRect();
    const w = card?.width ?? 200;
    const h = card?.height ?? 160;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const avoid = collectBlockers(content, layer).map((b) => ({
      left: b.left - window.scrollX,
      right: b.right - window.scrollX,
      top: b.top - window.scrollY,
      bottom: b.bottom - window.scrollY,
    }));
    const minX = 0.06 * vw + w / 2;
    const maxX = vw - 0.06 * vw - w / 2;
    const minY = 0.06 * vh + h / 2;
    const maxY = vh - 0.06 * vh - h / 2;
    const isFree = (x: number, y: number) =>
      !avoid.some(
        (a) =>
          x - w / 2 < a.right + AVOID_MARGIN &&
          x + w / 2 > a.left - AVOID_MARGIN &&
          y - h / 2 < a.bottom + AVOID_MARGIN &&
          y + h / 2 > a.top - AVOID_MARGIN,
      );

    const candidates: { x: number; y: number }[] = [];
    if (plays.current === 0)
      candidates.push({
        x: clamp(vw * FIRST_SPOT.x + w / 2, minX, maxX),
        y: clamp(vh * FIRST_SPOT.y + h / 2, minY, maxY),
      });
    if (trigger.near)
      for (let i = 0; i < 40; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const dist = NEAR_RADIUS * Math.sqrt(Math.random());
        candidates.push({
          x: clamp(trigger.near.x + Math.cos(angle) * dist, minX, maxX),
          y: clamp(trigger.near.y + Math.sin(angle) * dist, minY, maxY),
        });
      }
    if (!trigger.near || plays.current === 0)
      for (let i = 0; i < 60; i += 1)
        candidates.push({
          x: minX + Math.random() * Math.max(0, maxX - minX),
          y: minY + Math.random() * Math.max(0, maxY - minY),
        });
    plays.current += 1;

    const free = candidates.find((c) => isFree(c.x, c.y));
    if (!free) return;
    const origin = layer.getBoundingClientRect();
    lastSnippet.current = index;
    setPlay({
      x: free.x - origin.left,
      y: free.y - origin.top,
      snippet: index,
    });
  }, [trigger, layerRef, contentRef]);

  useEffect(() => {
    if (!play) return;
    const rows = SNIPPETS[play.snippet].items.length;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms));
    at(0, () => {
      setShown(0);
      setPhase("run");
    });
    let t = 0;
    for (let i = 1; i <= rows; i += 1) {
      t += ROW_STAGGER_MS;
      at(t, () => setShown(i));
    }
    t += HOLD_MS;
    for (let i = rows - 1; i >= 0; i -= 1) {
      t += ROW_COLLAPSE_MS;
      at(t, () => setShown(i));
    }
    t += 180;
    at(t, () => setPhase("fade"));
    at(t + FADE_MS, () => {
      setPhase("idle");
      setPlay(null);
    });
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [play]);

  const color = (tone: Tone) =>
    typeof tone === "number" ? tones.items[tone] : tones[tone];
  const line = (tokens: Token[]) =>
    tokens.map(([text, tone], i) => (
      <span key={i} style={{ color: color(tone) }}>
        {text}
      </span>
    ));
  const current = SNIPPETS[play?.snippet ?? 0];

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
        left: play?.x ?? 0,
        top: play?.y ?? 0,
        opacity: phase === "run" ? 1 : 0,
        transition: phase === "fade" ? `opacity ${FADE_MS}ms ease-out` : "none",
        visibility: play ? "visible" : "hidden",
      }}
    >
      {SNIPPETS.map((s, si) => (
        <Box
          key={si}
          ref={(el: HTMLDivElement | null) => {
            measureRefs.current[si] = el;
          }}
          sx={{ position: "absolute", visibility: "hidden" }}
        >
          <div>{line(s.open)}</div>
          {s.items.map((item, i) => (
            <div key={i} style={{ marginTop: i === 0 ? "0.5em" : 0 }}>
              {"  "}
              {line(item)}
            </div>
          ))}
          <div style={{ marginTop: "0.5em" }}>{line(s.close)}</div>
        </Box>
      ))}
      <div>{line(current.open)}</div>
      {current.items.map((item, i) => (
        <div
          key={`${play?.snippet}-${i}`}
          style={{
            overflow: "hidden",
            marginTop: i === 0 ? "0.5em" : 0,
            height: i < shown ? "1.5em" : 0,
            transition: `height ${ROW_GROW_MS}ms cubic-bezier(.2,.8,.2,1)`,
          }}
        >
          {"  "}
          {line(item)}
        </div>
      ))}
      <div style={{ marginTop: "0.5em" }}>{line(current.close)}</div>
    </Box>
  );
};

export default CodeCard;
