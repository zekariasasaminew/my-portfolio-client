/** Elements marked with this attribute keep tiles from appearing underneath them. */
export const PIXEL_EXCLUDE_ATTR = "data-pixel-exclude";

const MEDIA_SELECTOR = `img,svg,video,canvas,iframe,input,textarea,select,button,[role="img"],[${PIXEL_EXCLUDE_ATTR}]`;

/** A rectangle in document coordinates (independent of scroll position). */
export interface DocRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function isPanel(el: Element): boolean {
  const style = getComputedStyle(el);
  if (style.backgroundImage !== "none") return true;
  if (!/^(transparent|rgba\(.*,\s*0\))$/.test(style.backgroundColor))
    return true;
  return (["Top", "Right", "Bottom", "Left"] as const).some(
    (side) =>
      parseFloat(style[`border${side}Width`]) > 0 &&
      style[`border${side}Style`] !== "none" &&
      !/^(transparent|rgba\(.*,\s*0\))$/.test(style[`border${side}Color`]),
  );
}

/**
 * Every line box of visible text, plus media, controls and panels (anything
 * with a visible background or border) under `root`, skipping anything inside
 * `ignore` (the tile layer itself).
 */
export function collectBlockers(root: HTMLElement, ignore: Element): DocRect[] {
  const sx = window.scrollX;
  const sy = window.scrollY;
  const rects: DocRect[] = [];
  const push = (r: DOMRect) => {
    if (r.width && r.height)
      rects.push({
        left: r.left + sx,
        top: r.top + sy,
        right: r.right + sx,
        bottom: r.bottom + sy,
      });
  };

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      ignore.contains(node) || !node.textContent?.trim()
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  });
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) push(r);
  }

  root.querySelectorAll("*").forEach((el) => {
    if (
      ignore.contains(el) ||
      (el instanceof SVGElement && !(el instanceof SVGSVGElement))
    )
      return;
    if (el.matches(MEDIA_SELECTOR) || isPanel(el))
      push(el.getBoundingClientRect());
  });
  return rects;
}
