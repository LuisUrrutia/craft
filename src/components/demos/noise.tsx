"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Slider } from "@/components/ui/slider";

type SurfaceMode = "flat" | "grain";

const SURFACE_OPTIONS = [
  { value: "flat", label: "Flat" },
  { value: "grain", label: "Grain" },
] as const;

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

function GrainFilter({ id, baseFrequency }: { id: string; baseFrequency: number }) {
  return (
    <svg aria-hidden="true" className="absolute size-0">
      <filter id={id}>
        <feTurbulence baseFrequency={baseFrequency} />
      </filter>
    </svg>
  );
}

function GrainOverlay({ id, opacity }: { id: string; opacity: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-200 ease-out motion-reduce:transition-none"
      style={{
        filter: `url(#${id}) grayscale(100%)`,
        opacity,
      }}
    />
  );
}

export function NoiseDemo() {
  const [opacity, setOpacity] = useState(8);

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <GrainFilter id="noise-opacity-grain" baseFrequency={0.8} />

      <div className="relative h-44 w-full max-w-96 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/90 to-sky-500/90 shadow-(--custom-shadow)">
        <GrainOverlay id="noise-opacity-grain" opacity={opacity / 100} />
        <div className="relative flex h-full flex-col justify-end p-4">
          <p className="text-sm font-medium text-white">Weekly digest</p>
          <p className="mt-0.5 text-xs text-white/75">
            Your projects, summarized every Friday.
          </p>
        </div>
      </div>

      <div className="grid w-full max-w-xs gap-2.5">
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Noise opacity
            <span className="tabular-nums text-[10px] text-foreground">
              {opacity}%
            </span>
          </span>
          <Slider
            aria-label="Noise opacity"
            max={40}
            min={0}
            onValueChange={(value) => setOpacity(getSliderValue(value))}
            step={1}
            value={[opacity]}
          />
        </label>
      </div>

      <p className="max-w-sm text-center text-xs text-pretty text-muted-foreground/70">
        Around 5 to 10% the grain reads as texture. Push it past 30% and the
        surface starts to look like a compressed image.
      </p>
    </Demo>
  );
}

export function NoiseFrequencyDemo() {
  const [frequency, setFrequency] = useState(0.8);

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <GrainFilter id="noise-frequency-grain" baseFrequency={frequency} />

      <div className="relative h-40 w-full max-w-96 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400/90 to-rose-500/90 shadow-(--custom-shadow)">
        <GrainOverlay id="noise-frequency-grain" opacity={0.24} />
      </div>

      <div className="grid w-full max-w-xs gap-2.5">
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Base frequency
            <span className="tabular-nums text-[10px] text-foreground">
              {frequency.toFixed(2)}
            </span>
          </span>
          <Slider
            aria-label="Base frequency"
            max={1.2}
            min={0.05}
            onValueChange={(value) => setFrequency(getSliderValue(value))}
            step={0.05}
            value={[frequency]}
          />
        </label>
      </div>

      <p className="max-w-sm text-center text-xs text-pretty text-muted-foreground/70">
        The opacity is raised here so the pattern is easy to see. Low values
        look like static from an old TV. Values near 0.8 look like film grain.
      </p>
    </Demo>
  );
}

export function NoiseSurfaceDemo() {
  const [mode, setMode] = useState<SurfaceMode>("flat");
  const grain = mode === "grain";

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <GrainFilter id="noise-surface-grain" baseFrequency={0.8} />

      <div
        aria-hidden="true"
        className="w-full max-w-80 overflow-hidden rounded-2xl bg-card shadow-(--custom-shadow)"
      >
        <div className="relative h-32 bg-gradient-to-br from-emerald-500/90 to-teal-600/90">
          <GrainOverlay id="noise-surface-grain" opacity={grain ? 0.08 : 0} />
        </div>
        <div className="px-4 pb-4 pt-3.5">
          <p className="text-xs font-medium text-foreground">Northern Lights</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            12 photos · Shared with the team
          </p>
        </div>
      </div>

      <SegmentedControl
        ariaLabel="Card cover surface"
        onChange={setMode}
        options={SURFACE_OPTIONS}
        value={mode}
      />

      <p className="max-w-sm text-center text-xs text-pretty text-muted-foreground">
        {grain
          ? "With 8% grain, the cover reads as a material instead of a fill."
          : "The flat gradient is clean, but it can feel like a placeholder."}
      </p>
    </Demo>
  );
}
