import { Audio, Sequence, staticFile } from "remotion";

import type { SoundName, Waypoint } from "../lib/dot";

export type Cue = {
  at: number;
  name: SoundName;
  detune?: number;
  volume?: number;
};

// The WAVs are normalised to a common peak (video/scripts/render-sounds.ts),
// so the relative loudness of the site's patch is restored here.
const LEVEL: Record<SoundName, number> = {
  tick: 0.55,
  hover: 0.2,
  pop: 0.5,
  success: 0.6,
  toggle: 0.5,
  glitch: 0.16,
};

// A near-silent bed under everything, so the cues never sit on digital
// silence. Rendered by the same script as the cues.
const ROOM_LEVEL = 0.05;

export function cuesFromWaypoints(waypoints: Waypoint[]): Cue[] {
  return waypoints
    .filter((w) => w.sound)
    .map((w) => ({
      at: w.at,
      name: w.sound!,
      detune: w.detune,
      volume: w.volume,
    }));
}

export function SoundTrack({
  cues,
  frames,
}: {
  cues: Cue[];
  /** Length of the room-tone bed. */
  frames: number;
}) {
  return (
    <>
      <Sequence from={0} durationInFrames={frames} layout="none">
        <Audio src={staticFile("sounds/room.wav")} volume={ROOM_LEVEL} loop />
      </Sequence>
      {cues.map((cue, i) => (
        <Sequence key={i} from={cue.at} durationInFrames={60} layout="none">
          <Audio
            src={staticFile(`sounds/${cue.name}.wav`)}
            volume={cue.volume ?? LEVEL[cue.name]}
            playbackRate={Math.pow(2, (cue.detune ?? 0) / 1200)}
          />
        </Sequence>
      ))}
    </>
  );
}
