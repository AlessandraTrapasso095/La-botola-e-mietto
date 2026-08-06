import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { socialLinks } from "@/config/social";

function expectExternalSocialLink(link: HTMLElement, href: string) {
  expect(link).toHaveAttribute("href", href);
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
}

describe("social links", () => {
  it("shows Instagram and Facebook in the footer", () => {
    render(<SiteFooter />);

    expectExternalSocialLink(
      screen.getByLabelText(socialLinks.instagram.ariaLabel),
      socialLinks.instagram.href,
    );
    expectExternalSocialLink(
      screen.getByLabelText("Facebook Mietto Beverage"),
      socialLinks.facebook.href,
    );
  });

  it("shows the same confirmed social links in the mobile menu", () => {
    render(
      <MobileNavigation
        accountReady
        open
        onOpenChange={vi.fn()}
        onSearch={vi.fn()}
        onUtility={vi.fn()}
        triggerRef={createRef<HTMLButtonElement>()}
        menuGroups={[]}
      />,
    );

    expectExternalSocialLink(
      screen.getByLabelText(socialLinks.instagram.ariaLabel),
      socialLinks.instagram.href,
    );
    expectExternalSocialLink(
      screen.getByLabelText("Facebook Mietto Beverage"),
      socialLinks.facebook.href,
    );
  });
});
