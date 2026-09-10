import "server-only";

import type { EmailMessage } from "@/server/email/contracts";
import { renderBrandedEmail } from "@/server/email/template";

export function createBrandedEmailMessage({
  to,
  subject,
  preheader,
  title,
  intro,
  sections,
  action,
  outro,
}: {
  to: string;
  subject: string;
  preheader?: string;
  title: string;
  intro?: string;
  sections?: Array<{
    title?: string;
    content: string;
    lead?: string;
    fields?: Array<{
      label: string;
      value: string;
      emphasize?: boolean;
    }>;
    notes?: string[];
  }>;
  action?: {
    label: string;
    href: string;
  };
  outro?: string;
}): EmailMessage {
  const rendered = renderBrandedEmail({
    preheader,
    title,
    intro,
    sections,
    action,
    outro,
  });

  return {
    to: to.trim().toLowerCase(),
    subject,
    html: rendered.html,
    text: rendered.text,
  };
}
