import { afterEach, describe, expect, it, vi } from "vitest";

import {
  logOperationalError,
  type OperationalEvent,
} from "@/server/monitoring/operational-log";

describe("operational monitoring runtime", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each<OperationalEvent>([
    "stripe.webhook.signature_invalid",
    "stripe.webhook.processing_failed",
  ])("emette soltanto il codice evento sanitizzato: %s", (event) => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    logOperationalError(event);

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith("[operational]", {
      event,
    });

    const [label, payload] = errorSpy.mock.calls[0] ?? [];

    expect(label).toBe("[operational]");
    expect(payload).toEqual({ event });
    expect(Object.keys(payload as Record<string, unknown>)).toEqual(["event"]);
  });
});
