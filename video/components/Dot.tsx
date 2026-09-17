import { useCurrentFrame } from "remotion";

import { dotColorFrom, dotColorTo } from "@/components/app/section-icon";
import { cn } from "@/lib/utils";

import { useAnchorRegistry } from "../lib/anchors";
import { dotState, type Waypoint } from "../lib/dot";

/**
 * The nav's active dot, freed from the sidebar. One instance lives above
 * every scene and follows the composition-wide waypoint list.
 */
export function Dot({
  waypoints,
  appear,
}: {
  waypoints: Waypoint[];
  /** Frame the dot pops in at the first waypoint. */
  appear: number;
}) {
  const frame = useCurrentFrame();
  const { map } = useAnchorRegistry();
  const state = dotState(waypoints, frame, map);
  if (!state || frame < appear) return null;

  // Pop in: a quick overshoot so the dot reads as arriving, not fading.
  const born = Math.min(1, (frame - appear) / 12);
  const pop = born < 1 ? 1 + 0.6 * Math.sin(born * Math.PI) * (1 - born) : 1;
  const scale = born * pop;

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
        transform: `scale(${scale})`,
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
