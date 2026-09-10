"use client";

import { LightningIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type SurfaceMode = "flat" | "grain";

const SURFACE_OPTIONS = [
  { value: "flat", label: "Flat" },
  { value: "grain", label: "Grain" },
] as const;

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

/** The SVG filter that generates the grain. Defined once per demo. */
function GrainFilter({
  id,
  baseFrequency,
}: {
  id: string;
  baseFrequency: number;
}) {
  return (
    <svg aria-hidden="true" className="absolute size-0">
      <filter id={id}>
        <feTurbulence
          baseFrequency={baseFrequency}
          numOctaves={3}
          stitchTiles="stitch"
          type="fractalNoise"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </svg>
  );
}

/**
 * An empty overlay painted entirely by the filter. Sits on top of whatever
 * surface it covers and blends into it.
 */
function Grain({
  id,
  opacity,
  className,
}: {
  id: string;
  opacity: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-200 ease-out motion-reduce:transition-none",
        className
      )}
      style={{ filter: `url(#${id})`, opacity }}
    />
  );
}

export function NoiseDemo() {
  const [percent, setPercent] = useState(8);

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <GrainFilter id="grain-cover" baseFrequency={0.8} />

      <div className="relative isolate h-44 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 shadow-(--custom-shadow)">
        <Grain id="grain-cover" opacity={percent / 100} />
        <div className="flex h-full flex-col justify-end p-4">
          <span className="text-sm font-medium text-white">Weekly digest</span>
          <span className="mt-0.5 text-xs text-white/75">
            Your projects, summarized every Friday.
          </span>
        </div>
      </div>

      <label className="grid w-full max-w-xs gap-2.5">
        <span className="flex items-center justify-between text-xs text-muted-foreground">
          Grain opacity
          <span className="tabular-nums text-foreground">{percent}%</span>
        </span>
        <Slider
          aria-label="Grain opacity"
          max={30}
          min={0}
          onValueChange={(value) => setPercent(getSliderValue(value))}
          step={1}
          value={[percent]}
        />
      </label>
    </Demo>
  );
}

const SPOTLIGHT =
  "radial-gradient(circle at 50% 35%, #3a3a3a 0%, #1a1a1a 45%, #0c0c0c 75%)";

export function NoiseBandingDemo() {
  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <GrainFilter id="grain-banding" baseFrequency={0.8} />

      <Compare>
        <CompareItem verdict="wrong">
          <div
            aria-hidden="true"
            className="aspect-[4/3] w-full overflow-hidden rounded-xl"
            style={{ background: SPOTLIGHT }}
          />
        </CompareItem>
        <CompareItem verdict="right">
          <div
            aria-hidden="true"
            className="relative isolate aspect-[4/3] w-full overflow-hidden rounded-xl"
            style={{ background: SPOTLIGHT }}
          >
            <Grain id="grain-banding" opacity={0.12} />
          </div>
        </CompareItem>
      </Compare>
    </Demo>
  );
}

export function NoiseFrequencyDemo() {
  const [frequency, setFrequency] = useState(0.8);

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <GrainFilter id="grain-frequency" baseFrequency={frequency} />

      <div className="relative isolate h-40 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 shadow-(--custom-shadow)">
        <Grain id="grain-frequency" opacity={0.3} />
      </div>

      <label className="grid w-full max-w-xs gap-2.5">
        <span className="flex items-center justify-between text-xs text-muted-foreground">
          Base frequency
          <span className="tabular-nums text-foreground">
            {frequency.toFixed(2)}
          </span>
        </span>
        <Slider
          aria-label="Base frequency"
          max={1.5}
          min={0.1}
          onValueChange={(value) => setFrequency(getSliderValue(value))}
          step={0.05}
          value={[frequency]}
        />
      </label>
    </Demo>
  );
}

export function NoiseSurfaceDemo() {
  const [mode, setMode] = useState<SurfaceMode>("flat");
  const grain = mode === "grain";

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <GrainFilter id="grain-surface" baseFrequency={0.8} />

      <div
        aria-hidden="true"
        className="relative isolate w-full max-w-xs overflow-hidden rounded-2xl bg-[#171717] p-5 text-white shadow-(--custom-shadow)"
      >
        <Grain id="grain-surface" opacity={grain ? 0.07 : 0} />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Pro</span>
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
            <LightningIcon className="size-3" weight="fill" />
            Popular
          </span>
        </div>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-medium tracking-tight tabular-nums">
            $20
          </span>
          <span className="text-xs text-white/55">per month</span>
        </div>
        <ul className="mt-4 flex flex-col gap-1.5 text-xs text-white/70">
          <li>Unlimited projects</li>
          <li>Shared workspaces</li>
          <li>Priority support</li>
        </ul>
        <span className="mt-5 flex h-8 items-center justify-center rounded-full bg-white text-xs font-medium text-neutral-900">
          Upgrade
        </span>
      </div>

      <SegmentedControl
        ariaLabel="Card surface"
        onChange={setMode}
        options={SURFACE_OPTIONS}
        value={mode}
      />
    </Demo>
  );
}
