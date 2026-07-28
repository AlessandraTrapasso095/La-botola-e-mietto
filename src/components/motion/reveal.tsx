"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
} from "react";

import { prefersReducedMotion } from "@/lib/browser/motion";
import { cn } from "@/lib/cn";

type RevealProps = ComponentPropsWithoutRef<"div"> & {
  delayStep?: number;
};

type RevealStyle = CSSProperties & {
  "--reveal-delay"?: string;
};

export function Reveal({
  children,
  className,
  delayStep = 0,
  style,
  ...props
}: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      const animationFrame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(animationFrame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const revealStyle: RevealStyle = {
    ...style,
    "--reveal-delay": `calc(var(--motion-stagger) * ${delayStep})`,
  };

  return (
    <div
      ref={elementRef}
      data-reveal=""
      data-visible={isVisible}
      className={cn(className)}
      style={revealStyle}
      {...props}
    >
      {children}
    </div>
  );
}
