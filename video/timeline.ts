// Every beat of the video lives here so the dot's waypoints, the camera,
// the sound track and the layers all count from the same numbers.
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

/* Opening: the dot appears alone, hops right, the sidebar slides in. */
export const DOT_APPEARS = 30;
export const HOP_AT = [85, 135];
export const LAND_INDEX = 195;

/* Roll call: Index, then each section header. The beats are not even: a
   longer first beat to let the sidebar register, tighter through the
   middle, then easing off before the last one. */
const SECTION_BEATS = [50, 44, 38, 36, 36, 40, 46];
export const SECTION_AT = SECTION_BEATS.reduce<number[]>(
  (at, beat) => [...at, (at[at.length - 1] ?? LAND_INDEX) + beat],
  []
);
const DATA_AT = SECTION_AT[SECTION_AT.length - 1];
// A breath on the last header before the sidebar is ditched.
const DATA_HOLD = 26;

/* Ending: the dot flies down to the wordmark, the tagline and URL follow. */
export const DEPART = DATA_AT + DATA_HOLD;
export const END_FLIGHT = 60;
export const IMPACT = DEPART + END_FLIGHT;
export const TAGLINE = IMPACT + 75;
export const URL_AT = TAGLINE + 30;
// Hold the finished card long enough to read twice.
const END_HOLD = 190;

export const OPENING = scene(0, LAND_INDEX);
export const ROLL_CALL = scene(LAND_INDEX, DEPART - LAND_INDEX);
export const ENDING = scene(DEPART - 12, URL_AT + 16 + END_HOLD - (DEPART - 12));

export const TOTAL_FRAMES = ENDING.from + ENDING.duration;

// The world is wider than the stage: the sidebar sits one screen to the
// right of where the dot starts, and the camera pans over to it.
export const PAN = STAGE_WIDTH / 2;

// How early a scene mounts before its first frame, so its anchors are
// measured by the time the dot sets off towards them.
export const PREMOUNT = 40;
