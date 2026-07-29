export const ageGateConfig = {
  cookieName: "lbm_age_confirmed",
  reopenEventName: "lbm:open-age-gate",
  validityDays: 180,
  minimumAge: 18,
  exitDestination: "https://www.google.it/",
} as const;

export const cookieConsentConfig = {
  cookieName: "lbm_cookie_preferences",
  validityDays: 180,
  categories: {
    necessary: {
      label: "Necessari",
      required: true,
      description:
        "Funzioni indispensabili per sicurezza, navigazione e preferenze richieste.",
    },
    preferences: {
      label: "Preferenze",
      required: false,
      description:
        "Ricordano scelte facoltative per rendere la navigazione più personale.",
    },
    analytics: {
      label: "Statistiche",
      required: false,
      description:
        "Aiutano a comprendere in forma aggregata come viene utilizzato il sito.",
    },
    marketing: {
      label: "Marketing",
      required: false,
      description:
        "Consentono contenuti promozionali pertinenti sui canali autorizzati.",
    },
  },
} as const;
