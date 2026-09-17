import { useAnchor } from "../lib/anchors";

// Redaction's cuts get progressively more degraded (35 → 50 → 70). On
// impact the wordmark glitches through the pixelated cuts and settles back.
const GLITCH_FRAMES = [
  "font-redaction50",
  "font-redaction70",
  "font-redaction50",
  "font-redaction70",
  "font-redaction50",
  "font-redaction",
] as const;

// The site cuts every 90ms; the video lingers on each cut so it can be read.
const FRAME_LENGTH = 11;

export function glitchClass(sinceImpact: number) {
  if (sinceImpact < 0) return "font-redaction";
  const i = Math.floor(sinceImpact / FRAME_LENGTH);
  return GLITCH_FRAMES[Math.min(i, GLITCH_FRAMES.length - 1)];
}

/** The big closing wordmark; the dot lands as its full stop. */
export function Wordmark({
  sinceImpact,
  stopOpacity = 0,
  className,
  style,
}: {
  sinceImpact: number;
  /** The full stop is drawn once the dot has become it. */
  stopOpacity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const stop = useAnchor({ id: "wordmark:dot", ax: 0.5, ay: 0.5 });
  return (
    <div
      className={`flex items-baseline text-foreground ${glitchClass(
        sinceImpact
      )} ${className ?? ""}`}
      style={style}
    >
      <span>Craft</span>
      {/* The full stop reserves the dot's place, then takes over from it. */}
      <span
        ref={stop}
        className="ml-[0.06em] inline-block size-[0.14em] rounded-full bg-foreground"
        style={{ opacity: stopOpacity }}
      />
    </div>
  );
}
