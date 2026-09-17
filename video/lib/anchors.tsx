"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { continueRender, delayRender } from "remotion";

import { STAGE_WIDTH } from "../timeline";

export type Point = { x: number; y: number };

type Registry = {
  map: Map<string, Point>;
  version: number;
  bump: () => void;
  stageRef: RefObject<HTMLDivElement | null>;
};

const AnchorContext = createContext<Registry | null>(null);

/**
 * Named positions in stage coordinates that the dot can fly to. Elements
 * register themselves after layout; the dot reads them at render time.
 * Positions are kept after unmount so a flight that started from a scene
 * that has since left still knows where it took off from.
 */
export function AnchorProvider({
  stageRef,
  children,
}: {
  stageRef: RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  const map = useRef(new Map<string, Point>()).current;
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);
  return (
    <AnchorContext.Provider value={{ map, version, bump, stageRef }}>
      {children}
    </AnchorContext.Provider>
  );
}

export function useAnchorRegistry() {
  const registry = useContext(AnchorContext);
  if (!registry) throw new Error("useAnchorRegistry outside AnchorProvider");
  return registry;
}

export type AnchorSpec = {
  id: string;
  /** Fraction of the element's width/height the point sits at (0.5 = centre). */
  ax?: number;
  ay?: number;
  /** Extra offset in stage px. */
  dx?: number;
  dy?: number;
};

function measure(
  el: Element,
  stage: HTMLElement,
  { ax = 0.5, ay = 0.5, dx = 0, dy = 0 }: AnchorSpec
): Point {
  const s = stage.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  // Studio scales the canvas and the stage is zoomed; measure relative to the
  // stage's own rendered width so both cancel out.
  const k = STAGE_WIDTH / s.width;
  return {
    x: (r.left - s.left) * k + r.width * k * ax + dx,
    y: (r.top - s.top) * k + r.height * k * ay + dy,
  };
}

function useRegister(spec: AnchorSpec, el: Element | null) {
  const { map, bump, stageRef } = useAnchorRegistry();
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!el || !stage) return;
    const next = measure(el, stage, spec);
    const prev = map.get(spec.id);
    if (
      !prev ||
      Math.abs(prev.x - next.x) > 0.01 ||
      Math.abs(prev.y - next.y) > 0.01
    ) {
      map.set(spec.id, next);
      bump();
    }
  });
}

/** Ref callback that registers the element it is attached to. */
export function useAnchor(spec: AnchorSpec) {
  const [el, setEl] = useState<Element | null>(null);
  useRegister(spec, el);
  return setEl;
}

/**
 * Registers anchors on descendants found by selector, so the dot can target
 * controls inside the site's real components without touching them.
 */
export function Probe({
  anchors,
  className,
  children,
}: {
  anchors: (AnchorSpec & { selector: string })[];
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { map, bump, stageRef } = useAnchorRegistry();
  const take = () => {
    const root = ref.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    let changed = false;
    for (const spec of anchors) {
      const el = root.querySelector(spec.selector);
      if (!el) continue;
      const next = measure(el, stage, spec);
      const prev = map.get(spec.id);
      if (
        !prev ||
        Math.abs(prev.x - next.x) > 0.01 ||
        Math.abs(prev.y - next.y) > 0.01
      ) {
        map.set(spec.id, next);
        changed = true;
      }
    }
    if (changed) bump();
  };
  useLayoutEffect(take);
  // Some controls (Base UI's slider thumb) only settle after a resize
  // observer fires, so measure again after the browser has painted and hold
  // the frame until then.
  useEffect(() => {
    const handle = delayRender("probe");
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        take();
        continueRender(handle);
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      continueRender(handle);
    };
  });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
