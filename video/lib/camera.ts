import { interpolate } from "remotion";

import type { Point } from "./anchors";

export type CameraKey = Point & {
  /** Frame the camera comes to rest here. */
  at: number;
  /** Frames the move takes; defaults to a slow glide. */
  duration?: number;
};

const GLIDE = 56;
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Where the top-left of the frame sits in the world at `frame`. */
export function cameraAt(keys: CameraKey[], frame: number): Point {
  let at = { x: keys[0].x, y: keys[0].y };
  for (let i = 1; i < keys.length; i++) {
    const key = keys[i];
    const duration = key.duration ?? GLIDE;
    const start = key.at - duration;
    if (frame <= start) break;
    const t = interpolate(frame, [start, key.at], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: smooth,
    });
    const prev = keys[i - 1];
    at = { x: prev.x + (key.x - prev.x) * t, y: prev.y + (key.y - prev.y) * t };
  }
  return at;
}
