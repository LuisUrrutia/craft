import { interpolate, useCurrentFrame } from "remotion";

import { SECTIONS } from "@/lib/sections";

import { Layer } from "../components/Layer";
import { Sidebar } from "../components/Sidebar";
import type { Cue } from "../components/SoundTrack";
import type { CameraKey } from "../lib/camera";
import { navId } from "../lib/content";
import { departureOf, type Waypoint } from "../lib/dot";
import {
  CENTRE,
  DEPART,
  DOT_APPEARS,
  HOP_AT,
  LAND_INDEX,
  OPENING,
  PAN,
  SECTION_AT,
} from "../timeline";

// Two hops to the right through empty space, the camera trailing behind,
// before the sidebar slides in and the dot settles on Index.
const HOP = 180;
const INDEX_FLIGHT = 40;

// Alone on the screen the dot is drawn bigger, and shrinks to its nav
// size on the way in to Index.
const BIG = 11;
const HOP_BOW = 90;

// The hover cue climbs down the list, then holds and drops on the last
// header so the run resolves instead of trailing off.
const DETUNE = [0, 50, 100, 150, 200, 220, 80];

export const openingWaypoints: Waypoint[] = [
  { at: OPENING.from, target: CENTRE, color: "foreground", size: BIG },
  ...HOP_AT.map((at, i) => ({
    at,
    target: { x: CENTRE.x + HOP * (i + 1), y: CENTRE.y },
    color: "foreground" as const,
    size: BIG,
    bow: HOP_BOW,
    sound: "tick" as const,
    volume: 0.35,
    trail: true,
  })),
  {
    at: LAND_INDEX,
    target: navId.page("index"),
    color: "foreground",
    flight: INDEX_FLIGHT,
    bow: 50,
    sound: "tick",
    trail: true,
  },
  ...SECTIONS.map((section, i) => ({
    at: SECTION_AT[i],
    target: navId.section(section),
    color: section,
    sound: "hover" as const,
    detune: DETUNE[i] ?? 0,
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
  // Rows fade themselves in (see Sidebar); the block only fades out.
  const opacity =
    frame < SIDEBAR_IN
      ? 0
      : interpolate(frame, [SIDEBAR_OUT, SIDEBAR_OUT + 34], [1, 0], clamp);
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
        entry={SIDEBAR_IN}
        style={{ opacity, transform: `translateX(${slide}px)` }}
      />
    </Layer>
  );
}
