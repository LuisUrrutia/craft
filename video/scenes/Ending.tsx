import { interpolate, useCurrentFrame } from "remotion";

import { SITE_DESCRIPTION } from "@/lib/site";

import { Layer } from "../components/Layer";
import { Wordmark } from "../components/Wordmark";
import type { CameraKey } from "../lib/camera";
import type { Waypoint } from "../lib/dot";
import { enter } from "../lib/ease";
import {
  END_FLIGHT,
  ENDING,
  IMPACT,
  PAN,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  TAGLINE,
  URL_AT,
} from "../timeline";

// The wordmark sits one screen below the sidebar; the camera pans down to
// it as the dot flies.
const CAMERA = { x: PAN, y: STAGE_HEIGHT * 0.8 };

// After landing, the dot shrinks into the wordmark's full stop.
export const DOT_VANISH = { at: IMPACT + 6, over: 12 };

export const endingWaypoints: Waypoint[] = [
  {
    at: IMPACT,
    target: "wordmark:dot",
    color: "foreground",
    flight: END_FLIGHT,
    bow: 80,
    size: 9,
    sound: "tick",
    trail: true,
  },
];

export const endingCamera: CameraKey[] = [
  { ...CAMERA, at: IMPACT, duration: END_FLIGHT + 8 },
];

export function Ending() {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const wordIn = interpolate(frame, [IMPACT - 30, IMPACT - 6], [0, 1], clamp);
  const tagIn = interpolate(frame, [TAGLINE, TAGLINE + 16], [0, 1], clamp);
  const urlIn = interpolate(frame, [URL_AT, URL_AT + 16], [0, 1], clamp);
  // The real full stop comes up under the dot as the dot shrinks away.
  const stopIn = interpolate(
    frame,
    [DOT_VANISH.at, DOT_VANISH.at + DOT_VANISH.over],
    [0, 1],
    clamp
  );

  return (
    <Layer scene={ENDING}>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          left: CAMERA.x,
          top: CAMERA.y,
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          // Keep the block optically centred once the lines below are in.
          paddingTop: 40,
        }}
      >
        <Wordmark
          sinceImpact={frame - IMPACT}
          stopOpacity={stopIn}
          className="text-7xl"
          style={{ opacity: wordIn }}
        />
        <p
          className="mt-5 text-xl text-muted-foreground"
          style={enter(tagIn, 6)}
        >
          {SITE_DESCRIPTION}
        </p>
        <p
          className="mt-6 text-lg font-medium text-foreground"
          style={enter(urlIn, 6)}
        >
          craft.gustavofior.com
        </p>
      </div>
    </Layer>
  );
}
