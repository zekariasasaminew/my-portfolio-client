import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Link, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { PIXEL_EXCLUDE_ATTR } from "../pixelGrid/blockers";
import { GITHUB_CONTRIBUTIONS_FALLBACK } from "../../data/githubContributionsFallback";
import type {
  ContributionDay,
  ContributionResponse,
  ContributionScaleMode,
} from "../../types/contributions";

const ACCENT = "#7fd8a6";
const PEAK_ACCENT = "#a9edc1";
const MONO =
  '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

// Perceptually uniform OKLCH lightness steps (L: 0.34 -> 0.49 -> 0.65 -> 0.82 at H=156)
const LEVEL_FILLS: readonly string[] = [
  "rgba(255, 255, 255, 0.048)",
  "#21402d",
  "#386e4e",
  "#58a175",
  ACCENT,
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const DAY_LABELS: readonly { row: number; label: string }[] = [
  { row: 1, label: "Mon" },
  { row: 3, label: "Wed" },
  { row: 5, label: "Fri" },
];

const CELL = 13;
const GAP = 3.5;
const STEP = CELL + GAP;
const LEFT_W = 28;
const TOP_H = 18;
const GRID_H = 7 * CELL + 6 * GAP;
const BAR_OFFSET = 11;
const BAR_MAX_H = 26;
const SVG_H_WITH_BARS = TOP_H + GRID_H + BAR_OFFSET + BAR_MAX_H + 2;
const SVG_H_COMPACT = TOP_H + GRID_H;

const responseCache = new Map<string, ContributionResponse>();

interface GridCell {
  day: ContributionDay;
  weekIndex: number;
  dayOfWeek: number;
  level: 0 | 1 | 2 | 3 | 4;
  isPeak: boolean;
}

interface WeekColumn {
  index: number;
  cells: (GridCell | null)[];
  total: number;
}

interface MonthMarker {
  weekIndex: number;
  label: string;
}

function parseUtcDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatDate(iso: string): string {
  const date = parseUtcDate(iso);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

function computePerceptualLevels(
  days: ContributionDay[],
): (0 | 1 | 2 | 3 | 4)[] {
  const nonZero = days
    .filter((d) => d.count > 0)
    .map((d) => d.count)
    .sort((a, b) => a - b);
  if (nonZero.length === 0) return days.map(() => 0);

  const at = (p: number) =>
    nonZero[Math.min(nonZero.length - 1, Math.floor(nonZero.length * p))];

  // Floor thresholds prevent sparse years from making single-commit days look like peak days.
  const t2 = Math.max(at(0.25), 3);
  const t3 = Math.max(at(0.55), 8);
  const t4 = Math.max(at(0.82), 18);

  return days.map((d) => {
    if (d.count <= 0) return 0;
    if (d.count < t2) return 1;
    if (d.count < t3) return 2;
    if (d.count < t4) return 3;
    return 4;
  });
}

function buildCalendar(
  days: ContributionDay[],
  scaleMode: ContributionScaleMode,
  maxCount: number,
): {
  weeks: WeekColumn[];
  months: MonthMarker[];
  maxWeekTotal: number;
} {
  if (days.length === 0) {
    return { weeks: [], months: [], maxWeekTotal: 0 };
  }

  const levels =
    scaleMode === "perceptual"
      ? computePerceptualLevels(days)
      : days.map((d) => d.githubLevel);

  const firstDow = parseUtcDate(days[0].date).getUTCDay();
  const totalSlots = firstDow + days.length;
  const weekCount = Math.ceil(totalSlots / 7);

  const weeks: WeekColumn[] = Array.from({ length: weekCount }, (_, index) => ({
    index,
    cells: Array.from({ length: 7 }, () => null),
    total: 0,
  }));

  days.forEach((day, idx) => {
    const slot = firstDow + idx;
    const weekIndex = Math.floor(slot / 7);
    const dayOfWeek = slot % 7;
    const isPeak = maxCount >= 50 && day.count === maxCount;
    weeks[weekIndex].cells[dayOfWeek] = {
      day,
      weekIndex,
      dayOfWeek,
      level: levels[idx],
      isPeak,
    };
    weeks[weekIndex].total += day.count;
  });

  const months: MonthMarker[] = [];
  let prevMonth = -1;
  let lastLabelWeek = -10;

  for (const week of weeks) {
    const anchor = week.cells.find((c) => c !== null);
    if (!anchor) continue;
    const date = parseUtcDate(anchor.day.date);
    const month = date.getUTCMonth();
    if (month !== prevMonth) {
      // Skip a partial stub month at column 0 (e.g. Nov 23) so the first full month (Dec) gets labeled cleanly.
      const isShortLeadingStub = week.index === 0 && date.getUTCDate() > 16;
      if (!isShortLeadingStub && week.index - lastLabelWeek >= 3) {
        months.push({ weekIndex: week.index, label: MONTHS[month] });
        lastLabelWeek = week.index;
      }
      prevMonth = month;
    }
  }

  const maxWeekTotal = weeks.reduce((m, w) => Math.max(m, w.total), 0);
  return { weeks, months, maxWeekTotal };
}

export interface GithubContributionsProps {
  /** Render without the top-level section wrapper and heading when nested inside Projects. */
  embedded?: boolean;
  /** Intensity bucketing strategy. Default uses perceptual quantiles so spikes do not flatten active days. */
  scaleMode?: ContributionScaleMode;
  /** Include the aligned weekly volume micro-bars beneath the 7x53 matrix. */
  showWeeklyBars?: boolean;
  /** Callback invoked with the latest rolling 1-year total once loaded. */
  onSummaryChange?: (summary: { total: number; streak: number }) => void;
}

const GithubContributions = ({
  embedded = false,
  scaleMode = "perceptual",
  showWeeklyBars = true,
  onSummaryChange,
}: GithubContributionsProps) => {
  const [range, setRange] = useState<string>("last-year");
  const [displayRange, setDisplayRange] = useState<string>("last-year");
  const [byRange, setByRange] = useState<Record<string, ContributionResponse>>(
    () => Object.fromEntries(responseCache),
  );
  const [failedRanges, setFailedRanges] = useState<Record<string, boolean>>({});
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);
  const [pinnedCell, setPinnedCell] = useState<GridCell | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{
    x: number;
    y: number;
    align: "left" | "center" | "right";
  } | null>(null);

  const data =
    byRange[range] ??
    byRange[displayRange] ??
    GITHUB_CONTRIBUTIONS_FALLBACK;
  const isLoading = !byRange[range] && !failedRanges[range];

  useEffect(() => {
    const cached = responseCache.get(range);
    if (cached) {
      if (range === "last-year") {
        onSummaryChange?.({
          total: cached.total,
          streak: cached.stats.currentStreak || cached.stats.longestStreak,
        });
      }
      return;
    }

    const controller = new AbortController();

    fetch(`/api/github-contributions?range=${encodeURIComponent(range)}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ContributionResponse>;
      })
      .then((fresh) => {
        if (!fresh?.days?.length || controller.signal.aborted) return;
        responseCache.set(range, fresh);
        setByRange((prev) => ({ ...prev, [range]: fresh }));
        setDisplayRange(range);
        if (range === "last-year") {
          onSummaryChange?.({
            total: fresh.total,
            streak: fresh.stats.currentStreak || fresh.stats.longestStreak,
          });
        }
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setFailedRanges((prev) => ({ ...prev, [range]: true }));
        if (range === "last-year") {
          setDisplayRange("last-year");
        }
      });

    return () => controller.abort();
  }, [range, onSummaryChange]);

  const { weeks, months, maxWeekTotal } = useMemo(
    () => buildCalendar(data.days, scaleMode, data.stats.maxCount),
    [data.days, scaleMode, data.stats.maxCount],
  );

  // Start narrow viewports scrolled to the newest months on the right.
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    scroller.scrollLeft = scroller.scrollWidth;
  }, [range, weeks.length]);

  const activeCell = hoveredCell ?? pinnedCell;
  const activeWeekIndex = activeCell?.weekIndex ?? null;

  const yearOptions = useMemo(() => {
    const visibleYears = data.years.slice(0, 3);
    return [
      { id: "last-year", label: "1y" },
      ...visibleYears.map((y) => ({ id: String(y), label: String(y) })),
    ];
  }, [data.years]);

  const handleRangeSelect = useCallback((nextRange: string) => {
    setRange(nextRange);
    if (responseCache.has(nextRange)) {
      setDisplayRange(nextRange);
    }
    setHoveredCell(null);
    setPinnedCell(null);
    setTooltipPos(null);
  }, []);

  const updateTooltipAnchor = useCallback((target: Element) => {
    const frame = frameRef.current;
    if (!frame) return;
    const frameRect = frame.getBoundingClientRect();
    const cellRect = target.getBoundingClientRect();
    const rawX = cellRect.left - frameRect.left + cellRect.width / 2;
    const edgePad = 160;
    let align: "left" | "center" | "right" = "center";
    let x = rawX;
    if (rawX < edgePad) {
      align = "left";
      x = Math.max(12, cellRect.left - frameRect.left);
    } else if (rawX > frameRect.width - edgePad) {
      align = "right";
      x = Math.min(frameRect.width - 12, cellRect.right - frameRect.left);
    }
    const y = cellRect.top - frameRect.top;
    setTooltipPos({ x, y, align });
  }, []);

  const highlightPeakDay = useCallback(() => {
    for (const week of weeks) {
      for (const cell of week.cells) {
        if (cell && cell.day.date === data.stats.maxDate) {
          setPinnedCell((prev) =>
            prev?.day.date === cell.day.date ? null : cell,
          );
          return;
        }
      }
    }
  }, [weeks, data.stats.maxDate]);

  const svgWidth =
    weeks.length > 0 ? LEFT_W + weeks.length * STEP - GAP : LEFT_W + 53 * STEP - GAP;
  const svgHeight = showWeeklyBars ? SVG_H_WITH_BARS : SVG_H_COMPACT;

  const rangeCaption =
    data.range === "last-year" ? "last 12 months" : `in ${data.range}`;
  const streakCount =
    data.stats.currentStreak > 0
      ? data.stats.currentStreak
      : data.stats.longestStreak;
  const streakLabel =
    data.stats.currentStreak > 0 ? "day streak" : "longest streak";

  const activeWeekTotal =
    activeCell !== null ? weeks[activeCell.weekIndex]?.total ?? 0 : 0;

  const card = (
    <Box
      ref={frameRef}
      {...{ [PIXEL_EXCLUDE_ATTR]: "" }}
      sx={{
        position: "relative",
        bgcolor: "#1b1b1b",
        border: "1px solid rgba(255, 255, 255, 0.09)",
        borderRadius: "10px",
        p: { xs: 2.25, sm: 3, md: 3.5 },
        overflow: "hidden",
      }}
    >
      {/* Subtle top-edge mint specular line */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 4%, rgba(127, 216, 166, 0.34) 50%, transparent 96%)",
          pointerEvents: "none",
        }}
      />

      {/* Header: Hero metric + range tabs */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            columnGap: 1.25,
            rowGap: 0.25,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontFamily: MONO,
              fontSize: "clamp(1.35rem, 2.2vw, 1.8rem)",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              fontVariantNumeric: "tabular-nums",
              color: "rgba(255, 255, 255, 0.92)",
            }}
          >
            {data.total.toLocaleString()}
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.66)",
              lineHeight: 1.2,
            }}
          >
            contributions
          </Typography>
          <Typography
            component="span"
            sx={{
              fontFamily: MONO,
              fontSize: "0.76rem",
              color: "rgba(255, 255, 255, 0.56)",
              lineHeight: 1.2,
            }}
          >
            {rangeCaption}
          </Typography>
        </Box>

        <Box
          role="group"
          aria-label="Contribution time range"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            p: "3px",
            borderRadius: "8px",
            bgcolor: "rgba(255, 255, 255, 0.035)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {yearOptions.map((opt) => {
            const active = range === opt.id;
            return (
              <Box
                key={opt.id}
                component="button"
                type="button"
                aria-pressed={active}
                onClick={() => handleRangeSelect(opt.id)}
                sx={{
                  all: "unset",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  touchAction: "manipulation",
                  fontFamily: MONO,
                  fontSize: "0.76rem",
                  fontWeight: 500,
                  fontVariantNumeric: "tabular-nums",
                  px: 1.25,
                  minHeight: { xs: "44px", sm: "28px" },
                  minWidth: { xs: "44px", sm: "auto" },
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  color: active ? "#0e1912" : "rgba(255, 255, 255, 0.68)",
                  bgcolor: active ? ACCENT : "transparent",
                  transition: "background-color 160ms ease-out, color 160ms ease-out",
                  "@media (hover: hover)": {
                    "&:hover": {
                      color: active ? "#0e1912" : "rgba(255, 255, 255, 0.92)",
                      bgcolor: active ? ACCENT : "rgba(255, 255, 255, 0.06)",
                    },
                  },
                  "&:focus-visible": {
                    outline: `2px solid ${ACCENT}`,
                    outlineOffset: "2px",
                  },
                  "@media (prefers-reduced-motion: reduce)": {
                    transition: "none",
                  },
                }}
              >
                {opt.label}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Floating hover readout (desktop fine pointers only) */}
      {hoveredCell && tooltipPos && (
        <Box
          role="status"
          aria-live="polite"
          sx={{
            display: "none",
            "@media (hover: hover)": { display: "inline-flex" },
            position: "absolute",
            left: `${tooltipPos.x}px`,
            top: `${Math.max(8, tooltipPos.y - 36)}px`,
            transform:
              tooltipPos.align === "right"
                ? "translateX(-100%)"
                : tooltipPos.align === "left"
                  ? "none"
                  : "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 4,
            alignItems: "center",
            gap: 0.85,
            px: 1.25,
            py: 0.5,
            borderRadius: "6px",
            bgcolor: "#111111",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            fontFamily: MONO,
            fontSize: "0.73rem",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            color: "rgba(255, 255, 255, 0.88)",
          }}
        >
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: "2px",
              flexShrink: 0,
              bgcolor: hoveredCell.isPeak
                ? PEAK_ACCENT
                : LEVEL_FILLS[hoveredCell.level],
              border:
                hoveredCell.level === 0
                  ? "1px solid rgba(255,255,255,0.22)"
                  : "none",
            }}
          />
          <Box component="span" sx={{ fontWeight: 600 }}>
            {hoveredCell.day.count.toLocaleString()}
          </Box>
          <Box component="span" sx={{ color: "rgba(255, 255, 255, 0.62)" }}>
            {hoveredCell.day.count === 1 ? "contribution" : "contributions"} ·{" "}
            {formatDate(hoveredCell.day.date)}
          </Box>
        </Box>
      )}

      {/* Contribution Matrix + Aligned Weekly Volume Micro-Bars */}
      <Box
        ref={scrollRef}
        onMouseLeave={() => {
          setHoveredCell(null);
          setTooltipPos(null);
        }}
        sx={{
          width: "100%",
          overflowX: "auto",
          overscrollBehaviorX: "contain",
          pb: { xs: 0.75, md: 0 },
          opacity: isLoading ? 0.55 : 1,
          transition: "opacity 180ms ease-out",
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
          },
          "&::-webkit-scrollbar": { height: "5px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.14)",
            borderRadius: "999px",
          },
        }}
      >
        <Box sx={{ minWidth: { xs: "720px", md: "100%" } }}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            width="100%"
            role="img"
            aria-label={`${data.total.toLocaleString()} GitHub contributions ${rangeCaption}`}
            style={{ display: "block", overflow: "visible" }}
          >
            {/* Month labels */}
            {months.map((m) => (
              <text
                key={`${m.label}-${m.weekIndex}`}
                x={LEFT_W + m.weekIndex * STEP}
                y={11}
                fill="rgba(255, 255, 255, 0.58)"
                style={{
                  fontFamily: MONO,
                  fontSize: "10px",
                  userSelect: "none",
                }}
              >
                {m.label}
              </text>
            ))}

            {/* Weekday labels */}
            {DAY_LABELS.map(({ row, label }) => (
              <text
                key={label}
                x={0}
                y={TOP_H + row * STEP + CELL - 2.5}
                fill="rgba(255, 255, 255, 0.56)"
                style={{
                  fontFamily: MONO,
                  fontSize: "9.5px",
                  userSelect: "none",
                }}
              >
                {label}
              </text>
            ))}

            {/* 7x53 Daily Cells */}
            {weeks.map((week) =>
              week.cells.map((cell) => {
                if (!cell) return null;
                const x = LEFT_W + cell.weekIndex * STEP;
                const y = TOP_H + cell.dayOfWeek * STEP;
                const isSelected = activeCell?.day.date === cell.day.date;
                const inOtherWeek =
                  activeWeekIndex !== null && activeWeekIndex !== cell.weekIndex;
                const fill = cell.isPeak
                  ? PEAK_ACCENT
                  : LEVEL_FILLS[cell.level];

                return (
                  <rect
                    key={cell.day.date}
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    rx={2.5}
                    ry={2.5}
                    fill={fill}
                    fillOpacity={inOtherWeek ? 0.72 : 1}
                    stroke={
                      isSelected
                        ? "#ecfff4"
                        : cell.level === 0
                          ? "rgba(255, 255, 255, 0.04)"
                          : "none"
                    }
                    strokeWidth={isSelected ? 1.5 : 0.75}
                    tabIndex={cell.isPeak || isSelected ? 0 : -1}
                    aria-label={`${cell.day.count} ${
                      cell.day.count === 1 ? "contribution" : "contributions"
                    } on ${formatDate(cell.day.date)}`}
                    style={{
                      cursor: "pointer",
                      outline: "none",
                      transition: "fill-opacity 140ms ease-out",
                    }}
                    onMouseEnter={(e) => {
                      setHoveredCell(cell);
                      updateTooltipAnchor(e.currentTarget);
                    }}
                    onFocus={(e) => {
                      setPinnedCell(cell);
                      updateTooltipAnchor(e.currentTarget);
                    }}
                    onClick={() => {
                      setPinnedCell((prev) =>
                        prev?.day.date === cell.day.date ? null : cell,
                      );
                    }}
                  />
                );
              }),
            )}

            {/* Aligned Weekly Cadence Micro-Bars (true linear weekly volume) */}
            {showWeeklyBars && maxWeekTotal > 0 && (
              <g aria-hidden="true">
                <line
                  x1={LEFT_W}
                  y1={TOP_H + GRID_H + BAR_OFFSET + BAR_MAX_H + 0.5}
                  x2={svgWidth}
                  y2={TOP_H + GRID_H + BAR_OFFSET + BAR_MAX_H + 0.5}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth={1}
                />
                {weeks.map((week) => {
                  const x = LEFT_W + week.index * STEP;
                  const baseY = TOP_H + GRID_H + BAR_OFFSET + BAR_MAX_H;
                  const barH =
                    week.total > 0
                      ? Math.max(2.5, (week.total / maxWeekTotal) * BAR_MAX_H)
                      : 1.5;
                  const isActiveWeek = activeWeekIndex === week.index;

                  return (
                    <rect
                      key={`wk-${week.index}`}
                      x={x + 1.5}
                      y={baseY - barH}
                      width={CELL - 3}
                      height={barH}
                      rx={1.5}
                      fill={
                        week.total === 0
                          ? "rgba(255, 255, 255, 0.05)"
                          : isActiveWeek
                            ? ACCENT
                            : "rgba(127, 216, 166, 0.32)"
                      }
                      style={{ transition: "fill 140ms ease-out" }}
                    />
                  );
                })}
              </g>
            )}
          </svg>
        </Box>
      </Box>

      {/* Footer: Inline telemetry or pinned day readout + scale legend + profile link */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          columnGap: 2,
          rowGap: 1.25,
          mt: 2,
          minHeight: "24px",
        }}
      >
        {/* Left: Telemetry (desktop idle/hover) or pinned day (tap/focus) */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            columnGap: 1.5,
            rowGap: 0.5,
            fontFamily: MONO,
            fontSize: "0.76rem",
            fontVariantNumeric: "tabular-nums",
            color: "rgba(255, 255, 255, 0.62)",
          }}
        >
          {pinnedCell && !hoveredCell ? (
            <>
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: "2px",
                    bgcolor: pinnedCell.isPeak
                      ? PEAK_ACCENT
                      : LEVEL_FILLS[pinnedCell.level],
                    border:
                      pinnedCell.level === 0
                        ? "1px solid rgba(255,255,255,0.22)"
                        : "none",
                  }}
                />
                <Box
                  component="span"
                  sx={{ color: "rgba(255, 255, 255, 0.92)", fontWeight: 600 }}
                >
                  {pinnedCell.day.count.toLocaleString()}
                </Box>
                <span>
                  {pinnedCell.day.count === 1 ? "contribution" : "contributions"}{" "}
                  · {formatDate(pinnedCell.day.date)}
                </span>
              </Box>
              {activeWeekTotal > pinnedCell.day.count && (
                <Box component="span" sx={{ color: "rgba(255, 255, 255, 0.56)" }}>
                  · {activeWeekTotal.toLocaleString()} that week
                </Box>
              )}
            </>
          ) : (
            <>
              <Box component="span">
                <Box
                  component="span"
                  sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}
                >
                  {data.stats.activeDays}
                </Box>{" "}
                active days
              </Box>
              <Box component="span" aria-hidden sx={{ opacity: 0.45 }}>
                ·
              </Box>
              <Box component="span">
                <Box
                  component="span"
                  sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}
                >
                  {streakCount}
                </Box>{" "}
                {streakLabel}
              </Box>
              {data.stats.maxCount > 0 && (
                <>
                  <Box component="span" aria-hidden sx={{ opacity: 0.45 }}>
                    ·
                  </Box>
                  <Box
                    component="button"
                    type="button"
                    onClick={highlightPeakDay}
                    sx={{
                      all: "unset",
                      cursor: "pointer",
                      touchAction: "manipulation",
                      color: "inherit",
                      "@media (hover: hover)": {
                        "&:hover": { color: ACCENT },
                      },
                      "&:focus-visible": {
                        outline: `2px solid ${ACCENT}`,
                        outlineOffset: "2px",
                        borderRadius: "3px",
                      },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ color: ACCENT, fontWeight: 600 }}
                    >
                      {data.stats.maxCount}
                    </Box>{" "}
                    peak day
                  </Box>
                </>
              )}
            </>
          )}
        </Box>

        {/* Right: Scale legend + GitHub link */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            aria-hidden
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: MONO,
              fontSize: "0.7rem",
              color: "rgba(255, 255, 255, 0.56)",
            }}
          >
            <Box component="span" sx={{ mr: 0.5 }}>
              Less
            </Box>
            {LEVEL_FILLS.map((fill, idx) => (
              <Box
                key={idx}
                component="span"
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "2px",
                  bgcolor: fill,
                  border:
                    idx === 0 ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
                }}
              />
            ))}
            <Box component="span" sx={{ ml: 0.5 }}>
              More
            </Box>
          </Box>

          <Link
            href={`https://github.com/${data.username}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.45,
              fontFamily: MONO,
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.68)",
              textDecoration: "none",
              textUnderlineOffset: "0.2em",
              minHeight: { xs: "44px", sm: "auto" },
              "@media (hover: hover)": {
                "&:hover": {
                  color: ACCENT,
                  textDecoration: "underline",
                },
              },
              "&:focus-visible": {
                outline: `2px solid ${ACCENT}`,
                outlineOffset: "2px",
                borderRadius: "3px",
              },
            }}
          >
            @{data.username}
            <OpenInNewIcon sx={{ fontSize: "0.75rem" }} />
          </Link>
        </Box>
      </Box>
    </Box>
  );

  if (embedded) {
    return <Box id="github" sx={{ scrollMarginTop: "5rem", mb: 5 }}>{card}</Box>;
  }

  return (
    <Box
      component="section"
      id="github"
      sx={{ scrollMarginTop: "5rem", mb: { xs: 8, md: 10 } }}
    >
      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        github
      </Typography>
      {card}
    </Box>
  );
};

export default GithubContributions;
