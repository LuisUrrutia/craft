"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArchiveIcon,
  CalendarBlankIcon,
  CheckIcon,
  LinkIcon,
  PaperclipIcon,
  PaperPlaneTiltIcon,
  SunIcon,
  TrayIcon,
  XIcon,
} from "@phosphor-icons/react";
import { definePatch, ensureReady } from "@web-kits/audio";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { playSoundAlways, progressionDetune } from "@/lib/sounds";
import { cn } from "@/lib/utils";

const CARD =
  "w-full max-w-sm rounded-xl bg-card text-sm shadow-(--custom-shadow)";

const ROW =
  "flex min-h-12 items-center justify-between gap-4 px-4 py-2.5 text-foreground";

/* Real controls, each with its own cue from the site's Minimal patch */

export function SoundCuesDemo() {
  const [synced, setSynced] = useState(true);
  const [done, setDone] = useState(false);
  const [sent, setSent] = useState(false);
  const [attached, setAttached] = useState(true);
  const sentTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reduced = useReducedMotion();

  useEffect(() => () => clearTimeout(sentTimer.current), []);

  const send = () => {
    if (sent) return;
    playSoundAlways("success");
    setSent(true);
    sentTimer.current = setTimeout(() => setSent(false), 1600);
  };

  return (
    <Demo>
      <div
        className={cn(
          CARD,
          "divide-y divide-[#E7E7E7] dark:divide-[#1E1E1E]"
        )}
      >
        <div className={ROW}>
          <span>Sync across devices</span>
          <Switch
            aria-label="Sync across devices"
            checked={synced}
            onCheckedChange={(next) => {
              playSoundAlways("toggle");
              setSynced(next);
            }}
          />
        </div>

        <label className={cn(ROW, "cursor-pointer justify-start gap-3")}>
          <Checkbox
            aria-label="Ship the release notes"
            checked={done}
            onCheckedChange={(next) => {
              playSoundAlways("tick");
              setDone(next);
            }}
          />
          <span
            className={cn(
              "transition-colors duration-150 motion-reduce:transition-none",
              done && "text-muted-foreground line-through"
            )}
          >
            Ship the release notes
          </span>
        </label>

        <div className={ROW}>
          <span className="min-w-0 truncate">Reply to Ana</span>
          <Button
            variant="secondary"
            size="sm"
            aria-live="polite"
            className="min-w-[4.75rem]"
            onClick={send}
          >
            {sent ? (
              <>
                <CheckIcon weight="bold" aria-hidden="true" />
                Sent
              </>
            ) : (
              <>
                <PaperPlaneTiltIcon aria-hidden="true" />
                Send
              </>
            )}
          </Button>
        </div>

        <div className={ROW}>
          <span>Attachment</span>
          <AnimatePresence mode="wait" initial={false}>
            {attached ? (
              <motion.span
                key="chip"
                exit={reduced ? undefined : { scale: 0.85, opacity: 0 }}
                transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
                className="inline-flex items-center gap-1 rounded-md bg-muted py-0.5 pr-0.5 pl-2 text-xs"
              >
                <PaperclipIcon aria-hidden="true" className="size-3.5" />
                brief.pdf
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Remove brief.pdf"
                  className="size-5 rounded-sm"
                  onClick={() => {
                    playSoundAlways("pop");
                    setAttached(false);
                  }}
                >
                  <XIcon aria-hidden="true" className="size-3" />
                </Button>
              </motion.span>
            ) : (
              <motion.span
                key="undo"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.14 }}
              >
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    playSoundAlways("tick");
                    setAttached(true);
                  }}
                >
                  Undo
                </Button>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Demo>
  );
}

/* The same action at three levels */

// The site's success cue, pushed far past where it should sit: louder
// layers and a longer tail. Only here so the reader can hear the difference.
const levels = definePatch({
  name: "Levels",
  sounds: {
    loud: {
      layers: [523, 659, 784, 1047].map((frequency, i) => ({
        source: { type: "square", frequency },
        envelope: { attack: 0, decay: 0.16, sustain: 0, release: 0.06 },
        gain: 0.2,
        delay: i * 0.06,
      })),
    },
  },
});

async function playLevel(name: string) {
  try {
    await ensureReady();
    levels.play(name);
  } catch {
    // Audio unavailable before a user gesture. Stay silent.
  }
}

type Level = "silent" | "quiet" | "loud";

const LEVEL_OPTIONS = [
  { value: "silent", label: "Silent" },
  { value: "quiet", label: "Quiet" },
  { value: "loud", label: "Loud" },
] as const satisfies readonly { value: Level; label: string }[];

export function SoundLevelDemo() {
  const [level, setLevel] = useState<Level>("quiet");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    if (level === "quiet") playSoundAlways("success", { volume: 0.35 });
    if (level === "loud") void playLevel("loud");
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Demo className="gap-8">
      <div className={cn(CARD, "flex items-center gap-3 px-4 py-3")}>
        <LinkIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
        />
        <span className="min-w-0 flex-1 truncate text-muted-foreground">
          linear.app/craft/issue/CRA-142
        </span>
        <Button
          variant="secondary"
          size="sm"
          aria-live="polite"
          className="min-w-[4.75rem]"
          onClick={copy}
        >
          {copied ? (
            <>
              <CheckIcon weight="bold" aria-hidden="true" />
              Copied
            </>
          ) : (
            "Copy"
          )}
        </Button>
      </div>
      <SegmentedControl
        ariaLabel="Sound level"
        options={LEVEL_OPTIONS}
        value={level}
        onChange={setLevel}
      />
    </Demo>
  );
}

/* Hover is a whisper or nothing */

type HoverSound = "silent" | "whisper" | "tick";

const HOVER_OPTIONS = [
  { value: "silent", label: "Silent" },
  { value: "whisper", label: "Whisper" },
  { value: "tick", label: "Tick" },
] as const satisfies readonly { value: HoverSound; label: string }[];

const NAV = [
  { label: "Inbox", icon: TrayIcon, count: 12 },
  { label: "Today", icon: SunIcon, count: 4 },
  { label: "Upcoming", icon: CalendarBlankIcon, count: 9 },
  { label: "Archive", icon: ArchiveIcon, count: 0 },
] as const;

export function HoverSoundDemo() {
  const [hoverSound, setHoverSound] = useState<HoverSound>("whisper");
  const [active, setActive] = useState(0);

  const hover = (index: number) => {
    if (hoverSound === "whisper") {
      playSoundAlways("hover", { detune: progressionDetune(index) });
    } else if (hoverSound === "tick") {
      playSoundAlways("tick");
    }
  };

  return (
    <Demo className="gap-8">
      <nav aria-label="Lists" className={cn(CARD, "p-1.5")}>
        <ul className="grid gap-0.5">
          {NAV.map(({ label, icon: Icon, count }, i) => (
            <li key={label}>
              <button
                type="button"
                aria-current={active === i ? "page" : undefined}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") hover(i);
                }}
                onClick={() => {
                  playSoundAlways("tick");
                  setActive(i);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors duration-100 outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring/50 motion-reduce:transition-none",
                  active === i
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {count > 0 && (
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {count}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <SegmentedControl
        ariaLabel="Hover sound"
        options={HOVER_OPTIONS}
        value={hoverSound}
        onChange={setHoverSound}
      />
    </Demo>
  );
}
