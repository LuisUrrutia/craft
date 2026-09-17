import { useRef } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { Dot } from "./components/Dot";
import { cuesFromWaypoints, SoundTrack, type Cue } from "./components/SoundTrack";
import { AnchorProvider } from "./lib/anchors";
import { cameraAt, type CameraKey } from "./lib/camera";
import type { Waypoint } from "./lib/dot";
import {
  DOT_VANISH,
  Ending,
  endingCamera,
  endingWaypoints,
} from "./scenes/Ending";
import {
  Opening,
  openingCamera,
  openingCues,
  openingWaypoints,
} from "./scenes/Opening";
import {
  DEPART,
  DOT_APPEARS,
  IMPACT,
  ROLL_CALL,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  STAGE_ZOOM,
  TAGLINE,
  TOTAL_FRAMES,
} from "./timeline";

// The dot's whole journey, in order.
export const WAYPOINTS: Waypoint[] = [
  ...openingWaypoints,
  ...endingWaypoints,
];

const CAMERA: CameraKey[] = [...openingCamera, ...endingCamera];

const CUES: Cue[] = [
  ...cuesFromWaypoints(WAYPOINTS),
  ...openingCues,
  { at: IMPACT + 1, name: "glitch" },
];

// While the dot works down the list the camera drifts a few pixels, too
// slowly to see as movement, just enough that the frame is never still.
const DRIFT = 5;

/**
 * Everything is laid out on one wide world and a camera pans over it. The
 * world div is the anchor registry's reference, so anchors and the dot are
 * in world coordinates and never notice the pan.
 */
export function CraftVideo() {
  const frame = useCurrentFrame();
  const worldRef = useRef<HTMLDivElement>(null);
  const camera = cameraAt(CAMERA, frame);
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const drift = interpolate(
    frame,
    [ROLL_CALL.from, DEPART, IMPACT],
    [0, DRIFT, 0],
    clamp
  );
  // The last shot gets a little more weight than the roll call: a faint
  // vignette and a slow warm tint.
  const vignette = interpolate(frame, [IMPACT, IMPACT + 90], [0, 1], clamp);
  const warmth = interpolate(frame, [TAGLINE, TOTAL_FRAMES], [0, 0.22], clamp);

  return (
    <AbsoluteFill>
      <div
        className="stage relative overflow-hidden bg-background font-sans text-foreground antialiased"
        style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, zoom: STAGE_ZOOM }}
      >
        <div
          ref={worldRef}
          className="absolute inset-0"
          style={{
            transform: `translate(${-camera.x}px, ${-(camera.y + drift)}px)`,
          }}
        >
          <AnchorProvider stageRef={worldRef}>
            <Opening />
            <Ending />
            <Dot
              waypoints={WAYPOINTS}
              appear={DOT_APPEARS}
              vanish={DOT_VANISH}
            />
          </AnchorProvider>
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: vignette,
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.035) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{ opacity: warmth, background: "#f7f1e8" }}
        />
      </div>
      <SoundTrack cues={CUES} frames={TOTAL_FRAMES} />
    </AbsoluteFill>
  );
}
