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
  className,
  style,
}: {
  sinceImpact: number;
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
      {/* An invisible full stop reserves the dot's place after the word. */}
      <span ref={stop} className="ml-[0.06em] inline-block size-[0.16em] rounded-full opacity-0" />
    </div>
  );
}
