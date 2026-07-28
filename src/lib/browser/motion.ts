export const reducedMotionMediaQuery = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(
  matchMedia:
    | ((query: string) => Pick<MediaQueryList, "matches">)
    | undefined = globalThis.window?.matchMedia?.bind(globalThis.window),
): boolean {
  return matchMedia?.(reducedMotionMediaQuery).matches ?? false;
}
