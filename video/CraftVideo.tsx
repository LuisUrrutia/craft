import { useMemo, useRef, type RefObject } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

import { Dot } from "./components/Dot";
import { cuesFromWaypoints, SoundTrack, type Cue } from "./components/SoundTrack";
import { AnchorProvider, useAnchorRegistry } from "./lib/anchors";
import { cameraAt, type CameraKey } from "./lib/camera";
import { dotState, type Waypoint } from "./lib/dot";
import { Ending, endingCamera, endingWaypoints } from "./scenes/Ending";
import { Opening, planOpening } from "./scenes/Opening";
import { STAGE_HEIGHT, STAGE_WIDTH, STAGE_ZOOM } from "./timeline";

export type CraftVideoProps = {
  /** Open with the dot hopping in from the left, or already on the sidebar. */
  hops: boolean;
};

function plan(hops: boolean) {
  const opening = planOpening(hops);
  // The dot's whole journey, in order.
  const waypoints: Waypoint[] = [...opening.waypoints, ...endingWaypoints];
  const camera: CameraKey[] = [...opening.camera, ...endingCamera];
  const cues: Cue[] = [...cuesFromWaypoints(waypoints), ...opening.cues];
  return { waypoints, camera, cues, dotAppears: opening.dotAppears };
}

/**
 * The world div, translated by the camera. It lives inside the anchor
 * provider so the camera can read anchors and the dot's position, and it
 * is the provider's reference element, so anchors and the dot are in world
 * coordinates and never notice the pan.
 */
function World({
  worldRef,
  keys,
  waypoints,
  children,
}: {
  worldRef: RefObject<HTMLDivElement | null>;
  keys: CameraKey[];
  waypoints: Waypoint[];
  children: React.ReactNode;
}) {
  const frame = useCurrentFrame();
  const { map } = useAnchorRegistry();
  const dot = dotState(waypoints, frame, map);
  const camera = cameraAt(keys, frame, { anchors: map, dot });
  return (
    <div
      ref={worldRef}
      className="absolute inset-0"
      style={{ transform: `translate(${-camera.x}px, ${-camera.y}px)` }}
    >
      {children}
    </div>
  );
}

/** Everything is laid out on one wide world and a camera pans over it. */
export function CraftVideo({ hops }: CraftVideoProps) {
  const worldRef = useRef<HTMLDivElement>(null);
  const { waypoints, camera, cues, dotAppears } = useMemo(
    () => plan(hops),
    [hops]
  );

  return (
    <AbsoluteFill>
      <div
        className="stage relative overflow-hidden bg-background font-sans text-foreground antialiased"
        style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, zoom: STAGE_ZOOM }}
      >
        <AnchorProvider stageRef={worldRef}>
          <World worldRef={worldRef} keys={camera} waypoints={waypoints}>
            <Opening waypoints={waypoints} />
            <Ending />
            <Dot waypoints={waypoints} appear={dotAppears} />
          </World>
        </AnchorProvider>
      </div>
      <SoundTrack cues={cues} />
    </AbsoluteFill>
  );
}
