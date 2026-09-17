import { interpolate, spring } from "remotion";

import type { DotColor } from "@/components/app/section-icon";

import { DOT_SIZE, FPS, ms } from "../timeline";
import type { Point } from "./anchors";

export type SoundName = "tick" | "hover" | "pop" | "success" | "toggle";

export type Waypoint = {
  /** Frame the dot arrives (and "hits" whatever it lands on). */
  at: number;
  /** Anchor id, or an explicit stage position. */
  target: string | Point;
  color: DotColor;
  /** Flight length in frames; defaults to the site's 350ms. */
  flight?: number;
  /** How far the path bows out sideways, in stage px. Auto from distance. */
  bow?: number;
  /** Dot diameter in stage px while resting here. */
  size?: number;
  /** Cue to play on arrival. */
  sound?: SoundName;
  /** Cents, as in the site's progressionDetune. */
  detune?: number;
  volume?: number;
};

// Same numbers as src/components/app/sidebar-nav.tsx.
export const DOT_FLIGHT = ms(350);
export const DOT_IMPACT = 0.8;
export const DOT_SPRING = { stiffness: 800, damping: 52, mass: 1 };
export const DOT_ARC_MIN = 10;
export const DOT_ARC_MAX = 36;
export const DOT_ARC_PER_ROW = 3;
export const DOT_TOUCH_OFFSET = 5;
export const NAV_ROW = 24;

export const NAME_RECOIL = { stiffness: 1000, damping: 60, mass: 1 };
export const NAME_RETURN = { stiffness: 900, damping: 45, mass: 1 };

export const flightOf = (w: Waypoint) => w.flight ?? DOT_FLIGHT;
export const departureOf = (w: Waypoint) => w.at - flightOf(w);

function autoBow(distance: number) {
  const rows = distance / NAV_ROW;
  if (rows < 0.5) return 0;
  return Math.min(DOT_ARC_MAX, DOT_ARC_MIN + (rows - 1) * DOT_ARC_PER_ROW);
}

export function resolveTarget(
  target: Waypoint["target"],
  anchors: Map<string, Point>
): Point | null {
  if (typeof target !== "string") return target;
  return anchors.get(target) ?? null;
}

export type DotState = {
  x: number;
  y: number;
  size: number;
  from: DotColor;
  to: DotColor;
  /** 0..1 progress of the colour crossfade (1 = fully `to`). */
  blend: number;
  /** Index of the waypoint the dot is at or heading to. */
  index: number;
  /** True while in flight. */
  travelling: boolean;
};

export function dotState(
  waypoints: Waypoint[],
  frame: number,
  anchors: Map<string, Point>
): DotState | null {
  let index = -1;
  for (let i = 0; i < waypoints.length; i++) {
    if (frame >= departureOf(waypoints[i])) index = i;
  }
  if (index < 0) return null;

  const next = waypoints[index];
  const to = resolveTarget(next.target, anchors);
  if (!to) return null;
  const size = next.size ?? DOT_SIZE;

  if (index === 0 || frame >= next.at + flightOf(next)) {
    return {
      ...to,
      size,
      from: next.color,
      to: next.color,
      blend: 1,
      index,
      travelling: false,
    };
  }

  const prev = waypoints[index - 1];
  const from = resolveTarget(prev.target, anchors) ?? to;
  const flight = flightOf(next);
  const elapsed = frame - departureOf(next);
  const t = Math.min(1, elapsed / flight);

  // Along the straight line: a near-critically damped spring, like the
  // shared-layout projection on the site.
  const p = spring({
    frame: elapsed,
    fps: FPS,
    config: DOT_SPRING,
    durationInFrames: flight,
    durationRestThreshold: 0.001,
  });

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy) || 1;
  // Sideways unit vector. Vertical travel bows to the left of the screen,
  // horizontal travel bows upwards, so the arc always reads as "out".
  let nx = -dy / distance;
  let ny = dx / distance;
  if (Math.abs(dx) > Math.abs(dy) ? ny > 0 : nx > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bow = next.bow ?? autoBow(distance);
  const arc = interpolate(
    t,
    [0, 0.3, DOT_IMPACT, 1],
    [0, bow, -DOT_TOUCH_OFFSET, 0],
    { easing: (v) => 1 - (1 - v) * (1 - v) }
  );

  const prevSize = prev.size ?? DOT_SIZE;
  // Colour changes in the first half of the flight, so the dot already
  // wears its new section colour as it comes in to land.
  const blend = interpolate(t, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
    easing: (v) => 1 - (1 - v) * (1 - v),
  });

  return {
    x: from.x + dx * p + nx * arc,
    y: from.y + dy * p + ny * arc,
    size: prevSize + (size - prevSize) * p,
    from: prev.color,
    to: next.color,
    blend,
    index,
    travelling: true,
  };
}

/** The frame each anchor id is hit, for names that recoil on impact. */
export function impactsByTarget(waypoints: Waypoint[]) {
  const out = new Map<string, number[]>();
  for (const w of waypoints) {
    if (typeof w.target !== "string") continue;
    out.set(w.target, [...(out.get(w.target) ?? []), w.at]);
  }
  return out;
}

// The name starts moving a little before the site's impact point, so the
// shove reads as anticipation rather than a late reaction.
export const NAME_IMPACT = 0.6;

/** Frame the name the dot is heading for starts to give way. */
export const impactOf = (w: Waypoint) =>
  Math.round(departureOf(w) + flightOf(w) * NAME_IMPACT);

export type RestState = {
  /** Frame the dot hit this target (before the flight fully settles). */
  impact: number;
  /** Frame the dot left towards the next target, if it has. */
  left: number | null;
};

/** Where the dot is resting (or last rested) relative to a target. */
export function restOn(
  waypoints: Waypoint[],
  target: string,
  frame: number
): RestState | null {
  let state: RestState | null = null;
  for (let i = 0; i < waypoints.length; i++) {
    const w = waypoints[i];
    if (w.target !== target) continue;
    if (frame < departureOf(w)) break;
    const next = waypoints[i + 1];
    state = {
      impact: impactOf(w),
      left: next && frame >= departureOf(next) ? departureOf(next) : null,
    };
  }
  return state;
}

/** Horizontal shove of a name the dot has landed on, in px. */
export function nameShift(rest: RestState | null, frame: number, amount: number) {
  if (!rest) return 0;
  if (rest.left !== null) {
    const back = spring({
      frame: frame - rest.left,
      fps: FPS,
      config: NAME_RETURN,
    });
    return amount * (1 - back);
  }
  const push = spring({
    frame: frame - rest.impact,
    fps: FPS,
    config: NAME_RECOIL,
  });
  return amount * push;
}

/** Inline styles that replay the site's `name-hit` colour sweep per frame. */
export function nameHitStyle(
  rest: RestState | null,
  frame: number
): React.CSSProperties | undefined {
  if (!rest) return undefined;
  const t = (frame - rest.impact) / ms(1100);
  if (t < 0 || t > 1) return undefined;
  const eased = 1 - (1 - t) * (1 - t);
  const sweep = interpolate(eased, [0, 0.22], [0, 120], {
    extrapolateRight: "clamp",
  });
  const tint = interpolate(eased, [0.22, 1], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    color: "transparent",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    backgroundImage: `linear-gradient(to right, color-mix(in oklch, var(--dot-to) ${tint}%, var(--foreground)) ${sweep - 25}%, var(--foreground) ${sweep}%)`,
  };
}
