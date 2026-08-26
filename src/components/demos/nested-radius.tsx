"use client";

import { IconArchive, IconCopy, IconFolder } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

import waterLiliesImage from "@/assets/claude-monet-water-lilies.jpg";
import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

type RadiusMode = "same" | "nested";

const RADIUS_OPTIONS = [
  {
    value: "same",
    label: "Same radius",
    icon: (
      <XCircleIcon
        aria-hidden="true"
        className="size-4 text-destructive"
        weight="fill"
      />
    ),
  },
  {
    value: "nested",
    label: "Nested",
    icon: (
      <CheckCircleIcon
        aria-hidden="true"
        className="size-4 text-emerald-500"
        weight="fill"
      />
    ),
  },
] as const;

const MENU_ITEMS = [
  { label: "Duplicate", icon: IconCopy },
  { label: "Move to folder", icon: IconFolder },
  { label: "Archive", icon: IconArchive },
] as const;

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function NestedRadiusDemo() {
  const innerRadius = 16;
  const inset = 12;
  const examples = [
    {
      label: "Wrong",
      outerRadius: innerRadius,
      description: "Same radius",
    },
    {
      label: "Right",
      outerRadius: innerRadius + inset,
      description: "Radius + inset",
    },
  ] as const;

  return (
    <Demo className="gap-7 px-4">
      <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:gap-10">
        {examples.map((example) => (
          <div
            className="flex min-w-0 flex-col items-center gap-5"
            key={example.label}
          >
            <div
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium text-foreground",
                example.label === "Wrong"
                  ? "text-destructive"
                  : "text-emerald-500"
              )}
            >
              {example.label === "Wrong" ? (
                <XCircleIcon
                  className="h-4 w-4"
                  aria-label="Wrong"
                  weight="fill"
                />
              ) : (
                <CheckCircleIcon
                  className="h-4 w-4"
                  aria-label="Correct"
                  weight="fill"
                />
              )}
              {example.label}
            </div>

            <div
              className="w-full bg-muted p-3 shadow-(--custom-shadow) dark:bg-muted/30"
              style={{ borderRadius: example.outerRadius }}
            >
              <div
                className="grid h-28 place-items-center bg-card dark:bg-muted/60 shadow-(--custom-shadow) sm:h-32"
                style={{ borderRadius: innerRadius }}
              >
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <span className="tabular-nums text-xs text-foreground">
                    {example.outerRadius}px{" "}
                    <span className="mx-2 text-muted-foreground">/</span>{" "}
                    {innerRadius}px
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    outer <span className="mx-3.5"></span> inner
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="max-w-sm text-center text-xs text-pretty text-muted-foreground/70">
        With a 12px inset, the outer radius should be 28px so both curves follow
        each other.
      </p>
    </Demo>
  );
}

export function RadiusCalculatorDemo() {
  const [outerRadius, setOuterRadius] = useState(32);
  const [inset, setInset] = useState(12);
  const innerRadius = Math.max(0, outerRadius - inset);

  function updateInnerRadius(value: number) {
    setOuterRadius(value + inset);
  }

  return (
    <Demo className="gap-12 px-4 sm:px-8">
      <div className="flex flex-col items-center gap-3" aria-hidden="true">
        <div
          className="bg-muted p-(--demo-inset) shadow-(--custom-shadow) transition-[border-radius,padding] duration-200 ease-out motion-reduce:transition-none dark:bg-muted/30"
          style={
            {
              "--demo-inset": `${inset}px`,
              borderRadius: outerRadius,
            } as React.CSSProperties
          }
        >
          <div
            className="grid h-36 w-72 place-items-center bg-card shadow-(--custom-shadow) transition-[border-radius] duration-200 ease-out motion-reduce:transition-none dark:bg-muted/60"
            style={{ borderRadius: innerRadius }}
          >
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="tabular-nums text-xs text-foreground">
                {outerRadius}px{" "}
                <span className="mx-2 text-muted-foreground">/</span>{" "}
                {innerRadius}px
              </span>
              <span className="text-[10px] text-muted-foreground">
                outer <span className="mx-3.5" /> inner
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid w-full max-w-xs gap-5 mb-4">
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Outer radius
            <span className="font-mono text-[10px] text-foreground">
              {outerRadius}px
            </span>
          </span>
          <Slider
            aria-label="Outer radius"
            max={48}
            min={12}
            onValueChange={(value) => setOuterRadius(getSliderValue(value))}
            step={1}
            value={[outerRadius]}
          />
        </label>
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Inset
            <span className="font-mono text-[10px] text-foreground">
              {inset}px
            </span>
          </span>
          <Slider
            aria-label="Inset"
            max={28}
            min={4}
            onValueChange={(value) => setInset(getSliderValue(value))}
            step={1}
            value={[inset]}
          />
        </label>
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Inner radius
            <span className="font-mono text-[10px] text-foreground">
              {innerRadius}px
            </span>
          </span>
          <Slider
            aria-label="Inner radius"
            max={Math.max(0, 48 - inset)}
            min={0}
            onValueChange={(value) => updateInnerRadius(getSliderValue(value))}
            step={1}
            value={[innerRadius]}
          />
        </label>
      </div>
    </Demo>
  );
}

export function NestedRadiusExamplesDemo() {
  const [mode, setMode] = useState<RadiusMode>("same");
  const nested = mode === "nested";

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <div
        aria-hidden="true"
        className="grid w-full max-w-lg gap-8 sm:grid-cols-[1.1fr_0.9fr]"
      >
        <div
          className="bg-card p-2 shadow-(--custom-shadow)"
          style={{ borderRadius: 16 }}
        >
          <div
            className="relative h-32 overflow-hidden bg-muted transition-[border-radius] duration-200 ease-out motion-reduce:transition-none"
            style={{ borderRadius: nested ? 8 : 16 }}
          >
            <Image
              alt=""
              className="object-cover"
              fill
              placeholder="blur"
              src={waterLiliesImage}
              style={{
                outline: "1px solid rgba(0, 0, 0, 0.05)",
                outlineOffset: "-1px",
              }}
            />
          </div>
          <div className="flex items-center justify-between px-2 pb-1 pt-3">
            <div>
              <p className="text-xs text-foreground">Water Lilies</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Claude Monet
              </p>
            </div>
          </div>
        </div>

        <div
          className="self-center bg-card p-1 shadow-(--custom-shadow)"
          style={{ borderRadius: 12 }}
        >
          {MENU_ITEMS.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "flex h-8 items-center gap-2.5 px-2.5 text-xs transition-[border-radius] duration-200 ease-out motion-reduce:transition-none",
                index === 0 ? "bg-muted text-primary" : "text-muted-foreground"
              )}
              style={{ borderRadius: nested ? 8 : 12 }}
            >
              <item.icon aria-hidden="true" className="size-3.5 shrink-0" />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <SegmentedControl
        ariaLabel="Component radius comparison"
        onChange={setMode}
        options={RADIUS_OPTIONS}
        value={mode}
      />
    </Demo>
  );
}
