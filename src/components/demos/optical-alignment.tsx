"use client";

import {
  ArrowRightIcon,
  DownloadSimpleIcon,
  PlayIcon,
  StarIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { cn } from "@/lib/utils";

type Alignment = "geometric" | "optical";

const ALIGNMENT_OPTIONS = [
  { value: "geometric", label: "Centered" },
  { value: "optical", label: "Optically centered" },
] as const;

const ICONS = [
  { label: "Play", Icon: PlayIcon, weight: "fill", shift: "translateX(2px)" },
  { label: "Favorite", Icon: StarIcon, weight: "fill", shift: "translateY(-1px)" },
  {
    label: "Download",
    Icon: DownloadSimpleIcon,
    weight: "bold",
    shift: "translateY(-1px)",
  },
] as const;

function CenterGuides() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-full"
    >
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-rose-500/40" />
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-rose-500/40" />
    </span>
  );
}

export function OpticalAlignmentDemo() {
  const [mode, setMode] = useState<Alignment>("geometric");

  return (
    <Demo className="gap-8">
      <div className="flex items-center gap-5 sm:gap-8">
        {ICONS.map(({ label, Icon, weight, shift }) => (
          <span
            key={label}
            aria-label={label}
            className="relative grid size-14 place-items-center rounded-full bg-card text-foreground shadow-(--custom-shadow)"
            role="img"
          >
            <CenterGuides />
            <Icon
              aria-hidden="true"
              className="relative size-6 transition-transform duration-200 ease-out motion-reduce:transition-none"
              style={{ transform: mode === "optical" ? shift : "none" }}
              weight={weight}
            />
          </span>
        ))}
      </div>
      <SegmentedControl
        ariaLabel="Icon alignment"
        onChange={setMode}
        options={ALIGNMENT_OPTIONS}
        value={mode}
      />
    </Demo>
  );
}

function PaddedButton({
  paddingLeft,
  paddingRight,
}: {
  paddingLeft: number;
  paddingRight: number;
}) {
  return (
    <span className="relative inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground text-sm font-medium text-background">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 rounded-l-lg bg-rose-500/25"
        style={{ width: paddingLeft }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 rounded-r-lg bg-rose-500/25"
        style={{ width: paddingRight }}
      />
      <span
        className="relative inline-flex items-center gap-1.5"
        style={{ paddingLeft, paddingRight }}
      >
        Next
        <ArrowRightIcon aria-hidden="true" className="size-4" weight="bold" />
      </span>
    </span>
  );
}

export function OpticalButtonDemo() {
  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <PaddedButton paddingLeft={14} paddingRight={14} />
        </CompareItem>
        <CompareItem verdict="right">
          <PaddedButton paddingLeft={14} paddingRight={10} />
        </CompareItem>
      </Compare>
    </Demo>
  );
}

type Sizing = "equal" | "balanced";

const SIZING_OPTIONS = [
  { value: "equal", label: "Same box" },
  { value: "balanced", label: "Balanced" },
] as const;

const SHAPES = [
  { name: "square", equal: 26, balanced: 24 },
  { name: "circle", equal: 26, balanced: 27 },
  { name: "triangle", equal: 26, balanced: 30 },
] as const;

export function OpticalWeightDemo() {
  const [mode, setMode] = useState<Sizing>("equal");

  return (
    <Demo className="gap-8">
      <div className="flex items-center gap-5 sm:gap-8">
        {SHAPES.map((shape) => {
          const size = shape[mode];

          return (
            <span
              key={shape.name}
              className="grid size-14 place-items-center rounded-xl bg-card shadow-(--custom-shadow)"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "block bg-foreground transition-[width,height] duration-200 ease-out motion-reduce:transition-none",
                  shape.name === "square" && "rounded-[3px]",
                  shape.name === "circle" && "rounded-full"
                )}
                style={{
                  width: size,
                  height: size,
                  clipPath:
                    shape.name === "triangle"
                      ? "polygon(50% 0, 100% 100%, 0 100%)"
                      : undefined,
                }}
              />
            </span>
          );
        })}
      </div>
      <SegmentedControl
        ariaLabel="Shape sizing"
        onChange={setMode}
        options={SIZING_OPTIONS}
        value={mode}
      />
    </Demo>
  );
}

type OpticalSize = "text" | "display";

const OPSZ_OPTIONS = [
  { value: "text", label: "Text design" },
  { value: "display", label: "Display design" },
] as const;

export function OpticalSizingDemo() {
  const [mode, setMode] = useState<OpticalSize>("text");

  return (
    <Demo className="gap-8">
      <div className="grid w-full max-w-sm gap-3 rounded-xl bg-card px-6 py-6 shadow-(--custom-shadow)">
        <span
          className="text-[40px] leading-none font-semibold tracking-tight text-foreground"
          style={{
            fontOpticalSizing: "none",
            fontVariationSettings: mode === "text" ? '"opsz" 14' : '"opsz" 32',
          }}
        >
          Quarterly
        </span>
        <span
          className="text-[40px] leading-none font-semibold tracking-tight text-foreground"
          style={{
            fontOpticalSizing: "none",
            fontVariationSettings: mode === "text" ? '"opsz" 14' : '"opsz" 32',
          }}
        >
          revenue
        </span>
      </div>
      <SegmentedControl
        ariaLabel="Optical size"
        onChange={setMode}
        options={OPSZ_OPTIONS}
        value={mode}
      />
    </Demo>
  );
}

type Hanging = "box" | "glyph";

const HANGING_OPTIONS = [
  { value: "box", label: "Box edge" },
  { value: "glyph", label: "Letter edge" },
] as const;

export function HangingPunctuationDemo() {
  const [mode, setMode] = useState<Hanging>("box");

  return (
    <Demo className="gap-8">
      <div className="relative w-full max-w-sm rounded-xl bg-card px-8 py-6 shadow-(--custom-shadow)">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-4 left-8 w-px bg-rose-500"
        />
        <span
          aria-hidden="true"
          className="absolute top-1.5 left-8 -translate-x-1/2 text-[9px] text-rose-500"
        >
          Edge
        </span>
        <p
          className="text-lg leading-snug font-medium text-foreground transition-[text-indent] duration-200 ease-out motion-reduce:transition-none"
          style={{ textIndent: mode === "glyph" ? "-0.42em" : "0" }}
        >
          “Good design is as little design as possible.”
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Dieter Rams</p>
      </div>
      <SegmentedControl
        ariaLabel="Quote alignment"
        onChange={setMode}
        options={HANGING_OPTIONS}
        value={mode}
      />
    </Demo>
  );
}
