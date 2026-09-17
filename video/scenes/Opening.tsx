import { interpolate, useCurrentFrame } from "remotion";

import { SECTIONS } from "@/lib/sections";

import { Layer } from "../components/Layer";
import { Sidebar } from "../components/Sidebar";
import type { Cue } from "../components/SoundTrack";
import type { CameraKey } from "../lib/camera";
import { navId } from "../lib/content";
import { departureOf, type Waypoint } from "../lib/dot";
import { CENTRE, OPENING, PAN, ROLL_CALL } from "../timeline";
import { DEPART } from "./Ending";

export const DOT_APPEARS = OPENING.from + 30;

// Two hops to the right through empty space, the camera trailing behind,
// before the sidebar slides in and the dot settles on Index.
const HOP = 180;
const HOPS = [
  { at: OPENING.from + 85, x: CENTRE.x + HOP },
  { at: OPENING.from + 135, x: CENTRE.x + HOP * 2 },
];
const LAND_INDEX = ROLL_CALL.from;
const INDEX_FLIGHT = 40;

// The section headers, top to bottom, one beat each.
const FIRST_SECTION = LAND_INDEX + 45;
const BEAT = 45;

// Alone on the screen the dot is drawn bigger, and shrinks to its nav
// size on the way in to Index.
const BIG = 11;
const HOP_BOW = 90;

export const openingWaypoints: Waypoint[] = [
  { at: OPENING.from, target: CENTRE, color: "foreground", size: BIG },
  ...HOPS.map((hop) => ({
    at: hop.at,
    target: { x: hop.x, y: CENTRE.y },
    color: "foreground" as const,
    size: BIG,
    bow: HOP_BOW,
    sound: "tick" as const,
    volume: 0.35,
  })),
  {
    at: LAND_INDEX,
    target: navId.page("index"),
    color: "foreground",
    flight: INDEX_FLIGHT,
    bow: 50,
    sound: "tick",
  },
  ...SECTIONS.map((section, i) => ({
    at: FIRST_SECTION + i * BEAT,
    target: navId.section(section),
    color: section,
    sound: "hover" as const,
    // A gentle rise down the list, twice the site's per-row step so the
    // seven beats read as a scale.
    detune: i * 50,
  })),
];

export const openingCues: Cue[] = [{ at: DOT_APPEARS + 2, name: "tick" }];

// The camera sets off a beat after the dot and glides a little longer, so
// each hop reads as the dot moving before the world catches up.
const follow = (w: Waypoint, x: number): CameraKey => ({
  at: w.at + 24,
  duration: (w.flight ?? 21) + 32,
  x,
  y: 0,
});

export const openingCamera: CameraKey[] = [
  { at: 0, x: 0, y: 0 },
  follow(openingWaypoints[1], HOP),
  follow(openingWaypoints[2], HOP * 2),
  follow(openingWaypoints[3], PAN),
];

const SIDEBAR_IN = departureOf(openingWaypoints[3]) - 6;
const SIDEBAR_OUT = DEPART + 6;

export function Opening() {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const opacity = interpolate(
    frame,
    [SIDEBAR_IN, SIDEBAR_IN + 30, SIDEBAR_OUT, SIDEBAR_OUT + 34],
    [0, 1, 1, 0],
    clamp
  );
  // Ditched to the right as the dot heads the other way.
  const slide = interpolate(frame, [SIDEBAR_OUT, SIDEBAR_OUT + 34], [0, 70], {
    ...clamp,
    easing: (t) => t * t,
  });
  const scene = {
    from: OPENING.from,
    duration: SIDEBAR_OUT + 40 - OPENING.from,
  };
  return (
    <Layer scene={scene}>
      <Sidebar
        waypoints={openingWaypoints}
        style={{ opacity, transform: `translateX(${slide}px)` }}
      />
    </Layer>
  );
}
