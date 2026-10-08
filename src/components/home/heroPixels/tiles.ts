export const CELL_PX = 16;

/** Elements marked with this attribute keep tiles from appearing underneath them. */
export const HERO_EXCLUDE_ATTR = "data-hero-exclude";

export type TileSize = 1 | 3 | 6;
type Category = "brand" | "colour" | "glyph" | "pattern" | "grey";

export interface TileArt {
  src?: string;
  char?: string;
  color?: string;
}

export interface Tile extends TileArt {
  id: number;
  col: number;
  row: number;
  size: TileSize;
}

export interface Layout {
  cols: number;
  rows: number;
  tiles: Tile[];
  cellToTile: Int32Array;
}

export interface CellZone {
  c0: number;
  r0: number;
  c1: number;
  r1: number;
}

export interface Palette {
  colors: string[];
  neutral: string;
  ink: string;
}

export const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    colors: [
      "#1ED760",
      "#15BDFF",
      "#FFE938",
      "#F56031",
      "#0EFFD3",
      "#FF5CAD",
      "#A78BFA",
    ],
    neutral: "#CACACA",
    ink: "#121212",
  },
  light: {
    colors: [
      "#16C25A",
      "#0A9EE0",
      "#F2C200",
      "#F0531F",
      "#00C9A7",
      "#F2389A",
      "#8B6CF6",
    ],
    neutral: "#B9AE9F",
    ink: "#121212",
  },
};

const SIZES: TileSize[] = [1, 3, 6];
const SIZE_WEIGHT: Record<TileSize, number> = { 1: 1, 3: 1, 6: 2 };
const CATEGORY_WEIGHT: Record<TileSize, Partial<Record<Category, number>>> = {
  6: { grey: 0.5, pattern: 0.5 },
  3: { brand: 0.36, colour: 0.24, pattern: 0.4 },
  1: { brand: 0.48, colour: 0.32, glyph: 0.1, pattern: 0.05, grey: 0.05 },
};
const PATTERN_TINT_CHANCE = 0.65;
const GREY_TINT_CHANCE = 0.4;
const PATTERN_SCALE: Record<TileSize, number> = { 1: 1, 3: 3, 6: 2.5 };

const SHAPES: string[] = [
  `<circle cx="8" cy="8" r="5.14"/>`,
  `<rect x="2.86" y="2.86" width="10.28" height="10.28" rx="3"/>`,
  `<path d="M8 2.6 13.4 8 8 13.4 2.6 8Z"/>`,
  `<path d="M6.3 2.86h3.4v3.44h3.44v3.4H9.7v3.44H6.3V9.7H2.86V6.3H6.3Z"/>`,
  `<path d="M8 3.2 13.3 12.6H2.7Z"/>`,
  `<path d="M2.86 10.6a5.14 5.14 0 0 1 10.28 0Z"/>`,
  `<path d="M2.86 2.86H8a5.14 5.14 0 0 1 5.14 5.14v5.14H2.86Z"/>`,
  `<circle cx="8" cy="8" r="4" fill="none" stroke="INK" stroke-width="2.3"/>`,
  `<circle cx="5.4" cy="5.4" r="2.1"/><circle cx="10.6" cy="5.4" r="2.1"/><circle cx="5.4" cy="10.6" r="2.1"/><circle cx="10.6" cy="10.6" r="2.1"/>`,
  `<rect x="5" y="2.86" width="6" height="10.28" rx="3"/>`,
  `<path d="M8 2.6C8.6 6.4 9.6 7.4 13.4 8 9.6 8.6 8.6 9.6 8 13.4 7.4 9.6 6.4 8.6 2.6 8 6.4 7.4 7.4 6.4 8 2.6Z"/>`,
  `<rect x="3.3" y="7.2" width="2.3" height="5.9" rx="1.15"/><rect x="6.85" y="2.9" width="2.3" height="10.2" rx="1.15"/><rect x="10.4" y="5.3" width="2.3" height="7.8" rx="1.15"/>`,
  `<path d="M5 3.1 12.6 8 5 12.9Z"/>`,
  `<path d="M8 2.7 12.6 5.35v5.3L8 13.3 3.4 10.65v-5.3Z"/>`,
];

const GLYPHS = [
  "{",
  "}",
  "<",
  ">",
  "/",
  "#",
  "@",
  "?",
  "!",
  ";",
  "=",
  "*",
  "~",
  "$",
  "%",
  "&",
];

interface PatternDef {
  w: number;
  h: number;
  body: (c: string) => string;
}

const PATTERNS: PatternDef[] = [
  {
    w: 3,
    h: 3,
    body: (c) => `<path d="M1.5 0v3M0 1.5h3" stroke="${c}"/>`,
  },
  {
    w: 9.36,
    h: 9.36,
    body: (c) =>
      `<path d="M1.17 1.17 6.83 6.83M6.83 1.17 1.17 6.83" stroke="${c}" stroke-width="2"/>`,
  },
  {
    w: 8,
    h: 8,
    body: (c) =>
      `<rect width="4" height="4" fill="${c}"/><rect x="4" y="4" width="4" height="4" fill="${c}"/>`,
  },
  {
    w: 8,
    h: 8,
    body: (c) =>
      `<rect x="0.5" y="0.5" width="1" height="3" fill="${c}" stroke="${c}"/><rect x="2.5" y="4.5" width="5" height="3" fill="${c}" stroke="${c}"/>`,
  },
  {
    w: 4.6,
    h: 4.6,
    body: (c) => `<circle cx="2" cy="2" r="2" fill="${c}"/>`,
  },
  {
    w: 8,
    h: 8,
    body: (c) =>
      `<rect y="4" width="4" height="4" fill="${c}"/><rect x="4" width="4" height="4" fill="${c}"/><circle cx="2" cy="2" r="2" fill="${c}"/><circle cx="6" cy="6" r="2" fill="${c}"/>`,
  },
  {
    w: 5.6,
    h: 5.6,
    body: (c) =>
      `<path d="M-1 6.6 6.6-1M-1 1 1-1M4.6 6.6 6.6 4.6" stroke="${c}" stroke-width="2"/>`,
  },
  {
    w: 8,
    h: 8,
    body: (c) =>
      `<path d="M0 1h8" stroke="${c}" stroke-width="2"/><rect x="0" y="3.5" width="8" height="3" fill="${c}"/>`,
  },
  {
    w: 30,
    h: 3.85,
    body: (c) => {
      const wave =
        "M0 1.925C7.5 6.256 7.5 6.256 15 1.925 22.5-2.406 22.5-2.406 30 1.925";
      return [0, -3.85, 3.85]
        .map(
          (dy) =>
            `<path transform="translate(0 ${dy})" d="${wave}" fill="none" stroke="${c}" stroke-width="2"/>`,
        )
        .join("");
    },
  },
];

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function svgSrc(px: number, inner: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${px} ${px}">${inner}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function brandArt(size: TileSize, palette: Palette): TileArt {
  const px = size * CELL_PX;
  const shape = pick(SHAPES).split("INK").join(palette.ink);
  return {
    src: svgSrc(
      px,
      `<rect width="${px}" height="${px}" fill="${pick(palette.colors)}"/><g transform="scale(${px / 16})" fill="${palette.ink}">${shape}</g>`,
    ),
  };
}

function patternArt(size: TileSize, palette: Palette): TileArt {
  const px = size * CELL_PX;
  const def = pick(PATTERNS);
  const k = PATTERN_SCALE[size];
  const pw = def.w * k;
  const ph = def.h * k;
  const ox = ((px - pw) / 2) % pw;
  const oy = ((px - ph) / 2) % ph;
  const color =
    Math.random() < PATTERN_TINT_CHANCE
      ? pick(palette.colors)
      : palette.neutral;
  return {
    src: svgSrc(
      px,
      `<defs><pattern id="p" patternUnits="userSpaceOnUse" width="${pw}" height="${ph}" patternTransform="translate(${ox} ${oy})"><g transform="scale(${k})">${def.body(color)}</g></pattern></defs><rect width="${px}" height="${px}" fill="url(#p)"/>`,
    ),
  };
}

function artFor(category: Category, size: TileSize, palette: Palette): TileArt {
  const px = size * CELL_PX;
  switch (category) {
    case "brand":
      return brandArt(size, palette);
    case "colour":
      return {
        src: svgSrc(
          px,
          `<rect width="${px}" height="${px}" fill="${pick(palette.colors)}"/>`,
        ),
      };
    case "grey": {
      const fill =
        Math.random() < GREY_TINT_CHANCE
          ? pick(palette.colors)
          : palette.neutral;
      return {
        src: svgSrc(px, `<rect width="${px}" height="${px}" fill="${fill}"/>`),
      };
    }
    case "glyph":
      return {
        char: pick(GLYPHS),
        color: Math.random() < 0.5 ? pick(palette.colors) : palette.neutral,
      };
    case "pattern":
      return patternArt(size, palette);
  }
}

function pickCategory(size: TileSize): Category {
  const entries = Object.entries(CATEGORY_WEIGHT[size]) as [Category, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [category, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return category;
  }
  return entries[0][0];
}

function fits(
  occupied: Uint8Array,
  cols: number,
  rows: number,
  col: number,
  row: number,
  size: number,
): boolean {
  if (col + size > cols || row + size > rows) return false;
  if (size > 1 && (col % size !== 0 || row % size !== 0)) return false;
  if (Math.floor(col / 6) !== Math.floor((col + size - 1) / 6)) return false;
  if (Math.floor(row / 6) !== Math.floor((row + size - 1) / 6)) return false;
  for (let r = 0; r < size; r += 1)
    for (let c = 0; c < size; c += 1)
      if (occupied[(row + r) * cols + col + c]) return false;
  return true;
}

/** Fills the grid with a random hidden mosaic of tiles; cells inside `zones` stay empty. */
export function buildLayout(
  cols: number,
  rows: number,
  zones: CellZone[],
  palette: Palette,
): Layout {
  const cellCount = cols > 0 && rows > 0 ? cols * rows : 0;
  const occupied = new Uint8Array(cellCount);
  for (const z of zones)
    for (let r = z.r0; r <= z.r1; r += 1)
      for (let c = z.c0; c <= z.c1; c += 1) occupied[r * cols + c] = 1;

  const cellToTile = new Int32Array(cellCount).fill(-1);
  const tiles: Tile[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (occupied[row * cols + col] || Math.random() < 0.5) continue;
      const candidates = SIZES.filter((s) =>
        fits(occupied, cols, rows, col, row, s),
      );
      const totalWeight = candidates.reduce(
        (sum, s) => sum + SIZE_WEIGHT[s],
        0,
      );
      let size: TileSize = 1;
      let roll = Math.random() * totalWeight;
      for (const s of candidates) {
        roll -= SIZE_WEIGHT[s];
        if (roll <= 0) {
          size = s;
          break;
        }
      }
      if (!fits(occupied, cols, rows, col, row, size)) continue;
      if (size === 1 && Math.random() > 0.2) continue;

      const id = tiles.length;
      for (let r = 0; r < size; r += 1)
        for (let c = 0; c < size; c += 1) {
          const cell = (row + r) * cols + col + c;
          occupied[cell] = 1;
          cellToTile[cell] = id;
        }
      tiles.push({
        id,
        col,
        row,
        size,
        ...artFor(pickCategory(size), size, palette),
      });
    }
  }
  return { cols, rows, tiles, cellToTile };
}

function cellNoise(col: number, row: number): number {
  let n = (0x165667b1 * col + 0x27d4eb2f * row) | 0;
  n = Math.imul(n ^ (n >>> 13), 0x4bf19f61);
  n ^= n >>> 16;
  return ((n >>> 0) / 0x100000000) * 2 - 1;
}

/** Tile ids inside the wobbly blob the cursor reveals around (col, row). */
export function tilesAround(
  layout: Layout,
  col: number,
  row: number,
): number[] {
  const found: number[] = [];
  const seen = new Set<number>();
  for (
    let r = Math.max(0, row - 9);
    r <= Math.min(layout.rows - 1, row + 9);
    r += 1
  ) {
    for (
      let c = Math.max(0, col - 9);
      c <= Math.min(layout.cols - 1, col + 9);
      c += 1
    ) {
      const id = layout.cellToTile[r * layout.cols + c];
      if (id < 0 || seen.has(id)) continue;
      const tile = layout.tiles[id];
      const dx = tile.col + (tile.size - 1) / 2 - col;
      const dy = tile.row + (tile.size - 1) / 2 - row;
      const angle = Math.atan2(dy, dx);
      const radius =
        6 +
        0.55 * Math.sin(3 * angle) +
        0.32 * Math.cos(5 * angle + 0.6) +
        0.28 * cellNoise(tile.col, tile.row) -
        (tile.size - 1) * 0.3;
      if (dx * dx + dy * dy <= radius * radius) {
        seen.add(id);
        found.push(id);
      }
    }
  }
  return found;
}

function neighbours(layout: Layout, id: number): number[] {
  const tile = layout.tiles[id];
  const out = new Set<number>();
  const visit = (c: number, r: number) => {
    if (c < 0 || r < 0 || c >= layout.cols || r >= layout.rows) return;
    const other = layout.cellToTile[r * layout.cols + c];
    if (other >= 0 && other !== id) out.add(other);
  };
  for (let i = 0; i < tile.size; i += 1) {
    visit(tile.col + i, tile.row - 1);
    visit(tile.col + i, tile.row + tile.size);
    visit(tile.col - 1, tile.row + i);
    visit(tile.col + tile.size, tile.row + i);
  }
  return [...out];
}

/** Grows a cluster of touching tiles from `startId`, skipping ids in `exclude`. */
export function growCluster(
  layout: Layout,
  startId: number,
  count: number,
  exclude: Set<number>,
): number[] {
  const cluster = [startId];
  while (cluster.length < count) {
    const frontier = [
      ...new Set(cluster.flatMap((id) => neighbours(layout, id))),
    ].filter((id) => !cluster.includes(id) && !exclude.has(id));
    if (frontier.length === 0) break;
    cluster.push(pick(frontier));
  }
  return cluster;
}
