import { interpolate, useCurrentFrame } from "remotion";

import { dotColorFrom, dotColorTo } from "@/components/app/section-icon";
import { cn } from "@/lib/utils";

import { useAnchorRegistry } from "../lib/anchors";
import { dotState, type DotState, type Waypoint } from "../lib/dot";

// On landing the dot squashes against what it hit, then springs back.
const SQUASH_FRAMES = 5;
const SQUASH = 0.16;

// Ghost copies a few frames behind the dot, for the fast open-air hops.
const TRAIL = [
  { lag: 2, opacity: 0.3 },
  { lag: 4, opacity: 0.14 },
];

function Ball({
  state,
  transform,
  opacity,
}: {
  state: DotState;
  transform?: string;
  opacity?: number;
}) {
  const { x, y, size } = state;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-50"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        transform,
        opacity,
      }}
    >
      <span
        className={cn(
          "block size-full rounded-full",
          dotColorFrom[state.from],
          dotColorTo[state.to]
        )}
        style={{
          background: `color-mix(in oklch, var(--dot-to) ${
            state.blend * 100
          }%, var(--dot-from))`,
        }}
      />
    </div>
  );
}

/**
 * The nav's active dot, freed from the sidebar. One instance lives above
 * every scene and follows the composition-wide waypoint list.
 */
export function Dot({
  waypoints,
  appear,
  vanish,
}: {
  waypoints: Waypoint[];
  /** Frame the dot pops in at the first waypoint. */
  appear: number;
  /** The dot shrinks away over these frames, once it has become something. */
  vanish?: { at: number; over: number };
}) {
  const frame = useCurrentFrame();
  const { map } = useAnchorRegistry();
  const state = dotState(waypoints, frame, map);
  if (!state || frame < appear) return null;

  // Pop in: a quick overshoot so the dot reads as arriving, not fading.
  const born = Math.min(1, (frame - appear) / 12);
  const pop = born < 1 ? 1 + 0.6 * Math.sin(born * Math.PI) * (1 - born) : 1;
  let scale = born * pop;

  if (vanish) {
    scale *= interpolate(frame, [vanish.at, vanish.at + vanish.over], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => t * t,
    });
    if (scale === 0) return null;
  }

  // Squash on impact, across the axis of travel.
  const sinceHit = frame - state.arrived;
  let sx = 1;
  let sy = 1;
  if (state.index > 0 && sinceHit >= 0 && sinceHit < SQUASH_FRAMES) {
    const k = SQUASH * Math.sin((sinceHit / SQUASH_FRAMES) * Math.PI);
    if (state.axis === "y") {
      sy = 1 - k;
      sx = 1 + k;
    } else {
      sx = 1 - k;
      sy = 1 + k;
    }
  }

  const trail =
    state.travelling && waypoints[state.index]?.trail
      ? TRAIL.map((ghost) => ({
          ...ghost,
          state: dotState(waypoints, frame - ghost.lag, map),
        }))
      : [];

  return (
    <>
      {trail.map(
        (ghost) =>
          ghost.state?.travelling && (
            <Ball
              key={ghost.lag}
              state={ghost.state}
              opacity={ghost.opacity}
              transform={`scale(${scale * 0.9})`}
            />
          )
      )}
      <Ball
        state={state}
        transform={`scale(${scale * sx}, ${scale * sy})`}
      />
    </>
  );
}
