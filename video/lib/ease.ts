/** Fade + small rise, as a style. `t` is 0..1. */
export function enter(t: number, rise = 8): React.CSSProperties {
  const eased = 1 - (1 - t) * (1 - t);
  return {
    opacity: eased,
    transform: `translateY(${(1 - eased) * rise}px)`,
  };
}
