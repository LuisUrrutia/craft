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
};

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

export function SoundTrack({ cues }: { cues: Cue[] }) {
  return (
    <>
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
