import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const iconDefaults = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function SearchIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path d="M6 8h12l1 12H5L6 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
