import { Composition } from "remotion";

import "./styles.css";
import "./fonts";
import { CraftVideo } from "./CraftVideo";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./timeline";

const size = { fps: FPS, width: WIDTH, height: HEIGHT };

export function Root() {
  return (
    <>
      <Composition
        id="Craft"
        component={CraftVideo}
        durationInFrames={TOTAL_FRAMES}
        defaultProps={{ hops: true }}
        {...size}
      />
      {/* Same cut, opening straight on the sidebar with no hops. */}
      <Composition
        id="CraftDirect"
        component={CraftVideo}
        durationInFrames={TOTAL_FRAMES}
        defaultProps={{ hops: false }}
        {...size}
      />
    </>
  );
}
