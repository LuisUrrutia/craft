import { Composition } from "remotion";

import "./styles.css";
import "./fonts";
import { CraftVideo } from "./CraftVideo";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./timeline";

export function Root() {
  return (
    <Composition
      id="Craft"
      component={CraftVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
}
