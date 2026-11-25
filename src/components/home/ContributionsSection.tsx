import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Link, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { contact } from "../../data/facts";
import {
  formatDay,
  layoutDays,
  monthLabels,
  placeholderCalendar,
  type ContributionCalendar,
  type Day,
} from "./contributions";

const PITCH = 14;
const CELL = 11;
const RADIUS = 2.5;
/** Phones scroll a readable grid; from the sm breakpoint up the whole year fits. */
const MIN_PITCH_PX = { xs: 13, sm: 10 };
/** OKLCH lightness 0.37, 0.50 and 0.65 at the accent's hue, then the accent itself. */
const LEVEL_FILLS = ["#1d4a32", "#2e734f", "#48a474", "#7fd8a6"];
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const PLACEHOLDER = placeholderCalendar();
const SR_ONLY = {
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

/** Same entrance as the background PixelGrid tiles. */
const pop = keyframes`
  from { opacity: 0; transform: scale(0.55); }
  to { opacity: 1; transform: none; }
`;

interface Hover {
  day: Day;
  x: number;
  top: number;
  bottom: number;
}

const countLabel = (count: number) =>
  count === 0
    ? "No contributions"
    : `${count.toLocaleString("en-US")} contribution${count === 1 ? "" : "s"}`;

const ContributionsSection = () => {
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState<Hover | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github-contributions", { signal: AbortSignal.timeout(8000) })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status}`))))
      .then((data: ContributionCalendar) => {
        if (!Array.isArray(data.counts) || data.counts.length === 0)
          throw new Error("Empty calendar");
        if (!cancelled) setCalendar(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shown = calendar ?? PLACEHOLDER;
  const { days, weeks } = useMemo(() => layoutDays(shown), [shown]);
  const labels = useMemo(() => monthLabels(days), [days]);
  const width = weeks * PITCH - (PITCH - CELL);
  const height = 7 * PITCH - (PITCH - CELL);
  const ready = calendar !== null;
  const revealed = ready && inView;
  const tipOpen = hover !== null;

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks]);

  useLayoutEffect(() => {
    const tip = tipRef.current;
    if (!tip || !hover) return;
    const left = Math.min(
      Math.max(hover.x - tip.offsetWidth / 2, 8),
      window.innerWidth - tip.offsetWidth - 8,
    );
    const above = hover.top - tip.offsetHeight - 8;
    tip.style.left = `${left}px`;
    tip.style.top = `${above >= 8 ? above : hover.bottom + 8}px`;
  }, [hover]);

  useEffect(() => {
    if (!tipOpen) return;
    const hide = () => setHover(null);
    const onPointerDown = (e: PointerEvent) => {
      if (!svgRef.current?.contains(e.target as Node)) hide();
    };
    window.addEventListener("scroll", hide, { capture: true, passive: true });
    window.addEventListener("resize", hide);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("scroll", hide, { capture: true });
      window.removeEventListener("resize", hide);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [tipOpen]);

  const cells = useMemo(
    () => (
      <>
        <g fill="#fff" fillOpacity={0.06}>
          {days.map((d) => (
            <rect
              key={d.index}
              data-i={d.index}
              x={d.week * PITCH}
              y={d.weekday * PITCH}
              width={CELL}
              height={CELL}
              rx={RADIUS}
            />
          ))}
        </g>
        <g>
          {days
            .filter((d) => d.level > 0)
            .map((d) => (
              <rect
                key={d.index}
                className="cg-day"
                data-i={d.index}
                x={d.week * PITCH}
                y={d.weekday * PITCH}
                width={CELL}
                height={CELL}
                rx={RADIUS}
                fill={LEVEL_FILLS[d.level - 1]}
                style={{ animationDelay: `${d.week * 8 + d.weekday * 6}ms` }}
              />
            ))}
        </g>
      </>
    ),
    [days],
  );

  if (failed) return null;

  const pointAt = (target: EventTarget) => {
    const index = target instanceof Element ? target.getAttribute("data-i") : null;
    if (!ready || index === null) {
      setHover(null);
      return;
    }
    const day = days[Number(index)];
    const rect = (target as Element).getBoundingClientRect();
    setHover((prev) =>
      prev?.day === day
        ? prev
        : { day, x: rect.left + rect.width / 2, top: rect.top, bottom: rect.bottom },
    );
  };

  const first = days[0];
  const last = days[days.length - 1];

  return (
    <Box component="section" id="github" sx={{ scrollMarginTop: "5rem", mb: { xs: 8, md: 10 } }}>
      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        github
      </Typography>

      <Box
        sx={{
          fontFamily: MONO,
          fontSize: { xs: "1.35rem", md: "1.75rem" },
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
          mb: { xs: 3, md: 4 },
          opacity: ready ? 1 : 0,
          transition: "opacity 200ms ease-out",
        }}
      >
        {shown.total.toLocaleString("en-US")}
        <Box component="span" sx={SR_ONLY}>
          {" "}contributions in the last year
        </Box>
      </Box>

      <Box
        ref={scrollRef}
        sx={{
          overflowX: "auto",
          overscrollBehaviorX: "contain",
          colorScheme: "dark",
          scrollbarWidth: "thin",
          "@media (hover: none)": {
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          },
        }}
      >
        <Box
          sx={{
            minWidth: { xs: weeks * MIN_PITCH_PX.xs, sm: weeks * MIN_PITCH_PX.sm },
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: "relative",
              height: "1.5rem",
              fontFamily: MONO,
              fontSize: "0.7rem",
              color: "text.secondary",
            }}
          >
            {labels.map((l) => (
              <Box
                key={l.week}
                component="span"
                sx={{ position: "absolute", left: `${((l.week * PITCH) / width) * 100}%` }}
              >
                {l.label}
              </Box>
            ))}
          </Box>
          <Box
            component="svg"
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`Contributions per day, ${formatDay(first.date)} to ${formatDay(last.date)}`}
            className={revealed ? "on" : undefined}
            onPointerMove={(e: React.PointerEvent<SVGSVGElement>) => {
              if (e.pointerType !== "touch") pointAt(e.target);
            }}
            onPointerDown={(e: React.PointerEvent<SVGSVGElement>) => pointAt(e.target)}
            onPointerLeave={(e: React.PointerEvent<SVGSVGElement>) => {
              if (e.pointerType !== "touch") setHover(null);
            }}
            sx={{
              display: "block",
              width: "100%",
              height: "auto",
              "& .cg-day": {
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: `${pop} 280ms cubic-bezier(.2,.8,.2,1) both`,
                animationPlayState: "paused",
              },
              "&.on .cg-day": { animationPlayState: "running" },
              "&.on rect[data-i]:hover": {
                stroke: "#fff",
                strokeOpacity: 0.9,
                strokeWidth: 1.5,
                vectorEffect: "non-scaling-stroke",
              },
              "@media (prefers-reduced-motion: reduce)": {
                "& .cg-day": { animation: "none" },
              },
            }}
          >
            {cells}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Link
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "text.secondary",
            textDecoration: "none",
            fontSize: "0.8rem",
            opacity: 0.85,
            "&:hover": { opacity: 1, textDecoration: "underline" },
          }}
        >
          @zekariasasaminew
          <OpenInNewIcon sx={{ fontSize: "0.75rem" }} />
        </Link>
      </Box>

      {hover &&
        createPortal(
          <Box
            ref={tipRef}
            role="tooltip"
            sx={{
              position: "fixed",
              left: 0,
              top: 0,
              zIndex: 1500,
              pointerEvents: "none",
              px: 1,
              py: 0.5,
              borderRadius: "6px",
              bgcolor: "#262626",
              border: "1px solid rgb(255 255 255 / 0.12)",
              boxShadow: "0 6px 20px rgb(0 0 0 / 0.45)",
              fontFamily: MONO,
              fontSize: "0.75rem",
              lineHeight: 1.5,
              whiteSpace: "nowrap",
              color: "text.secondary",
            }}
          >
            <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>
              {countLabel(hover.day.count)}
            </Box>
            {" · "}
            {formatDay(hover.day.date)}
          </Box>,
          document.body,
        )}
    </Box>
  );
};

export default ContributionsSection;
