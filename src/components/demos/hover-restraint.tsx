"use client";

import {
  ArchiveIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  FoldersIcon,
  LinkSimpleIcon,
  SunIcon,
  TextBIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
  TrayIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Inbox", Icon: TrayIcon },
  { label: "Today", Icon: SunIcon },
  { label: "Upcoming", Icon: CalendarBlankIcon },
  { label: "Projects", Icon: FoldersIcon },
  { label: "Archive", Icon: ArchiveIcon },
] as const;

const TOOLBAR_ACTIONS = [
  { label: "Bold", Icon: TextBIcon },
  { label: "Italic", Icon: TextItalicIcon },
  { label: "Underline", Icon: TextUnderlineIcon },
  { label: "Strikethrough", Icon: TextStrikethroughIcon },
  { label: "Link", Icon: LinkSimpleIcon },
] as const;

export function HoverRestraintDemo() {
  const examples = [
    { label: "Wrong", detail: "300ms fade in", animated: true },
    { label: "Right", detail: "Instant", animated: false },
  ] as const;

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:gap-10">
        {examples.map((example) => (
          <div
            key={example.label}
            className="flex min-w-0 flex-col items-center gap-4"
          >
            <div
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium",
                example.animated ? "text-destructive" : "text-emerald-500"
              )}
            >
              {example.animated ? (
                <XCircleIcon
                  aria-hidden="true"
                  className="size-4"
                  weight="fill"
                />
              ) : (
                <CheckCircleIcon
                  aria-hidden="true"
                  className="size-4"
                  weight="fill"
                />
              )}
              {example.label}
            </div>

            <div className="w-full rounded-xl bg-card p-1 shadow-(--custom-shadow)">
              <ul className="flex flex-col gap-0.5">
                {NAV_ITEMS.map((item) => (
                  <li
                    key={item.label}
                    className={cn(
                      "flex items-center gap-2 rounded-lg p-2 text-xs cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground",
                      example.animated && "transition-colors duration-300"
                    )}
                  >
                    <item.Icon
                      aria-hidden="true"
                      className="size-3.5 mb-px shrink-0"
                    />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <span className="text-[10px] text-muted-foreground">
              {example.detail}
            </span>
          </div>
        ))}
      </div>
    </Demo>
  );
}

export function HoverExitDemo() {
  const examples = [
    { label: "Instant both ways", fadeOut: false },
    { label: "Instant in, fade out", fadeOut: true },
  ] as const;

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:gap-10">
        {examples.map((example) => (
          <div
            key={example.label}
            className="flex min-w-0 flex-col items-center gap-4"
          >
            <div className="w-full rounded-xl bg-card p-1.5 shadow-(--custom-shadow)">
              <ul className="flex flex-col gap-0.5">
                {NAV_ITEMS.map((item) => (
                  <li
                    key={item.label}
                    className={cn(
                      "cursor-default rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground",
                      example.fadeOut &&
                        "transition-colors duration-300 hover:duration-0"
                    )}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <span className="text-[10px] text-muted-foreground">
              {example.label}
            </span>
          </div>
        ))}
      </div>

      <p className="max-w-sm text-center text-xs text-pretty text-muted-foreground">
        Both highlights appear with no delay. On the right, the old highlight
        fades out behind the cursor, which reads as polish instead of lag.
      </p>
    </Demo>
  );
}

function ToolbarButton({
  label,
  Icon,
}: {
  label: string;
  Icon: (typeof TOOLBAR_ACTIONS)[number]["Icon"];
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={label}
            className="transition-none"
            size="icon-sm"
            variant="ghost"
          >
            <Icon aria-hidden="true" className="size-4" />
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function HoverTooltipDemo() {
  return (
    <Demo className="gap-0 px-26">
      <div className="grid w-full max-w-lg grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
        <div className="flex min-w-0 flex-col items-center gap-4">
          <div className="flex items-center gap-0.5 rounded-full bg-card p-0.5 shadow-(--custom-shadow)">
            {TOOLBAR_ACTIONS.map((action) => (
              <TooltipProvider key={action.label} delay={600}>
                <ToolbarButton label={action.label} Icon={action.Icon} />
              </TooltipProvider>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">
            Every tooltip waits
          </span>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-4">
          <TooltipProvider delay={600}>
            <div className="flex items-center gap-0.5 rounded-full bg-card p-0.5 shadow-(--custom-shadow)">
              {TOOLBAR_ACTIONS.map((action) => (
                <ToolbarButton
                  key={action.label}
                  label={action.label}
                  Icon={action.Icon}
                />
              ))}
            </div>
          </TooltipProvider>
          <span className="text-[10px] text-muted-foreground">
            Only the first waits
          </span>
        </div>
      </div>
    </Demo>
  );
}
