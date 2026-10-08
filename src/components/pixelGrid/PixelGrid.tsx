import { Box, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CodeCard, { type CardTrigger } from "./CodeCard";
import { PIXEL_EXCLUDE_ATTR, collectBlockers, type DocRect } from "./blockers";
import {
  CELL_PX,
  PALETTES,
  buildLayout,
  growCluster,
  pick,
  tilesAround,
  type CellZone,
  type Layout,
  type Tile,
} from "./tiles";

const TEXT_MARGIN_PX = 8;
const BLOCKER_REFRESH_MS = 250;
const CARD_EVERY_MS = 15000;
const CARD_EVERY_JITTER_MS = 10000;
const CARD_COOLDOWN_MS = 9000;
const CARD_ON_MOVE_CHANCE = 0.3;

interface Timed {
  id: number;
  until: number;
}

interface Props {
  /** The page content the tiles sit behind; its text, media and controls are never covered. */
  contentRef: React.RefObject<HTMLElement | null>;
}

function createTileElement(tile: Tile): HTMLElement {
  const px = tile.size * CELL_PX;
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${tile.col * CELL_PX}px;top:${tile.row * CELL_PX}px;width:${px}px;height:${px}px;transform:scale(0.55);transform-origin:center;`;
  if (tile.src) {
    const img = document.createElement("img");
    img.src = tile.src;
    img.alt = "";
    img.draggable = false;
    img.style.cssText = "display:block;width:100%;height:100%;";
    el.appendChild(img);
  } else {
    el.textContent = tile.char ?? "";
    el.style.cssText += `color:${tile.color};font:700 13px/16px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;text-align:center;`;
  }
  return el;
}

/** Spotify Technology style tile grid that lives behind the page and stays out from under text. */
const PixelGrid = ({ contentRef }: Props) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const layerRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const [cardTrigger, setCardTrigger] = useState<CardTrigger>({ count: 0 });

  useEffect(() => {
    const id = window.setTimeout(() => setCardTrigger({ count: 1 }), 900);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    const tileHost = tilesRef.current;
    const content = contentRef.current;
    if (!layer || !tileHost || !content) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const palette = PALETTES[mode];
    let layout: Layout | null = null;
    let blocked = new Uint8Array(0);
    let blockers: DocRect[] = [];
    const elements = new Map<number, HTMLElement>();
    let active = new Set<number>();
    let pointer = { x: 0, y: 0, inside: false };
    let lastPointer = { x: 0, y: 0 };
    let lingering: Timed[] = [];
    let ambient: Timed[] = [];
    let previousCursorIds = new Set<number>();
    let relayoutPending = false;
    let refreshTimer = 0;
    let idleTimer = 0;
    let relayoutTimer = 0;
    let blipTimer = 0;
    let ambientTimer = 0;
    let blockerTimer = 0;
    let cardTimer = 0;
    let lastCardAt = performance.now();
    let pointerResting = true;
    let lastBlockerRefresh = 0;

    const gridSize = () => ({
      cols: Math.floor(layer.clientWidth / CELL_PX),
      rows: Math.floor(layer.clientHeight / CELL_PX),
    });

    const layerOrigin = () => {
      const r = layer.getBoundingClientRect();
      return { left: r.left + window.scrollX, top: r.top + window.scrollY };
    };

    const maskFor = (cols: number, rows: number) => {
      const mask = new Uint8Array(cols > 0 && rows > 0 ? cols * rows : 0);
      const origin = layerOrigin();
      for (const b of blockers) {
        const c0 = Math.max(
          0,
          Math.floor((b.left - TEXT_MARGIN_PX - origin.left) / CELL_PX),
        );
        const r0 = Math.max(
          0,
          Math.floor((b.top - TEXT_MARGIN_PX - origin.top) / CELL_PX),
        );
        const c1 = Math.min(
          cols - 1,
          Math.floor((b.right + TEXT_MARGIN_PX - origin.left) / CELL_PX),
        );
        const r1 = Math.min(
          rows - 1,
          Math.floor((b.bottom + TEXT_MARGIN_PX - origin.top) / CELL_PX),
        );
        for (let r = r0; r <= r1; r += 1)
          for (let c = c0; c <= c1; c += 1) mask[r * cols + c] = 1;
      }
      return mask;
    };

    const liveZones = (): CellZone[] => {
      if (!layout) return [];
      const base = layer.getBoundingClientRect();
      const zones: CellZone[] = [];
      layer.querySelectorAll(`[${PIXEL_EXCLUDE_ATTR}]`).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || !layout) return;
        zones.push({
          c0: Math.floor((r.left - base.left) / CELL_PX) - 1,
          r0: Math.floor((r.top - base.top) / CELL_PX) - 1,
          c1: Math.floor((r.right - base.left) / CELL_PX) + 1,
          r1: Math.floor((r.bottom - base.top) / CELL_PX) + 1,
        });
      });
      return zones;
    };

    const isClear = (id: number, zones: CellZone[]) => {
      const t = layout?.tiles[id];
      if (!t || !layout) return false;
      for (let r = 0; r < t.size; r += 1)
        for (let c = 0; c < t.size; c += 1)
          if (blocked[(t.row + r) * layout.cols + t.col + c]) return false;
      return zones.every(
        (z) =>
          t.col > z.c1 ||
          t.col + t.size - 1 < z.c0 ||
          t.row > z.r1 ||
          t.row + t.size - 1 < z.r0,
      );
    };

    const isOnScreen = (t: Tile) => {
      const top = layer.getBoundingClientRect().top + t.row * CELL_PX;
      return top + t.size * CELL_PX > 0 && top < window.innerHeight;
    };

    const setActive = (ids: Set<number>) => {
      for (const id of active) {
        if (ids.has(id)) continue;
        elements.get(id)?.remove();
        elements.delete(id);
      }
      for (const id of ids) {
        if (elements.has(id) || !layout) continue;
        const el = createTileElement(layout.tiles[id]);
        tileHost.appendChild(el);
        el.getBoundingClientRect();
        el.style.transition = "transform 320ms ease-out";
        el.style.transform = "scale(1)";
        elements.set(id, el);
      }
      active = ids;
    };

    const update = () => {
      const now = performance.now();
      let cursorIds: number[] = [];
      if (layout && pointer.inside && layout.cols && layout.rows) {
        const base = layer.getBoundingClientRect();
        const x = pointer.x - base.left;
        const y = pointer.y - base.top;
        if (x >= 0 && y >= 0 && x < base.width && y < base.height) {
          const col = Math.min(layout.cols - 1, Math.floor(x / CELL_PX));
          const row = Math.min(layout.rows - 1, Math.floor(y / CELL_PX));
          cursorIds = tilesAround(layout, col, row);
        }
      }
      const zones = liveZones();
      cursorIds = cursorIds.filter((id) => isClear(id, zones));
      const cursorSet = new Set(cursorIds);

      lingering = lingering.filter(
        (t) => t.until > now && !cursorSet.has(t.id) && isClear(t.id, zones),
      );
      for (const id of previousCursorIds)
        if (!cursorSet.has(id) && isClear(id, zones))
          lingering.push({ id, until: now + 420 });
      previousCursorIds = cursorSet;

      const ids = [...cursorIds];
      let nextExpiry = Infinity;
      for (const t of lingering) {
        ids.push(t.id);
        nextExpiry = Math.min(nextExpiry, t.until);
      }
      ambient = ambient.filter((t) => t.until > now && isClear(t.id, zones));
      for (const t of ambient) {
        ids.push(t.id);
        nextExpiry = Math.min(nextExpiry, t.until);
      }

      window.clearTimeout(refreshTimer);
      if (nextExpiry < Infinity)
        refreshTimer = window.setTimeout(
          update,
          Math.max(0, nextExpiry - now) + 16,
        );
      setActive(new Set(ids));
    };

    const relayout = () => {
      const { cols, rows } = gridSize();
      blocked = maskFor(cols, rows);
      layout = buildLayout(cols, rows, blocked, palette);
      lingering = [];
      ambient = [];
      previousCursorIds = new Set();
      window.clearTimeout(refreshTimer);
      relayoutPending = false;
      setActive(new Set());
      update();
    };

    const refreshBlockers = () => {
      window.clearTimeout(blockerTimer);
      blockerTimer = 0;
      lastBlockerRefresh = performance.now();
      blockers = collectBlockers(content, layer);
      const { cols, rows } = gridSize();
      if (!layout || layout.cols !== cols || layout.rows !== rows)
        return relayout();
      blocked = maskFor(cols, rows);
      update();
    };

    const scheduleBlockerRefresh = () => {
      if (blockerTimer) return;
      const wait = Math.max(
        0,
        BLOCKER_REFRESH_MS - (performance.now() - lastBlockerRefresh),
      );
      blockerTimer = window.setTimeout(() => {
        blockerTimer = 0;
        refreshBlockers();
      }, wait);
    };

    const canRunAmbient = () => !document.hidden;

    const scheduleAmbient = () => {
      window.clearTimeout(ambientTimer);
      if (!canRunAmbient()) return;
      ambientTimer = window.setTimeout(
        () => {
          if (!canRunAmbient()) return;
          if (!relayoutPending && layout && layout.tiles.length > 0) {
            const zones = liveZones();
            const candidates = layout.tiles.filter(
              (t) => !active.has(t.id) && isOnScreen(t) && isClear(t.id, zones),
            );
            let picked: number[] = [];
            if (candidates.length > 0 && Math.random() < 0.35) {
              const count = 2 + Math.floor(Math.random() * 3);
              picked = growCluster(
                layout,
                pick(candidates).id,
                count,
                active,
              ).filter((id) => isClear(id, zones));
            }
            if (picked.length < 2) {
              picked = [];
              const count = 1 + Math.floor(Math.random() * 2);
              for (let i = 0; i < count && candidates.length > 0; i += 1)
                picked.push(
                  candidates.splice(
                    Math.floor(Math.random() * candidates.length),
                    1,
                  )[0].id,
                );
            }
            const now = performance.now();
            const duration = 2000 * (0.7 + 0.6 * Math.random());
            for (const id of picked)
              ambient.push({
                id,
                until: now + duration * (0.9 + 0.2 * Math.random()),
              });
            update();
          }
          scheduleAmbient();
        },
        1000 + 1500 * Math.random(),
      );
    };

    const syncAmbient = () =>
      canRunAmbient() ? scheduleAmbient() : window.clearTimeout(ambientTimer);

    const scheduleBlip = () => {
      window.clearTimeout(blipTimer);
      blipTimer = window.setTimeout(blip, 800 + 1000 * Math.random());
    };

    const scheduleRelayout = (resumeBlips: boolean) => {
      window.clearTimeout(relayoutTimer);
      relayoutPending = true;
      const now = performance.now();
      let delay = 520;
      for (const t of ambient) delay = Math.max(delay, t.until - now + 50);
      relayoutTimer = window.setTimeout(() => {
        relayout();
        if (resumeBlips) scheduleBlip();
        syncAmbient();
      }, delay);
    };

    function blip() {
      const angle = Math.random() * Math.PI * 2;
      const dist = 24 * Math.random();
      pointer = {
        x: lastPointer.x + Math.cos(angle) * dist,
        y: lastPointer.y + Math.sin(angle) * dist,
        inside: true,
      };
      update();
      blipTimer = window.setTimeout(() => {
        pointer.inside = false;
        update();
        scheduleRelayout(true);
      }, 300);
    }

    const pointerExit = (resumeBlips: boolean) => {
      pointer.inside = false;
      update();
      scheduleRelayout(resumeBlips);
    };

    const scheduleCard = () => {
      window.clearTimeout(cardTimer);
      cardTimer = window.setTimeout(
        () => (document.hidden ? scheduleCard() : showCard()),
        CARD_EVERY_MS + CARD_EVERY_JITTER_MS * Math.random(),
      );
    };

    const showCard = (near?: { x: number; y: number }) => {
      lastCardAt = performance.now();
      setCardTrigger((t) => ({ count: t.count + 1, near }));
      scheduleCard();
    };

    let pointerOnPage = false;
    const leavePage = () => {
      pointerResting = true;
      if (!pointerOnPage) return;
      pointerOnPage = false;
      window.clearTimeout(idleTimer);
      window.clearTimeout(blipTimer);
      pointerExit(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (
        Math.abs(e.clientX - lastPointer.x) < 1 &&
        Math.abs(e.clientY - lastPointer.y) < 1
      )
        return;
      pointerOnPage = true;
      if (pointerResting) {
        pointerResting = false;
        if (
          performance.now() - lastCardAt >= CARD_COOLDOWN_MS &&
          Math.random() < CARD_ON_MOVE_CHANCE
        )
          showCard({ x: e.clientX, y: e.clientY });
      }
      lastPointer = { x: e.clientX, y: e.clientY };
      pointer = { ...lastPointer, inside: true };
      window.clearTimeout(relayoutTimer);
      relayoutPending = false;
      window.clearTimeout(blipTimer);
      update();
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        pointerResting = true;
        pointerExit(true);
      }, 600);
    };

    const onWindowMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) leavePage();
    };

    const sizeObserver = new ResizeObserver(scheduleBlockerRefresh);
    const mutationObserver = new MutationObserver((records) => {
      if (records.some((r) => !layer.contains(r.target)))
        scheduleBlockerRefresh();
    });

    refreshBlockers();
    sizeObserver.observe(layer);
    sizeObserver.observe(content);
    mutationObserver.observe(content, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mouseout", onWindowMouseOut);
    document.addEventListener("visibilitychange", syncAmbient);
    document.fonts?.ready.then(scheduleBlockerRefresh);
    syncAmbient();
    scheduleCard();

    return () => {
      [
        refreshTimer,
        idleTimer,
        relayoutTimer,
        blipTimer,
        ambientTimer,
        blockerTimer,
        cardTimer,
      ].forEach((t) => window.clearTimeout(t));
      sizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mouseout", onWindowMouseOut);
      document.removeEventListener("visibilitychange", syncAmbient);
      elements.forEach((el) => el.remove());
    };
  }, [contentRef, mode]);

  return (
    <Box
      ref={layerRef}
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: -1,
        "@media (prefers-reduced-motion: reduce)": { display: "none" },
      }}
    >
      <Box ref={tilesRef} sx={{ position: "absolute", inset: 0 }} />
      <CodeCard
        trigger={cardTrigger}
        layerRef={layerRef}
        contentRef={contentRef}
      />
    </Box>
  );
};

export default PixelGrid;
