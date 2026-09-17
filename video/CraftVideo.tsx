import { useRef } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

import { Dot } from "./components/Dot";
import { cuesFromWaypoints, SoundTrack, type Cue } from "./components/SoundTrack";
import { AnchorProvider } from "./lib/anchors";
import { cameraAt, type CameraKey } from "./lib/camera";
import type { Waypoint } from "./lib/dot";
import { Ending, endingCamera, endingWaypoints } from "./scenes/Ending";
import {
  DOT_APPEARS,
  Opening,
  openingCamera,
  openingCues,
  openingWaypoints,
} from "./scenes/Opening";
import { STAGE_HEIGHT, STAGE_WIDTH, STAGE_ZOOM } from "./timeline";

// The dot's whole journey, in order.
export const WAYPOINTS: Waypoint[] = [
  ...openingWaypoints,
  ...endingWaypoints,
];

const CAMERA: CameraKey[] = [...openingCamera, ...endingCamera];

const CUES: Cue[] = [
  ...cuesFromWaypoints(WAYPOINTS),
  ...openingCues,
];

/**
 * Everything is laid out on one wide world and a camera pans over it. The
 * world div is the anchor registry's reference, so anchors and the dot are
 * in world coordinates and never notice the pan.
 */
export function CraftVideo() {
  const frame = useCurrentFrame();
  const worldRef = useRef<HTMLDivElement>(null);
  const camera = cameraAt(CAMERA, frame);

  return (
    <AbsoluteFill>
      <div
        className="stage relative overflow-hidden bg-background font-sans text-foreground antialiased"
        style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, zoom: STAGE_ZOOM }}
      >
        <div
          ref={worldRef}
          className="absolute inset-0"
          style={{ transform: `translate(${-camera.x}px, ${-camera.y}px)` }}
        >
          <AnchorProvider stageRef={worldRef}>
            <Opening />
            <Ending />
            <Dot waypoints={WAYPOINTS} appear={DOT_APPEARS} />
          </AnchorProvider>
        </div>
      </div>
      <SoundTrack cues={CUES} />
    </AbsoluteFill>
  );
}
