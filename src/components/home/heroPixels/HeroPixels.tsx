import { Box, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import HeroCodeCard from "./HeroCodeCard";
import {
  CELL_PX,
  HERO_EXCLUDE_ATTR,
  PALETTES,
  buildLayout,
  growCluster,
  pick,
  tilesAround,
  type CellZone,
  type Layout,
  type Tile,
} from "./tiles";

interface Timed {
  id: number;
  until: number;
}

interface Props {
  /** The hero section; the effect covers the viewport down to where the next section starts. */
  heroRef: React.RefObject<HTMLElement | null>;
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

const HeroPixels = ({ heroRef }: Props) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const layerRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const [cardTrigger, setCardTrigger] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => setCardTrigger(1), 900);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    const tileHost = tilesRef.current;
    const hero = heroRef.current;
    if (!layer || !tileHost || !hero) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const palette = PALETTES[mode];
    let layout: Layout | null = null;
    const elements = new Map<number, HTMLElement>();
    let active = new Set<number>();
    let pointer = { x: 0, y: 0, inside: false };
    let lastPointer = { x: 0, y: 0 };
    let lingering: Timed[] = [];
    let ambient: Timed[] = [];
    let previousCursorIds = new Set<number>();
    let relayoutPending = false;
    let heroVisible = true;
    let refreshTimer = 0;
    let idleTimer = 0;
    let relayoutTimer = 0;
    let blipTimer = 0;
    let ambientTimer = 0;
    let scrollFrame = 0;

    const zonesFor = (cols: number, rows: number): CellZone[] => {
      if (cols <= 0 || rows <= 0) return [];
      const base = layer.getBoundingClientRect();
      const zones: CellZone[] = [];
      document.querySelectorAll(`[${HERO_EXCLUDE_ATTR}]`).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const c0 = Math.floor((r.left - base.left) / CELL_PX) - 1;
        const r0 = Math.floor((r.top - base.top) / CELL_PX) - 1;
        const c1 = Math.floor((r.right - base.left) / CELL_PX) + 1;
        const r1 = Math.floor((r.bottom - base.top) / CELL_PX) + 1;
        if (c1 < 0 || r1 < 0 || c0 >= cols || r0 >= rows) return;
        zones.push({
          c0: Math.max(0, c0),
          r0: Math.max(0, r0),
          c1: Math.min(cols - 1, c1),
          r1: Math.min(rows - 1, r1),
        });
      });
      return zones;
    };

    const currentZones = () =>
      layout ? zonesFor(layout.cols, layout.rows) : [];

    const isClear = (id: number, zones: CellZone[]) => {
      const t = layout?.tiles[id];
      if (!t) return false;
      return zones.every(
        (z) =>
          t.col > z.c1 ||
          t.col + t.size - 1 < z.c0 ||
          t.row > z.r1 ||
          t.row + t.size - 1 < z.r0,
      );
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
      const zones = currentZones();
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
      const cols = Math.floor(layer.clientWidth / CELL_PX);
      const rows = Math.floor(layer.clientHeight / CELL_PX);
      layout = buildLayout(cols, rows, zonesFor(cols, rows), palette);
      lingering = [];
      ambient = [];
      previousCursorIds = new Set();
      window.clearTimeout(refreshTimer);
      relayoutPending = false;
      setActive(new Set());
      update();
    };

    const canRunAmbient = () => heroVisible && !document.hidden;

    const scheduleAmbient = () => {
      window.clearTimeout(ambientTimer);
      if (!canRunAmbient()) return;
      ambientTimer = window.setTimeout(
        () => {
          if (!canRunAmbient()) return;
          if (!relayoutPending && layout && layout.tiles.length > 0) {
            const zones = currentZones();
            const candidates = layout.tiles.filter(
              (t) => !active.has(t.id) && isClear(t.id, zones),
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
        if (resumeBlips && heroVisible) scheduleBlip();
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

    const isOverLayer = (x: number, y: number) => {
      const base = layer.getBoundingClientRect();
      return (
        x >= base.left && x < base.right && y >= base.top && y < base.bottom
      );
    };

    let pointerOverHero = false;
    const leaveHero = () => {
      if (!pointerOverHero) return;
      pointerOverHero = false;
      window.clearTimeout(idleTimer);
      window.clearTimeout(blipTimer);
      pointerExit(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (!heroVisible || !isOverLayer(e.clientX, e.clientY))
        return leaveHero();
      if (
        Math.abs(e.clientX - lastPointer.x) < 1 &&
        Math.abs(e.clientY - lastPointer.y) < 1
      )
        return;
      pointerOverHero = true;
      lastPointer = { x: e.clientX, y: e.clientY };
      pointer = { ...lastPointer, inside: true };
      window.clearTimeout(relayoutTimer);
      relayoutPending = false;
      window.clearTimeout(blipTimer);
      update();
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => pointerExit(true), 600);
    };

    const onWindowMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) leaveHero();
    };

    const sizeLayer = () => {
      const edge = (hero.nextElementSibling ?? hero).getBoundingClientRect();
      const stageBottom =
        (hero.nextElementSibling ? edge.top : edge.bottom) + window.scrollY;
      layer.style.height = `${Math.min(window.innerHeight, Math.max(0, stageBottom))}px`;
    };

    const applyScroll = () => {
      scrollFrame = 0;
      const span = 0.45 * window.innerHeight;
      const fade = span <= 0 ? 1 : Math.max(0, 1 - window.scrollY / span);
      layer.style.opacity = String(fade);
      const visible = fade > 0.01;
      if (visible === heroVisible) return;
      heroVisible = visible;
      if (!visible) leaveHero();
      syncAmbient();
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(applyScroll);
    };

    const onResize = () => {
      sizeLayer();
      onScroll();
    };

    const resizeObserver = new ResizeObserver(() => {
      const cols = Math.floor(layer.clientWidth / CELL_PX);
      const rows = Math.floor(layer.clientHeight / CELL_PX);
      if (!layout || layout.cols !== cols || layout.rows !== rows) relayout();
    });

    const pageObserver = new ResizeObserver(sizeLayer);

    sizeLayer();
    applyScroll();
    resizeObserver.observe(layer);
    pageObserver.observe(document.body);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mouseout", onWindowMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", syncAmbient);
    syncAmbient();

    return () => {
      [refreshTimer, idleTimer, relayoutTimer, blipTimer, ambientTimer].forEach(
        (t) => window.clearTimeout(t),
      );
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      resizeObserver.disconnect();
      pageObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mouseout", onWindowMouseOut);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", syncAmbient);
      elements.forEach((el) => el.remove());
    };
  }, [heroRef, mode]);

  return (
    <Box
      ref={layerRef}
      aria-hidden
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: -1,
        "@media (prefers-reduced-motion: reduce)": { display: "none" },
      }}
    >
      <Box ref={tilesRef} sx={{ position: "absolute", inset: 0 }} />
      <HeroCodeCard trigger={cardTrigger} containerRef={layerRef} />
    </Box>
  );
};

export default HeroPixels;
