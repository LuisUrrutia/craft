import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { spring, useCurrentFrame } from "remotion";

import { SectionIcon } from "@/components/app/section-icon";
import { cn } from "@/lib/utils";

import { useAnchor, useAnchorRegistry } from "../lib/anchors";
import {
  departureOf,
  DOT_SPRING,
  flightOf,
  nameShift,
  restOn,
  type Waypoint,
} from "../lib/dot";
import { NAV, navId } from "../lib/content";
import { FPS, PAN, STAGE_HEIGHT, STAGE_WIDTH } from "../timeline";

const PAGES = [
  { id: navId.page("index"), label: "Index" },
  { id: navId.page("goats"), label: "GOATs" },
  { id: navId.page("resources"), label: "Resources" },
];

// The nav is drawn well over half again as big as on the site and fills the frame's
// height, fading at both ends like the site's 65vh list.
export const NAV_ZOOM = 1.7;
const PAD = 48 * NAV_ZOOM;
const VIEW_HEIGHT = STAGE_HEIGHT - PAD * 2;

const linkClass = "inline-block rounded-[3px] py-1";

function Row({
  id,
  shift,
  className,
  children,
  onOffset,
}: {
  id: string;
  shift: number;
  className?: string;
  children: React.ReactNode;
  onOffset: (id: string, el: HTMLElement) => void;
}) {
  // The dot's resting spot: 2px in from the row's left edge, at its middle.
  const anchor = useAnchor({ id, ax: 0, dx: 2 * NAV_ZOOM });
  const ref = useRef<HTMLLIElement>(null);
  useLayoutEffect(() => {
    if (ref.current) onOffset(id, ref.current);
  });
  // A stable ref callback: a fresh one each render would re-attach on every
  // commit and set state in a loop.
  const setRef = useCallback(
    (el: HTMLLIElement | null) => {
      ref.current = el;
      anchor(el);
    },
    [anchor]
  );
  return (
    <li ref={setRef} className={cn("relative", className)}>
      <span
        className="inline-block"
        style={{ transform: `translateX(${shift}px)` }}
      >
        {children}
      </span>
    </li>
  );
}

/**
 * The site's sidebar nav, centred in its own screen of the world and
 * frame-driven: the dot itself is drawn elsewhere, but names recoil and
 * sweep when it lands, and the list scrolls to follow it.
 */
export function Sidebar({
  waypoints,
  style,
}: {
  waypoints: Waypoint[];
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const listRef = useRef<HTMLDivElement>(null);
  const offsets = useRef(new Map<string, number>()).current;
  const [, setVersion] = useState(0);
  const { stageRef } = useAnchorRegistry();

  // Stage px per screen px: the stage is zoomed and Studio scales the canvas.
  const scale = () => {
    const stage = stageRef.current;
    return stage ? STAGE_WIDTH / stage.getBoundingClientRect().width : 1;
  };

  const onOffset = (id: string, el: HTMLElement) => {
    const list = listRef.current;
    if (!list) return;
    const k = scale();
    const top =
      (el.getBoundingClientRect().top - list.getBoundingClientRect().top) * k;
    const centre = top + (el.getBoundingClientRect().height * k) / 2;
    if (Math.abs((offsets.get(id) ?? -1) - centre) > 0.01) {
      offsets.set(id, centre);
      setVersion((v) => v + 1);
    }
  };

  // Which nav rows the dot is leaving and heading to, for the scroll.
  const navWaypoints = waypoints.filter(
    (w) => typeof w.target === "string" && w.target.startsWith("nav:")
  );
  let current = -1;
  for (let i = 0; i < navWaypoints.length; i++) {
    if (frame >= departureOf(navWaypoints[i])) current = i;
  }
  const listHeight = listRef.current
    ? listRef.current.getBoundingClientRect().height * scale()
    : 0;
  // The list scrolls so the row the dot is on sits at the vertical centre,
  // even for the first rows (the list may start below the top of the view),
  // so the dot meets Index dead centre. It only stops short at the end.
  const scrollFor = (w: Waypoint | undefined) => {
    if (!w) return 0;
    const centre = offsets.get(w.target as string) ?? 0;
    return Math.min(listHeight - VIEW_HEIGHT, centre - VIEW_HEIGHT / 2);
  };
  let scroll = 0;
  if (current >= 0) {
    const next = navWaypoints[current];
    const to = scrollFor(next);
    // The list enters already scrolled for its first row, so the dot's
    // first landing is on a row that is not moving.
    const from = current > 0 ? scrollFor(navWaypoints[current - 1]) : to;
    const p = spring({
      frame: frame - departureOf(next),
      fps: FPS,
      config: DOT_SPRING,
      durationInFrames: flightOf(next),
      durationRestThreshold: 0.001,
    });
    scroll = from + (to - from) * p;
  }

  const shiftFor = (id: string, amount: number) =>
    nameShift(restOn(waypoints, id, frame), frame, amount);
  const isActive = (id: string) => {
    const rest = restOn(waypoints, id, frame);
    return rest !== null && rest.left === null;
  };

  return (
    <aside
      className="absolute top-0 flex justify-center"
      style={{ left: PAN, width: STAGE_WIDTH, height: STAGE_HEIGHT, ...style }}
      aria-hidden="true"
    >
      <nav
        className="fade-mask-y overflow-hidden py-12"
        style={{ height: STAGE_HEIGHT / NAV_ZOOM, zoom: NAV_ZOOM }}
      >
        <div
          ref={listRef}
          className="relative"
          style={{ transform: `translateY(${-scroll / NAV_ZOOM}px)` }}
        >
          <ul className="flex flex-col gap-1 text-xs">
            {PAGES.map((page) => (
              <Row
                key={page.id}
                id={page.id}
                shift={shiftFor(page.id, 10)}
                onOffset={onOffset}
              >
                <span
                  className={cn(
                    linkClass,
                    isActive(page.id)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {page.label}
                </span>
              </Row>
            ))}
            {NAV.map(({ section, concepts }) => {
              const sectionId = navId.section(section);
              return (
                <li key={section} className="mt-5">
                  <ul>
                    <Row
                      id={sectionId}
                      shift={shiftFor(sectionId, 12)}
                      onOffset={onOffset}
                    >
                      <span className="flex items-center gap-1.5 py-1 text-foreground">
                        <SectionIcon
                          section={section}
                          size={13}
                          className="mb-px"
                        />
                        <span>{section}</span>
                      </span>
                    </Row>
                  </ul>
                  <ul className="mt-1 flex flex-col">
                    {concepts.map((c) => {
                      const id = navId.concept(c.slug);
                      return (
                        <Row
                          key={c.slug}
                          id={id}
                          shift={shiftFor(id, 12)}
                          onOffset={onOffset}
                        >
                          <span
                            className={cn(
                              linkClass,
                              isActive(id)
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {c.title}
                          </span>
                        </Row>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
