// Every scene's start frame and length live here so the dot's waypoints,
// the camera, the sound track and the layers all count from the same numbers.
export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// The UI is laid out at this logical size and zoomed to fill the frame, so
// rem-based and px-based sizes from the site scale together.
export const STAGE_WIDTH = 1200;
export const STAGE_HEIGHT = 675;
export const STAGE_ZOOM = WIDTH / STAGE_WIDTH;
export const CENTRE = { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };

// The dot is a touch bigger than the site's 4px so it reads at 1080p.
export const DOT_SIZE = 7;

export const ms = (milliseconds: number) =>
  Math.round((milliseconds / 1000) * FPS);

export type Scene = { from: number; duration: number };

const scene = (from: number, duration: number): Scene => ({ from, duration });

// Dot appears alone, hops right, and the sidebar slides in to meet it.
export const OPENING = scene(0, 195);
// Index, then every section header, top to bottom.
export const ROLL_CALL = scene(195, 360);
// The sidebar is ditched to the right, the dot flies down to the wordmark.
export const ENDING = scene(555, 360);

export const TOTAL_FRAMES = ENDING.from + ENDING.duration;

// The world is wider than the stage: the sidebar sits one screen to the
// right of where the dot starts, and the camera pans over to it.
export const PAN = STAGE_WIDTH / 2;

// How early a scene mounts before its first frame, so its anchors are
// measured by the time the dot sets off towards them.
export const PREMOUNT = 40;
