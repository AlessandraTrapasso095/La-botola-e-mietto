import "server-only";

type EmailTemplateAction = {
  label: string;
  href: string;
};

type EmailTemplateSectionField = {
  label: string;
  value: string;
  emphasize?: boolean;
};

type EmailTemplateSection = {
  title?: string;
  content: string;
  lead?: string;
  fields?: EmailTemplateSectionField[];
  notes?: string[];
};

type RenderBrandedEmailInput = {
  preheader?: string;
  title: string;
  intro?: string;
  sections?: EmailTemplateSection[];
  action?: EmailTemplateAction;
  outro?: string;
};

const BRAND_NAME = "La Botola e Mietto";

const EMAIL_LOGO_URL =
  "https://nabdgsxbqvtgeqnjaglx.supabase.co/storage/v1/object/public/email-assets/mietto-logo.png";

const AUTOMATIC_FOOTER =
  "Questa email è stata generata automaticamente. Ti chiediamo di non rispondere a questo messaggio.";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeUrl(value: string) {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Protocollo non valido.");
    }

    return url.toString();
  } catch {
    throw new Error("Link email non valido.");
  }
}

function renderTextSection(section: EmailTemplateSection) {
  const parts = [];

  if (section.title) {
    parts.push(section.title);
  }

  parts.push(section.content);

  return parts.join("\n");
}

export function renderBrandedEmail({
  preheader,
  title,
  intro,
  sections = [],
  action,
  outro,
}: RenderBrandedEmailInput) {
  const safeTitle = escapeHtml(title);
  const safeIntro = intro ? escapeHtml(intro) : null;
  const safeOutro = outro ? escapeHtml(outro) : null;
  const safePreheader = preheader ? escapeHtml(preheader) : safeTitle;

  const actionUrl = action ? normalizeUrl(action.href) : null;

  const htmlSections = sections
    .map((section) => {
      const sectionTitle = section.title
        ? `
          <h2
            style="
              margin:0 0 10px;
              font-family:Arial,Helvetica,sans-serif;
              font-size:18px;
              line-height:1.35;
              color:#1b1b1b;
            "
          >
            ${escapeHtml(section.title)}
          </h2>
        `
        : "";

      const leadHtml = section.lead
        ? `
          <p
            style="
              margin:0 0 18px;
              font-family:Arial,Helvetica,sans-serif;
              font-size:15px;
              line-height:1.65;
              color:#4a4038;
            "
          >
            ${escapeHtml(section.lead)}
          </p>
        `
        : "";

      const fieldsHtml =
        section.fields && section.fields.length > 0
          ? `
            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="
                width:100%;
                border-collapse:collapse;
                background:#ffffff;
                border:1px solid #ead7c5;
                border-radius:10px;
              "
            >
              ${section.fields
                .map(
                  (field, index) => `
                    <tr>
                      <td
                        style="
                          padding:${index === 0 ? "16px 16px 12px" : "12px 16px"};
                          ${index > 0 ? "border-top:1px solid #f1e6dc;" : ""}
                          font-family:Arial,Helvetica,sans-serif;
                        "
                      >
                        <div
                          style="
                            margin:0 0 5px;
                            font-size:11px;
                            line-height:1.4;
                            font-weight:700;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            color:#a76220;
                          "
                        >
                          ${escapeHtml(field.label)}
                        </div>

                        <div
                          style="
                            margin:0;
                            font-size:${field.emphasize ? "18px" : "15px"};
                            line-height:1.55;
                            font-weight:${field.emphasize ? "700" : "600"};
                            color:#211b17;
                            overflow-wrap:anywhere;
                            word-break:break-word;
                          "
                        >
                          ${escapeHtml(field.value)}
                        </div>
                      </td>
                    </tr>
                  `,
                )
                .join("")}
            </table>
          `
          : `
            <div
              style="
                margin:0;
                font-family:Arial,Helvetica,sans-serif;
                font-size:15px;
                line-height:1.65;
                color:#4a4038;
                white-space:pre-line;
              "
            >
              ${escapeHtml(section.content)}
            </div>
          `;

      const notesHtml =
        section.notes && section.notes.length > 0
          ? `
            <div style="margin-top:18px;">
              ${section.notes
                .map(
                  (note, index) => `
                    <p
                      style="
                        margin:${index === 0 ? "0" : "10px 0 0"};
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:14px;
                        line-height:1.65;
                        color:#675b51;
                      "
                    >
                      ${escapeHtml(note)}
                    </p>
                  `,
                )
                .join("")}
            </div>
          `
          : "";

      return `
        <div
          style="
            margin:0 0 22px;
            padding:20px;
            background:#fff8f1;
            border:1px solid #f0dfcf;
            border-radius:12px;
          "
        >
          ${sectionTitle}
          ${leadHtml}
          ${fieldsHtml}
          ${notesHtml}
        </div>
      `;
    })
    .join("");

  const actionHtml =
    action && actionUrl
      ? `
        <div style="margin:30px 0;text-align:center;">
          <a
            href="${escapeHtml(actionUrl)}"
            style="
              display:inline-block;
              padding:14px 22px;
              background:#d97706;
              color:#ffffff;
              text-decoration:none;
              border-radius:8px;
              font-family:Arial,Helvetica,sans-serif;
              font-size:15px;
              font-weight:700;
            "
          >
            ${escapeHtml(action.label)}
          </a>
        </div>
      `
      : "";

  const html = `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${safeTitle}</title>
</head>
<body
  style="
    margin:0;
    padding:0;
    background:#f6f1eb;
  "
>
  <div
    style="
      display:none;
      max-height:0;
      overflow:hidden;
      opacity:0;
      color:transparent;
    "
  >
    ${safePreheader}
  </div>

  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="background:#f6f1eb;padding:24px 12px;"
  >
    <tr>
      <td align="center">
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            max-width:640px;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 8px 24px rgba(0,0,0,0.06);
          "
        >
          <tr>
            <td
              style="
                padding:26px 28px 22px;
                text-align:center;
                background:#111111;
              "
            >
              <img
                src="${EMAIL_LOGO_URL}"
                alt="${BRAND_NAME}"
                width="180"
                style="
                  display:block;
                  width:180px;
                  max-width:100%;
                  height:auto;
                  margin:0 auto;
                  border:0;
                "
              />

              <div
                style="
                  margin-top:12px;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:12px;
                  line-height:1.4;
                  color:#f3a64a;
                  text-transform:uppercase;
                  letter-spacing:1.6px;
                "
              >
                La Botola e Mietto
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:34px 30px 14px;">
              <h1
                style="
                  margin:0 0 18px;
                  font-family:Georgia,'Times New Roman',serif;
                  font-size:30px;
                  line-height:1.25;
                  color:#171717;
                "
              >
                ${safeTitle}
              </h1>

              ${
                safeIntro
                  ? `
                    <p
                      style="
                        margin:0 0 24px;
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:16px;
                        line-height:1.7;
                        color:#4d463f;
                      "
                    >
                      ${safeIntro}
                    </p>
                  `
                  : ""
              }

              ${htmlSections}

              ${actionHtml}

              ${
                safeOutro
                  ? `
                    <p
                      style="
                        margin:24px 0 0;
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:15px;
                        line-height:1.65;
                        color:#4d463f;
                      "
                    >
                      ${safeOutro}
                    </p>
                  `
                  : ""
              }
            </td>
          </tr>

          <tr>
            <td
              style="
                padding:24px 30px 30px;
                border-top:1px solid #eee6dd;
              "
            >
              <p
                style="
                  margin:0 0 8px;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:12px;
                  line-height:1.6;
                  color:#7a7168;
                  text-align:center;
                "
              >
                ${AUTOMATIC_FOOTER}
              </p>

              <p
                style="
                  margin:0;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:12px;
                  line-height:1.6;
                  color:#9a9188;
                  text-align:center;
                "
              >
                ${BRAND_NAME}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textParts = [
    BRAND_NAME,
    "",
    title,
    "",
    intro,
    ...sections.flatMap((section) => ["", renderTextSection(section)]),
    action ? `\n${action.label}: ${actionUrl}` : null,
    outro ? `\n${outro}` : null,
    "",
    AUTOMATIC_FOOTER,
    BRAND_NAME,
  ].filter(Boolean);

  return {
    html,
    text: textParts.join("\n"),
  };
}
