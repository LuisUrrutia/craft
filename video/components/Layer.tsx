import { useCurrentFrame } from "remotion";

import { PREMOUNT, type Scene } from "../timeline";

/**
 * Mounts a scene for its frames (plus a short premount, invisible, so its
 * anchors are measured before the dot sets off). Frames stay absolute.
 */
export function Layer({
  scene,
  children,
}: {
  scene: Scene;
  children: React.ReactNode;
}) {
  const frame = useCurrentFrame();
  const start = scene.from - PREMOUNT;
  const end = scene.from + scene.duration;
  if (frame < start || frame >= end) return null;
  const premounted = frame < scene.from;
  return (
    <div
      className="absolute inset-0"
      style={premounted ? { opacity: 0, pointerEvents: "none" } : undefined}
    >
      {children}
    </div>
  );
}
