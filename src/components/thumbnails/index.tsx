import {
  BellIcon,
  CheckCircleIcon,
  CopyIcon,
  HeartIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";

import { SectionIcon } from "@/components/app/section-icon";
import type { Section } from "@/lib/sections";

// Static-by-default thumbnails; each plays its idea on card hover (the index
// card is a `group`). Rest is neutral and shows the problem, hover shows the
// fix, and sky is the only accent — always as a dashed guide or marker.
// Easings (`ease-snappy`, `ease-spring`) and keyframes live in globals.css.

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Dashed sky guide, off until the card is hovered. It sets no transition of
// its own so it never overrides the element's transition-property.
const GUIDE = "border-dashed border-sky-500/0 group-hover:border-sky-500/60";

// One edge for every surface, so borders match across cards.
const EDGE = "ring-1 ring-border";

function Cursor({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 16"
      className={`h-4 w-3 drop-shadow-xs ${className}`}
      aria-hidden
    >
      <path
        d="M1 1 L1 13 L4 10 L6.5 15 L8.5 14 L6 9 L10.5 9 Z"
        className="fill-foreground stroke-card"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Typography */

function LetterSpacingThumbnail() {
  // The letters really move: tracking animates, and the guides hug the word
  // so you see the line close in with it.
  return (
    <span
      className={`inline-block border-x px-3 text-3xl font-medium [letter-spacing:0.12em] transition-[letter-spacing,border-color] duration-700 ease-snappy group-hover:[letter-spacing:-0.04em] ${GUIDE}`}
    >
      Tracking
    </span>
  );
}

function TextWrappingThumbnail() {
  // The measure narrows, so the text rewraps for real — and balances
  // instead of stranding the last word.
  return (
    <p className="w-44 text-sm font-medium transition-[width] duration-700 ease-snappy group-hover:w-28 group-hover:[text-wrap:balance]">
      Design is how it works, not only how it looks
    </p>
  );
}

function TabularNumsThumbnail() {
  // The same number twice: proportional on top, tabular below. Hover moves
  // the emphasis from the narrow one to the one that would line up.
  return (
    <div className="flex flex-col items-end text-4xl leading-none font-medium">
      <span className="[font-variant-numeric:normal] transition-colors duration-300 group-hover:text-muted-foreground">
        1,111
      </span>
      <span className="text-muted-foreground tabular-nums transition-colors duration-300 group-hover:text-foreground">
        1,111
      </span>
    </div>
  );
}

const SHAPES = ["square", "circle", "triangle"] as const;

function OpticalAlignmentThumbnail() {
  // Same bounding box for all three. The circle and triangle have to grow
  // past it to look the same size.
  return (
    <div className="flex items-center gap-3">
      {SHAPES.map((shape) => (
        <span
          key={shape}
          className={`flex size-12 items-center justify-center rounded-lg border transition-colors duration-300 ${GUIDE}`}
        >
          {shape === "square" ? (
            <span className="size-7 rounded-[3px] bg-muted-foreground/50" />
          ) : shape === "circle" ? (
            <span className="size-7 rounded-full bg-muted-foreground/50 transition-transform duration-500 ease-snappy group-hover:scale-[1.09]" />
          ) : (
            <svg viewBox="0 0 28 28" className="size-7">
              <polygon
                points="14,3 26,25 2,25"
                className="fill-muted-foreground/50 transition-transform duration-500 ease-snappy [transform-origin:center] group-hover:scale-120"
              />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}

// One set, three weights. Colours match the first demo in the article.
const ICON_WEIGHTS = [
  {
    Icon: StarIcon,
    weight: "regular",
    color: "group-hover:text-sky-400 dark:group-hover:text-sky-500",
  },
  {
    Icon: HeartIcon,
    weight: "fill",
    color: "group-hover:text-amber-400 dark:group-hover:text-yellow-500",
  },
  {
    Icon: BellIcon,
    weight: "duotone",
    color: "group-hover:text-green-400 dark:group-hover:text-green-500",
  },
] as const;

function IconsThumbnail() {
  return (
    <div className="flex items-center gap-4">
      {ICON_WEIGHTS.map(({ Icon, weight, color }) => (
        <Icon
          key={weight}
          weight={weight}
          className={`size-8 text-muted-foreground transition-colors duration-300 ${color}`}
        />
      ))}
    </div>
  );
}

// Both copies share one weight so the glyphs line up exactly; a hairline
// stroke stands in for the heavier default rendering. The clips are
// complementary, so only one copy ever shows at any x.
const SMOOTH_SWEEP =
  "transition-[clip-path] duration-700 ease-snappy";

function FontSmoothingThumbnail() {
  // The dashed line sweeps across and leaves the antialiased, lighter
  // rendering behind it.
  return (
    <span className="relative inline-block text-4xl font-medium">
      <span
        className={`block [-webkit-font-smoothing:auto] [-webkit-text-stroke:0.7px_currentColor] [clip-path:inset(0_0_0_0)] group-hover:[clip-path:inset(0_0_0_100%)] ${SMOOTH_SWEEP}`}
      >
        Smooth
      </span>
      <span
        className={`absolute inset-0 [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale] [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] ${SMOOTH_SWEEP}`}
      >
        Smooth
      </span>
      {/* Visible only while travelling: it fades in as it sets off and, on
          the way back, fades out once it has arrived. */}
      <span className="absolute -inset-y-2 -left-2 border-l border-dashed border-sky-500 opacity-0 [transition:left_700ms_var(--ease-snappy),opacity_150ms_700ms] group-hover:left-[calc(100%+0.5rem)] group-hover:opacity-100 group-hover:[transition:left_700ms_var(--ease-snappy),opacity_150ms]" />
    </span>
  );
}

/* Color */

const OKLCH_SWATCHES = [
  "oklch(0.72 0.13 25)",
  "oklch(0.82 0.14 92)",
  "oklch(0.72 0.13 150)",
  "oklch(0.72 0.13 230)",
  "oklch(0.72 0.13 300)",
];

function OklchThumbnail() {
  // Rest: desaturated, every swatch is the same grey. Hover: the hues come
  // back and still read as equally light.
  return (
    <div className="flex gap-1.5">
      {OKLCH_SWATCHES.map((background, i) => (
        <div
          key={i}
          className="size-7 rounded-lg ring-1 ring-black/5 grayscale transition-[filter] duration-500 group-hover:grayscale-0 dark:ring-white/10"
          style={{ background, transitionDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}

function NoiseThumbnail() {
  return (
    <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-linear-to-br from-neutral-100 to-neutral-400 ring-1 ring-border dark:from-neutral-600 dark:to-neutral-900">
      <div
        className="absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-70"
        style={{ backgroundImage: NOISE_SVG }}
      />
    </div>
  );
}

function ShadowsNotBordersThumbnail() {
  return (
    <div className="flex h-16 w-24 flex-col justify-end gap-1.5 rounded-xl bg-card p-3 shadow-[0_0_0_1px_var(--border)] transition-[box-shadow,translate] duration-300 ease-snappy group-hover:-translate-y-0.5 group-hover:shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_1px_rgba(0,0,0,0.04),0_2px_4px_-2px_rgba(0,0,0,0.05),0_6px_10px_-6px_rgba(0,0,0,0.06)] dark:group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_1px_1px_rgba(0,0,0,0.2),0_2px_4px_-2px_rgba(0,0,0,0.2),0_6px_10px_-6px_rgba(0,0,0,0.25)]">
      <div className="h-1.5 w-12 rounded-full bg-muted-foreground/40" />
      <div className="h-1.5 w-8 rounded-full bg-muted-foreground/20" />
    </div>
  );
}

function ImageOutlinesThumbnail() {
  // A pale image blends into the card until the inset outline frames it.
  return (
    <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-linear-to-b from-white to-neutral-100 outline-1 -outline-offset-1 outline-transparent transition-[outline-color] duration-300 group-hover:outline-black/8 dark:from-neutral-900 dark:to-neutral-800 dark:group-hover:outline-white/10">
      <div className="absolute top-4 right-5 size-4 rounded-full bg-neutral-200 dark:bg-neutral-700" />
      <div className="absolute -bottom-4 -left-2 h-10 w-20 rounded-[50%] bg-neutral-200 dark:bg-neutral-700" />
      <div className="absolute -right-4 -bottom-5 h-10 w-20 rounded-[50%] bg-neutral-300 dark:bg-neutral-600" />
    </div>
  );
}

/* Layout */

function NestedRadiusThumbnail() {
  // Rest: same radius inside and out, so the gap pinches at the corners.
  // Hover: inner radius = outer radius - padding.
  return (
    <div className="rounded-[24px] bg-muted p-2 ring-1 ring-border">
      <div className="h-16 w-24 rounded-[24px] bg-card shadow-xs ring-1 ring-border transition-[border-radius] duration-500 ease-snappy group-hover:rounded-[16px]" />
    </div>
  );
}

function SquirclesThumbnail() {
  return (
    <div className="size-20 rounded-[28px] bg-muted ring-1 ring-border corner-round transition-[corner-shape,border-radius] duration-500 ease-snappy group-hover:rounded-[34px] group-hover:corner-squircle" />
  );
}

function HitAreasThumbnail() {
  // The target is always drawn; hovering only lights it up.
  return (
    <span className="relative flex items-center justify-center">
      <span className="absolute -inset-4 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/40 transition-colors duration-300 group-hover:border-sky-500/50 group-hover:bg-sky-500/5" />
      <HeartIcon
        weight="fill"
        className="size-6 text-muted-foreground/60 transition-colors duration-150 group-hover:text-rose-500"
      />
      <Cursor className="absolute top-full left-full translate-x-4 translate-y-4 opacity-0 transition-all duration-500 ease-snappy group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:opacity-100" />
    </span>
  );
}

function MiniPage({ canvasShows }: { canvasShows: boolean }) {
  // Browser chrome owns the rounded top corners and the viewport below it is
  // square, so the canvas strip never lands on a clipped edge — the same
  // reason the article's demo draws a window frame.
  return (
    <div className="h-20 w-16 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
      <div className="flex h-3.5 items-center gap-0.5 px-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1 rounded-full bg-muted-foreground/40" />
        ))}
      </div>
      <div className="relative h-[calc(100%-0.875rem)] overflow-hidden bg-white dark:bg-neutral-900">
        {canvasShows && (
          <div className="absolute inset-x-0 top-0 h-5 bg-neutral-900 dark:bg-white" />
        )}
        <div className="absolute inset-0 bg-white p-2 transition-transform duration-500 ease-snappy group-hover:translate-y-3 dark:bg-neutral-900">
          <div className="h-1.5 w-8 rounded-full bg-neutral-900/35 dark:bg-white/35" />
          <div className="mt-2 h-1 w-10 rounded-full bg-neutral-900/20 dark:bg-white/20" />
          <div className="mt-1 h-1 w-7 rounded-full bg-neutral-900/20 dark:bg-white/20" />
        </div>
      </div>
    </div>
  );
}

function HtmlBackgroundThumbnail() {
  // Overscroll: a white canvas shows through on the left, the matched one
  // on the right does not.
  return (
    <div className="flex gap-3">
      <MiniPage canvasShows />
      <MiniPage canvasShows={false} />
    </div>
  );
}

function ClipPathThumbnail() {
  return (
    <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-muted ring-1 ring-border">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_6px,var(--border)_6px_7px)]" />
      <div className="absolute inset-0 flex flex-col justify-end gap-1.5 bg-card p-3 transition-[clip-path] duration-700 ease-snappy [clip-path:inset(0_65%_0_0)] group-hover:[clip-path:inset(0_20%_0_0)]">
        <div className="h-1.5 w-16 rounded-full bg-muted-foreground/40" />
        <div className="h-1.5 w-10 rounded-full bg-muted-foreground/20" />
      </div>
      <div className="absolute inset-y-0 left-[35%] w-px -translate-x-1/2 border-l border-dashed border-muted-foreground/40 transition-[left,border-color] duration-700 ease-snappy group-hover:left-[80%] group-hover:border-sky-500/60" />
    </div>
  );
}

function ScrollFadesThumbnail() {
  // At rest only the bottom fades (there is only more below). Once
  // scrolled, the top fades in too.
  return (
    <div className="scroll-fade-thumb h-20 w-28 overflow-hidden">
      <div className="flex flex-col gap-2 pt-1 transition-transform duration-700 ease-snappy group-hover:-translate-y-6">
        {[20, 26, 18, 24, 16, 22, 19].map((w, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-muted-foreground/30" />
            <div
              className="h-1.5 rounded-full bg-muted-foreground/30"
              style={{ width: w * 3.5 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Motion */

function IconMorphThumbnail() {
  return (
    <span className="relative flex size-12 items-center justify-center rounded-xl bg-card shadow-xs ring-1 ring-border">
      <CopyIcon className="size-5 transition-all duration-500 ease-snappy group-hover:scale-25 group-hover:opacity-0 group-hover:blur-[2px]" />
      <CheckCircleIcon
        weight="fill"
        className="absolute size-5 scale-25 text-emerald-600 opacity-0 blur-[2px] transition-all duration-500 ease-snappy group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none dark:text-emerald-400"
      />
    </span>
  );
}

function ButtonPressThumbnail() {
  return (
    <span className="relative">
      <span className="block rounded-full bg-card px-5 py-2.5 text-sm font-medium shadow-xs ring-1 ring-border group-hover:animate-[thumb-press_600ms_ease-out_150ms]">
        Continue
      </span>
      <Cursor className="absolute top-3/5 left-3/5 translate-x-3 translate-y-3 opacity-0 transition-all duration-300 ease-snappy group-hover:translate-0 group-hover:opacity-100" />
    </span>
  );
}

// The curve is the easing itself: cubic-bezier(0.23, 1, 0.32, 1) drawn from
// (4,60) to (108,4), with the dot riding it.
const EASE_CURVE = "M4 60 C 27.9 4, 37.3 4, 108 4";

function EasingsThumbnail() {
  return (
    <div className="relative h-16 w-28">
      <svg viewBox="0 0 112 64" className="absolute inset-0 h-16 w-28">
        <path
          d="M4 4 L4 60 L108 60"
          fill="none"
          strokeWidth="1"
          strokeDasharray="3 3"
          className="stroke-muted-foreground/30"
        />
        <path
          d={EASE_CURVE}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-muted-foreground/60 transition-colors duration-300 group-hover:stroke-foreground"
        />
      </svg>
      <span
        className="absolute size-2.5 rounded-full bg-foreground ring-4 ring-foreground/10 [offset-distance:0%] transition-[offset-distance] duration-700 ease-linear group-hover:[offset-distance:100%]"
        style={{ offsetPath: `path("${EASE_CURVE}")` }}
      />
    </div>
  );
}

function StaggerThumbnail() {
  // The same lift on every square; only the delay between them differs.
  return (
    <div className="flex h-12 items-center gap-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="size-5 rounded-[6px] bg-muted-foreground/25 transition-[translate,background-color] duration-300 ease-snappy group-hover:-translate-y-2.5 group-hover:bg-muted-foreground/60"
          style={{ transitionDelay: `${i * 70}ms` }}
        />
      ))}
    </div>
  );
}

function InterruptibilityThumbnail() {
  // A sheet on a spring: let go halfway and it turns around from there.
  return (
    <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-muted ring-1 ring-border">
      <div className="absolute inset-x-1.5 top-14 h-16 rounded-t-xl bg-card shadow-sm ring-1 ring-border transition-transform duration-500 ease-snappy group-hover:-translate-y-10">
        <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-muted-foreground/30" />
        <div className="mt-3 ml-3 h-1.5 w-14 rounded-full bg-muted-foreground/30" />
        <div className="mt-2 ml-3 h-1.5 w-10 rounded-full bg-muted-foreground/20" />
      </div>
    </div>
  );
}

function HoverRestraintThumbnail() {
  // The same hover at two speeds: one lands on arrival, the other is still
  // fading in long after the pointer got there.
  return (
    <div className="flex items-center gap-2.5 text-[11px] font-medium">
      <span className="rounded-lg px-3 py-2 ring-1 ring-border transition-colors duration-0 group-hover:bg-muted">
        Instant
      </span>
      <span className="rounded-lg px-3 py-2 ring-1 ring-border transition-colors duration-700 group-hover:bg-muted">
        Slow
      </span>
    </div>
  );
}

function ScaleEntrancesThumbnail() {
  // A menu grows out of the button that opened it: the origin sits on the
  // trigger's corner, and it starts at 95%, not from nothing.
  return (
    <div className="relative h-24 w-28">
      <span
        className={`absolute top-0 left-0 flex h-7 items-center gap-1.5 rounded-lg bg-card px-2.5 shadow-xs ${EDGE}`}
      >
        <span className="h-1.5 w-8 rounded-full bg-muted-foreground/50" />
        <span className="size-1.5 rounded-[2px] bg-muted-foreground/50" />
      </span>
      <div
        className={`absolute top-9 left-0 flex w-20 origin-top-left scale-95 flex-col gap-2 rounded-lg bg-card p-2.5 opacity-0 shadow-md transition-[scale,opacity] duration-300 ease-spring group-hover:scale-100 group-hover:opacity-100 group-hover:duration-500 ${EDGE}`}
      >
        <div className="h-1.5 w-11 rounded-full bg-muted-foreground/40" />
        <div className="h-1.5 w-8 rounded-full bg-muted-foreground/20" />
        <div className="h-1.5 w-12 rounded-full bg-muted-foreground/20" />
      </div>
      <Cursor className="absolute top-2 left-10 translate-x-3 translate-y-3 opacity-0 transition-all duration-300 ease-snappy group-hover:translate-0 group-hover:opacity-100" />
    </div>
  );
}

function SharedLayoutThumbnail() {
  // Block and lines are the same elements in both layouts: the block grows
  // and the lines travel under it, instead of one set swapping for another.
  return (
    <div className="relative h-24 w-28">
      <div className="absolute top-8 left-0 h-8 w-8 rounded-lg bg-muted ring-1 ring-border transition-[width,height,top] duration-500 ease-snappy group-hover:top-2 group-hover:h-14 group-hover:w-28" />
      <div className="absolute top-9 left-10 flex flex-col gap-1.5 transition-transform duration-500 ease-snappy group-hover:-translate-x-10 group-hover:translate-y-9">
        <div className="h-1.5 w-16 rounded-full bg-muted-foreground/40" />
        <div className="h-1.5 w-10 rounded-full bg-muted-foreground/20" />
      </div>
    </div>
  );
}

function ExitAnimationsThumbnail() {
  // The middle row leaves in half the time it would take to arrive, and the
  // rows below close the gap with it.
  return (
    <div className="flex w-28 flex-col">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`mb-1.5 flex h-7 items-center rounded-lg bg-card px-2.5 shadow-xs ring-1 ring-border transition-[height,opacity,margin,scale] duration-300 ease-snappy ${
            i === 1
              ? "group-hover:mb-0 group-hover:h-0 group-hover:scale-[0.98] group-hover:opacity-0 group-hover:duration-200"
              : ""
          }`}
        >
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </div>
      ))}
    </div>
  );
}

/* Sound */

// Idle is already a played cue; hover fires a different, less even one.
const SFX_BARS = [
  { idle: 26, hover: 11 },
  { idle: 20, hover: 28 },
  { idle: 15, hover: 8 },
  { idle: 11, hover: 21 },
  { idle: 8, hover: 30 },
  { idle: 6, hover: 9 },
  { idle: 5, hover: 16 },
  { idle: 3, hover: 6 },
];

function InterfaceSfxThumbnail() {
  return (
    <div className="flex h-8 items-center gap-1">
      {SFX_BARS.map(({ idle, hover }, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-muted-foreground/50 transition-[height,background-color] duration-300 ease-snappy h-(--h) group-hover:h-(--hh) group-hover:bg-foreground/70"
          style={
            {
              "--h": `${idle}px`,
              "--hh": `${hover}px`,
              transitionDelay: `${i * 25}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

// Three sources at different pitches: a slow swell, a mid tone and a fast
// tick. Apart they are three sounds; on hover they land on one baseline and
// read as a single, richer cue.
const SOUND_LAYERS = [
  {
    d: "M0 24 Q12 10 24 24 T48 24 T72 24 T96 24",
    rest: "-translate-y-4",
    tone: "stroke-neutral-500 dark:stroke-neutral-400",
  },
  {
    d: "M0 24 Q6 16 12 24 T24 24 T36 24 T48 24 T60 24 T72 24 T84 24 T96 24",
    rest: "translate-y-0",
    tone: "stroke-neutral-400 dark:stroke-neutral-500",
  },
  {
    d: "M0 24 Q3 20 6 24 T12 24 T18 24 T24 24 T30 24 T36 24 T42 24 T48 24 T54 24 T60 24 T66 24 T72 24 T78 24 T84 24 T90 24 T96 24",
    rest: "translate-y-4",
    tone: "stroke-neutral-300 dark:stroke-neutral-600",
  },
];

function LayeringSoundsThumbnail() {
  return (
    <svg viewBox="0 0 96 48" className="h-12 w-24 overflow-visible">
      {SOUND_LAYERS.map(({ d, rest, tone }, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`${tone} ${rest} transition-transform duration-500 ease-snappy group-hover:translate-y-0`}
          style={{ transitionDelay: `${i * 40}ms` }}
        />
      ))}
    </svg>
  );
}

/* Data */

// New readings for the same series: every bar eases to its next value
// instead of the chart redrawing itself.
const CHART_BARS = [
  { rest: 16, hover: 28 },
  { rest: 30, hover: 20 },
  { rest: 22, hover: 40 },
  { rest: 42, hover: 26 },
  { rest: 26, hover: 34 },
  { rest: 34, hover: 48 },
  { rest: 20, hover: 30 },
];

function LivingChartsThumbnail() {
  return (
    <div className="flex h-14 items-end gap-2">
      {CHART_BARS.map(({ rest, hover }, i) => (
        <div
          key={i}
          className="w-1.5 rounded-t-[2px] bg-muted-foreground/40 transition-[height,background-color] duration-700 ease-snappy h-(--h) group-hover:h-(--hh) group-hover:bg-muted-foreground/60"
          style={
            {
              "--h": `${rest}px`,
              "--hh": `${hover}px`,
              transitionDelay: `${i * 45}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

const CURVE_POINTS: [number, number][] = [
  [0, 32],
  [16, 32],
  [32, 8],
  [48, 30],
  [64, 30],
  [80, 12],
  [96, 20],
];

// Monotone first (never leaves the data), then the cardinal spline that
// invents the dips shaded underneath.
const MONOTONE =
  "M0 32 L16 32 C21.3 32 26.7 8 32 8 C37.3 8 42.7 30 48 30 L64 30 C69.3 30 74.7 12 80 12 C85.3 12 90.7 17.3 96 20";
const OVERSHOOT =
  "M0 32 C5.3 32 10.7 37 16 32 C21.3 27 26.7 8.3 32 8 C37.3 7.7 42.7 26 48 30 C53.3 34 58.7 34 64 30 C69.3 26 74.7 13.7 80 12 C85.3 10.3 90.7 17.3 96 20";

function CurveSmoothingThumbnail() {
  return (
    <svg viewBox="-4 0 104 44" className="h-14 w-32 overflow-visible">
      <path
        d={MONOTONE}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-neutral-300 transition-opacity duration-500 group-hover:opacity-0 dark:text-neutral-600"
      />
      <path
        d={OVERSHOOT}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-neutral-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:text-neutral-500"
      />
      {CURVE_POINTS.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="2.5"
          className="fill-card stroke-neutral-400 dark:stroke-neutral-500"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

/* Craft */

function PerceivedPerformanceThumbnail() {
  // The blur-up: something is on screen immediately, then it sharpens.
  return (
    <div className="h-20 w-28 overflow-hidden rounded-xl bg-muted ring-1 ring-border">
      <div className="relative h-full w-full scale-110 blur-[7px] transition-[filter,scale] duration-500 ease-snappy group-hover:scale-100 group-hover:blur-none">
        <div className="absolute top-3 right-4 size-5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <div className="absolute -bottom-5 -left-3 h-12 w-24 rounded-[50%] bg-neutral-300 dark:bg-neutral-700" />
        <div className="absolute -right-5 -bottom-6 h-12 w-20 rounded-[50%] bg-neutral-400 dark:bg-neutral-600" />
      </div>
    </div>
  );
}

const REFERENCE_CARDS = [
  "-translate-x-3 -rotate-8 group-hover:-translate-x-10 group-hover:-rotate-12",
  "rotate-2 group-hover:-translate-y-1 group-hover:rotate-0",
  "translate-x-3 rotate-8 group-hover:translate-x-10 group-hover:rotate-12",
];

function ReferencesThumbnail() {
  // Cards use the shared edge, and the image inside is nested for real:
  // outer radius 8px minus 6px of padding leaves 2px.
  return (
    <div className="relative h-20 w-16">
      {REFERENCE_CARDS.map((classes, i) => (
        <div
          key={i}
          className={`absolute inset-0 flex flex-col gap-1.5 rounded-lg bg-card p-1.5 shadow-sm ring-1 ring-neutral-200 transition-transform duration-500 ease-snappy dark:ring-neutral-800 ${classes}`}
          style={{ transitionDelay: `${i * 30}ms` }}
        >
          <div className="h-10 rounded-[2px] bg-muted" />
          <div className="h-1 w-9 rounded-full bg-muted-foreground/30" />
          <div className="h-1 w-6 rounded-full bg-muted-foreground/20" />
        </div>
      ))}
    </div>
  );
}

function TasteThumbnail() {
  // Each marker is anchored to the flaw it circles: the corner radius, the
  // nudged icon and the uneven gap.
  const flaw =
    "pointer-events-none absolute rounded-full border border-dashed border-sky-500/0 bg-sky-500/0 transition-colors duration-300 group-hover:border-sky-500/60 group-hover:bg-sky-500/5";
  return (
    <div className="flex gap-3">
      <div className="relative flex h-16 w-20 flex-col gap-1.5 rounded-xl bg-card p-2.5 shadow-xs ring-1 ring-border">
        <div className="size-3 rounded-[4px] bg-muted-foreground/40" />
        <div className="h-1.5 w-11 rounded-full bg-muted-foreground/40" />
        <div className="h-1.5 w-8 rounded-full bg-muted-foreground/20" />
      </div>
      <div className="relative flex h-16 w-20 flex-col gap-1.5 rounded-lg bg-card p-2.5 shadow-xs ring-1 ring-border">
        <span className={`${flaw} -top-2 -right-2 size-6`} />
        <div className="relative ml-0.5 size-3 rounded-[4px] bg-muted-foreground/40">
          <span
            className={`${flaw} -inset-1.5`}
            style={{ transitionDelay: "80ms" }}
          />
        </div>
        <div className="h-1.5 w-11 rounded-full bg-muted-foreground/40" />
        <div className="relative mt-0.5 h-1.5 w-8 rounded-full bg-muted-foreground/20">
          <span
            className={`${flaw} -inset-x-1.5 -inset-y-1.5`}
            style={{ transitionDelay: "160ms" }}
          />
        </div>
      </div>
    </div>
  );
}

function TimelessnessThumbnail() {
  // The dated surface burns off and leaves the structure it was painted on.
  return (
    <div className="relative h-20 w-28">
      <div className="absolute inset-0 rounded-xl border border-neutral-300 bg-linear-to-b from-white via-neutral-200 to-neutral-300 p-3 shadow-[inset_0_1px_0_white,0_1px_2px_rgba(0,0,0,0.1)] transition-opacity duration-500 group-hover:opacity-0 dark:border-neutral-900 dark:from-neutral-500 dark:via-neutral-700 dark:to-neutral-800 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.3)]">
        <div className="size-6 rounded-md bg-linear-to-b from-neutral-400 to-neutral-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] dark:from-neutral-600 dark:to-neutral-800 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />
        <div className="mt-2.5 h-1.5 w-16 rounded-full bg-neutral-400/80 dark:bg-neutral-500" />
        <div className="mt-1.5 h-1.5 w-10 rounded-full bg-neutral-400/50 dark:bg-neutral-600" />
      </div>
      <div className="absolute inset-0 rounded-xl border border-dashed border-sky-500/50 p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="size-6 rounded-md border border-dashed border-sky-500/50" />
        <div className="mt-2.5 h-1.5 w-16 rounded-full border border-dashed border-sky-500/50" />
        <div className="mt-1.5 h-1.5 w-10 rounded-full border border-dashed border-sky-500/50" />
      </div>
    </div>
  );
}

function NoveltyBudgetThumbnail() {
  // Ten everyday moments, one worth spending on.
  return (
    <div className="flex h-12 items-end gap-1.5">
      {Array.from({ length: 11 }, (_, i) =>
        i === 7 ? (
          <div
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25 transition-[height,background-color] duration-500 ease-snappy group-hover:h-10 group-hover:bg-sky-500"
          />
        ) : (
          <div
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25"
          />
        )
      )}
    </div>
  );
}

const thumbnails: Record<string, () => React.ReactNode> = {
  "letter-spacing": LetterSpacingThumbnail,
  "text-wrapping": TextWrappingThumbnail,
  oklch: OklchThumbnail,
  "nested-border-radius": NestedRadiusThumbnail,
  squircles: SquirclesThumbnail,
  "icon-morph": IconMorphThumbnail,
  "interface-sfx": InterfaceSfxThumbnail,
  "tabular-numbers": TabularNumsThumbnail,
  "optical-alignment": OpticalAlignmentThumbnail,
  icons: IconsThumbnail,
  noise: NoiseThumbnail,
  "shadows-not-borders": ShadowsNotBordersThumbnail,
  "image-outlines": ImageOutlinesThumbnail,
  "hit-areas": HitAreasThumbnail,
  "html-background": HtmlBackgroundThumbnail,
  "button-press": ButtonPressThumbnail,
  easings: EasingsThumbnail,
  stagger: StaggerThumbnail,
  interruptibility: InterruptibilityThumbnail,
  "hover-restraint": HoverRestraintThumbnail,
  "layering-sounds": LayeringSoundsThumbnail,
  "living-charts": LivingChartsThumbnail,
  "performance-is-design": PerceivedPerformanceThumbnail,
  "how-to-get-references": ReferencesThumbnail,
  "novelty-budget": NoveltyBudgetThumbnail,
  "shared-layout": SharedLayoutThumbnail,
  "exit-animations": ExitAnimationsThumbnail,
  "scale-entrances": ScaleEntrancesThumbnail,
  "clip-path": ClipPathThumbnail,
  "scroll-fades": ScrollFadesThumbnail,
  "font-smoothing": FontSmoothingThumbnail,
  "curve-smoothing": CurveSmoothingThumbnail,
  "taste-is-trained": TasteThumbnail,
  timelessness: TimelessnessThumbnail,
};

export function ConceptThumbnail({
  slug,
  section,
}: {
  slug: string;
  section: Section;
}) {
  const Thumbnail = thumbnails[slug];
  if (Thumbnail) return <Thumbnail />;
  // Fallback for concepts without a bespoke thumbnail yet.
  return <SectionIcon section={section} className="size-8 opacity-60" />;
}
