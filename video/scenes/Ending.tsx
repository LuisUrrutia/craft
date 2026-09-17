import { interpolate, useCurrentFrame } from "remotion";

import { SITE_DESCRIPTION } from "@/lib/site";

import { Layer } from "../components/Layer";
import { Wordmark } from "../components/Wordmark";
import type { CameraKey } from "../lib/camera";
import type { Waypoint } from "../lib/dot";
import { enter } from "../lib/ease";
import { ENDING, PAN, STAGE_HEIGHT, STAGE_WIDTH } from "../timeline";

const FLIGHT = 60;
const IMPACT = ENDING.from + 80;
/** Frame the dot leaves the sidebar. */
export const DEPART = IMPACT - FLIGHT;
const TAGLINE = IMPACT + 75;
const URL_AT = TAGLINE + 30;

// The wordmark sits one screen below the sidebar; the camera pans down to
// it as the dot flies.
const CAMERA = { x: PAN, y: STAGE_HEIGHT * 0.8 };

export const endingWaypoints: Waypoint[] = [
  {
    at: IMPACT,
    target: "wordmark:dot",
    color: "foreground",
    flight: FLIGHT,
    bow: 80,
    size: 9,
    sound: "tick",
  },
];

export const endingCamera: CameraKey[] = [
  { ...CAMERA, at: IMPACT, duration: FLIGHT + 8 },
];

export function Ending() {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const wordIn = interpolate(frame, [IMPACT - 30, IMPACT - 6], [0, 1], clamp);
  const tagIn = interpolate(frame, [TAGLINE, TAGLINE + 16], [0, 1], clamp);
  const urlIn = interpolate(frame, [URL_AT, URL_AT + 16], [0, 1], clamp);

  return (
    <Layer scene={ENDING}>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          left: CAMERA.x,
          top: CAMERA.y,
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
        }}
      >
        <Wordmark
          sinceImpact={frame - IMPACT}
          className="text-7xl"
          style={{ opacity: wordIn }}
        />
        <p
          className="mt-5 text-xl text-muted-foreground"
          style={enter(tagIn, 6)}
        >
          {SITE_DESCRIPTION}
        </p>
      </div>
      {/* The URL sits well below the card, in the lower third of the frame. */}
      <p
        className="absolute text-center text-2xl font-medium text-foreground"
        style={{
          left: CAMERA.x,
          top: CAMERA.y + STAGE_HEIGHT - 150,
          width: STAGE_WIDTH,
          ...enter(urlIn, 6),
        }}
      >
        craft.gustavofior.com
      </p>
    </Layer>
  );
}
