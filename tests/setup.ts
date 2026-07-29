import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter(Boolean)
    .forEach((cookieName) => {
      document.cookie = `${cookieName}=; Max-Age=0; Path=/`;
    });
  document.body.innerHTML = "";
  document.body.removeAttribute("data-scroll-locked");
  document.body.removeAttribute("style");
  document.documentElement.className = "";
  window.localStorage.clear();
  vi.restoreAllMocks();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;
globalThis.requestAnimationFrame = (callback) =>
  window.setTimeout(() => callback(performance.now()), 0);
globalThis.cancelAnimationFrame = (identifier) =>
  window.clearTimeout(identifier);

Element.prototype.scrollIntoView = vi.fn();
