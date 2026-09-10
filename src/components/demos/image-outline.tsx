"use client";

import Image from "next/image";
import { type CSSProperties, useState } from "react";

import waterLiliesImage from "@/assets/claude-monet-water-lilies.jpg";
import { RIGHT_ICON, WRONG_ICON } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type EdgeMode = "none" | "outline";

const EDGE_OPTIONS = [
  { value: "none", label: "No outline", icon: WRONG_ICON },
  { value: "outline", label: "Outline", icon: RIGHT_ICON },
] as const;

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * A 1px line painted over the outermost pixels of the image. Black in light
 * mode, white in dark mode; `--edge` carries the RGB triplet per theme.
 */
function edgeStyle(opacity: number): CSSProperties {
  return {
    outline: `1px solid rgb(var(--edge) / ${opacity})`,
    outlineOffset: -1,
  };
}

const EDGE_CLASS =
  "[--edge:0_0_0] dark:[--edge:255_255_255] transition-[outline-color] duration-200 ease-out motion-reduce:transition-none";

type TileKind = "screenshot" | "photo" | "night";

function Tile({
  kind,
  opacity,
  className,
}: {
  kind: TileKind;
  opacity: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-lg",
        kind === "screenshot" && "bg-card",
        kind === "night" &&
          "bg-[radial-gradient(circle_at_30%_20%,#3a3a3a,#111111_65%)]",
        EDGE_CLASS,
        className
      )}
      style={edgeStyle(opacity)}
    >
      {kind === "photo" ? (
        <Image
          alt=""
          className="object-cover"
          fill
          placeholder="blur"
          sizes="200px"
          src={waterLiliesImage}
        />
      ) : null}
      {kind === "screenshot" ? (
        <div className="flex h-full flex-col gap-1.5 p-2.5">
          <div className="mb-0.5 flex gap-1">
            <span className="size-1.5 rounded-full bg-foreground/15" />
            <span className="size-1.5 rounded-full bg-foreground/15" />
            <span className="size-1.5 rounded-full bg-foreground/15" />
          </div>
          <span className="h-1.5 w-3/5 rounded-full bg-foreground/20" />
          <span className="h-1.5 w-4/5 rounded-full bg-foreground/10" />
          <span className="h-1.5 w-2/3 rounded-full bg-foreground/10" />
          <span className="mt-auto h-5 w-2/5 rounded-md bg-foreground/10" />
        </div>
      ) : null}
    </div>
  );
}

export function ImageOutlineDemo() {
  const [mode, setMode] = useState<EdgeMode>("none");
  const opacity = mode === "outline" ? 0.1 : 0;

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div className="w-full max-w-sm rounded-[20px] bg-card p-3 shadow-(--custom-shadow)">
        <div className="grid grid-cols-3 gap-3">
          <Tile kind="screenshot" opacity={opacity} className="aspect-square" />
          <Tile kind="photo" opacity={opacity} className="aspect-square" />
          <Tile kind="night" opacity={opacity} className="aspect-square" />
        </div>
      </div>

      <SegmentedControl
        ariaLabel="Image edge"
        onChange={setMode}
        options={EDGE_OPTIONS}
        value={mode}
      />
    </Demo>
  );
}

export function ImageOutlineStrengthDemo() {
  const [percent, setPercent] = useState(10);

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <div className="w-full max-w-sm rounded-[20px] bg-card p-3 shadow-(--custom-shadow)">
        <div className="grid grid-cols-2 gap-3">
          <Tile
            kind="screenshot"
            opacity={percent / 100}
            className="aspect-[4/3]"
          />
          <Tile kind="photo" opacity={percent / 100} className="aspect-[4/3]" />
        </div>
      </div>

      <label className="grid w-full max-w-xs gap-2.5">
        <span className="flex items-center justify-between text-xs text-muted-foreground">
          Opacity
          <span className="tabular-nums text-foreground">{percent}%</span>
        </span>
        <Slider
          aria-label="Outline opacity"
          max={40}
          min={0}
          onValueChange={(value) => setPercent(getSliderValue(value))}
          step={1}
          value={[percent]}
        />
      </label>
    </Demo>
  );
}

const PEOPLE = [
  { name: "Acme Design", role: "Workspace", avatar: "initial" },
  { name: "Claude Monet", role: "Guest", avatar: "photo" },
  { name: "Sunrise Studio", role: "Client", avatar: "pale" },
] as const;

function Avatar({
  kind,
  opacity,
}: {
  kind: (typeof PEOPLE)[number]["avatar"];
  opacity: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full",
        kind === "initial" && "bg-card text-xs font-medium text-foreground",
        kind === "pale" && "bg-gradient-to-br from-amber-50 to-orange-100",
        EDGE_CLASS
      )}
      style={edgeStyle(opacity)}
    >
      {kind === "photo" ? (
        <Image
          alt=""
          className="object-cover"
          fill
          placeholder="blur"
          sizes="32px"
          src={waterLiliesImage}
        />
      ) : null}
      {kind === "initial" ? "A" : null}
    </span>
  );
}

export function ImageOutlineAvatarDemo() {
  const [mode, setMode] = useState<EdgeMode>("none");
  const opacity = mode === "outline" ? 0.1 : 0;

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div className="w-full max-w-xs rounded-xl bg-card p-1.5 shadow-(--custom-shadow)">
        <ul className="flex flex-col">
          {PEOPLE.map((person) => (
            <li
              key={person.name}
              className="flex items-center gap-3 rounded-lg px-2.5 py-2"
            >
              <Avatar kind={person.avatar} opacity={opacity} />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-medium text-foreground">
                  {person.name}
                </span>
                <span className="truncate text-[10px] text-muted-foreground">
                  {person.role}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <SegmentedControl
        ariaLabel="Avatar edge"
        onChange={setMode}
        options={EDGE_OPTIONS}
        value={mode}
      />
    </Demo>
  );
}
