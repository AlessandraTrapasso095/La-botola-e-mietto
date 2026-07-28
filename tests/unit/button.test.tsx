import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("espone semantica e azione native", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Conferma</Button>);
    const button = screen.getByRole("button", { name: "Conferma" });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledOnce();
    expect(button).toHaveAttribute("type", "button");
  });

  it("rispetta lo stato disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Non disponibile
      </Button>,
    );

    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
