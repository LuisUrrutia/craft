import { interpolate, useCurrentFrame } from "remotion";

import { SECTIONS } from "@/lib/sections";

import { Layer } from "../components/Layer";
import { Sidebar } from "../components/Sidebar";
import type { Cue } from "../components/SoundTrack";
import type { CameraKey } from "../lib/camera";
import { navId } from "../lib/content";
import { departureOf, flightOf, type Waypoint } from "../lib/dot";
import { CENTRE, OPENING, PAN, ROLL_CALL } from "../timeline";
import { DEPART } from "./Ending";

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

const rollCall: Waypoint[] = [
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

// The camera sets off a beat after the dot and glides a little longer, so
// each hop reads as the dot moving before the world catches up.
const follow = (w: Waypoint, x: number): CameraKey => ({
  at: w.at + 24,
  duration: (w.flight ?? 21) + 32,
  x,
  y: 0,
});

export type OpeningPlan = {
  waypoints: Waypoint[];
  camera: CameraKey[];
  cues: Cue[];
  /** Frame the dot pops in. */
  dotAppears: number;
};

/**
 * With hops: the dot appears one screen to the left, hops twice through
 * empty space and the camera follows it to the sidebar. Without: the same
 * start, but the dot holds still on screen and the sidebar comes to it.
 */
export function planOpening(hops: boolean): OpeningPlan {
  if (!hops) {
    // The dot never seems to move: it flies dead straight to Index while
    // the camera tracks it exactly, so on screen the sidebar slides in
    // from the right to meet it. The dot appears late so it only sits
    // still for a short beat.
    // No tick as they meet: the first cue is the Craft header.
    const index: Waypoint = {
      ...rollCall[0],
      flight: 60,
      bow: 0,
      noTouch: true,
      sound: undefined,
    };
    const indexId = index.target as string;
    const dotAppears = departureOf(index) - 45;
    const waypoints: Waypoint[] = [
      { at: OPENING.from, target: CENTRE, color: "foreground", size: BIG },
      index,
      ...rollCall.slice(1),
    ];
    return {
      waypoints,
      // The camera rests where the sidebar is centred, and holds the dot
      // at Index's on-screen spot the whole way there.
      camera: [
        { at: 0, x: PAN, y: 0, track: indexId },
        {
          at: index.at,
          duration: flightOf(index),
          x: PAN,
          y: 0,
          track: indexId,
        },
      ],
      cues: [{ at: dotAppears + 2, name: "tick" }],
      dotAppears,
    };
  }
  const dotAppears = OPENING.from + 30;
  const waypoints: Waypoint[] = [
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
    ...rollCall,
  ];
  return {
    waypoints,
    camera: [
      { at: 0, x: 0, y: 0 },
      follow(waypoints[1], HOP),
      follow(waypoints[2], HOP * 2),
      follow(waypoints[3], PAN),
    ],
    cues: [{ at: dotAppears + 2, name: "tick" }],
    dotAppears,
  };
}

const SIDEBAR_IN = departureOf(rollCall[0]) - 6;
const SIDEBAR_OUT = DEPART + 6;

export function Opening({ waypoints }: { waypoints: Waypoint[] }) {
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
        waypoints={waypoints}
        style={{ opacity, transform: `translateX(${slide}px)` }}
      />
    </Layer>
  );
}
