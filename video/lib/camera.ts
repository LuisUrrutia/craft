import { interpolate } from "remotion";

import type { Point } from "./anchors";

export type CameraKey = Point & {
  /** Frame the camera comes to rest here. */
  at: number;
  /** Frames the move takes; defaults to a slow glide. */
  duration?: number;
  /**
   * Follow the dot so it holds still on screen, at the spot this anchor
   * will occupy once the camera rests at `x`. Also allowed on the first
   * key, which then starts the dot at that spot.
   */
  track?: string;
};

export type CameraContext = {
  anchors: Map<string, Point>;
  dot: Point | null;
};

const GLIDE = 56;
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Where the top-left of the frame sits in the world at `frame`. */
export function cameraAt(
  keys: CameraKey[],
  frame: number,
  ctx?: CameraContext
): Point {
  // Camera x that keeps the dot where `key.track` will sit at rest.
  const tracked = (key: CameraKey) => {
    const anchor = key.track ? ctx?.anchors.get(key.track) : undefined;
    if (!anchor || !ctx?.dot) return key.x;
    return ctx.dot.x - (anchor.x - key.x);
  };
  let at = { x: keys[0].track ? tracked(keys[0]) : keys[0].x, y: keys[0].y };
  for (let i = 1; i < keys.length; i++) {
    const key = keys[i];
    const duration = key.duration ?? GLIDE;
    const start = key.at - duration;
    if (frame <= start) break;
    const prev = at;
    if (key.track && frame < key.at) {
      at = { x: tracked(key), y: prev.y };
      continue;
    }
    const t = interpolate(frame, [start, key.at], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: smooth,
    });
    at = {
      x: prev.x + (key.x - prev.x) * t,
      y: prev.y + (key.y - prev.y) * t,
    };
  }
  return at;
}
