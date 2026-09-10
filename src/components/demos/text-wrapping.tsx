"use client";

import { CheckCircleIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Slider } from "@/components/ui/slider";

function unwrap(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : (value as number);
}

function WidthSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid w-full max-w-xs gap-2.5">
      <span className="flex justify-between text-xs text-muted-foreground">
        Width
        <span className="tabular-nums text-foreground">{value}%</span>
      </span>
      <Slider
        aria-label="Container width"
        max={100}
        min={55}
        onValueChange={(next) => onChange(unwrap(next))}
        step={1}
        value={[value]}
      />
    </label>
  );
}

const HEADING = "Introducing the new dashboard for teams";

function HeadingCard({ textWrap, width }: { textWrap: string; width: number }) {
  return (
    <div className="flex w-full justify-center rounded-xl bg-card px-4 py-5 shadow-(--custom-shadow)">
      <h3
        className="text-base leading-snug font-semibold text-foreground"
        style={{ textWrap: textWrap as React.CSSProperties["textWrap"], width: `${width}%` }}
      >
        {HEADING}
      </h3>
    </div>
  );
}

export function TextBalanceDemo() {
  const [width, setWidth] = useState(100);

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <HeadingCard textWrap="normal" width={width} />
        </CompareItem>
        <CompareItem verdict="right">
          <HeadingCard textWrap="balance" width={width} />
        </CompareItem>
      </Compare>
      <WidthSlider onChange={setWidth} value={width} />
    </Demo>
  );
}

const PARAGRAPH =
  "Exports now run in the background, so you can keep working while we prepare the file. We will send you a link when it is ready.";

function ParagraphCard({
  textWrap,
  width,
}: {
  textWrap: string;
  width: number;
}) {
  return (
    <div className="flex w-full justify-center rounded-xl bg-card px-4 py-4 shadow-(--custom-shadow)">
      <p
        className="text-sm leading-relaxed text-foreground"
        style={{ textWrap: textWrap as React.CSSProperties["textWrap"], width: `${width}%` }}
      >
        {PARAGRAPH}
      </p>
    </div>
  );
}

export function TextPrettyDemo() {
  const [width, setWidth] = useState(100);

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare className="grid-cols-1 sm:grid-cols-2">
        <CompareItem verdict="wrong">
          <ParagraphCard textWrap="normal" width={width} />
        </CompareItem>
        <CompareItem verdict="right">
          <ParagraphCard textWrap="pretty" width={width} />
        </CompareItem>
      </Compare>
      <WidthSlider onChange={setWidth} value={width} />
    </Demo>
  );
}

type Wrapping = "off" | "on";

const WRAPPING_OPTIONS = [
  { value: "off", label: "Off" },
  { value: "on", label: "On" },
] as const;

export function TextWrapToastDemo() {
  const [mode, setMode] = useState<Wrapping>("off");
  const on = mode === "on";

  return (
    <Demo className="gap-8">
      <div
        className="flex w-full max-w-[19rem] gap-3 rounded-xl bg-card px-4 py-3.5 shadow-(--custom-shadow)"
        role="status"
      >
        <CheckCircleIcon
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-emerald-500"
          weight="fill"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <span
            className="text-sm leading-snug font-medium text-foreground"
            style={{ textWrap: on ? "balance" : "normal" }}
          >
            Your workspace export is ready to download
          </span>
          <span
            className="text-xs leading-relaxed text-muted-foreground"
            style={{ textWrap: on ? "pretty" : "normal" }}
          >
            The link works for 24 hours. After that, start a new export from
            settings to get a fresh one.
          </span>
        </div>
      </div>
      <SegmentedControl
        ariaLabel="Text wrapping"
        onChange={setMode}
        options={WRAPPING_OPTIONS}
        value={mode}
      />
    </Demo>
  );
}
