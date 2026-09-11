import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve("src/features/admin/admin-confirm-dialog.tsx"),
  "utf8",
);

describe("admin confirm dialog", () => {
  it("renders an accessible styled dialog", () => {
    expect(source).toContain('role="dialog"');
    expect(source).toContain('aria-modal="true"');
    expect(source).toContain("aria-labelledby");
  });

  it("supports confirm and cancel actions", () => {
    expect(source).toContain("onConfirm");
    expect(source).toContain("onCancel");
    expect(source).toContain("cancelLabel");
    expect(source).toContain("confirmLabel");
  });

  it("supports pending and error states", () => {
    expect(source).toContain("pending");
    expect(source).toContain('role="alert"');
  });

  it("supports escape and backdrop close", () => {
    expect(source).toContain('event.key === "Escape"');
    expect(source).toContain("event.target === event.currentTarget");
  });

  it("prevents background scrolling while open", () => {
    expect(source).toContain('document.body.style.overflow = "hidden"');
  });
});
