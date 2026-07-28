export const ageGateConfig = {
  cookieName: "lbm_age_confirmed",
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
        "Categoria predisposta per funzioni facoltative non ancora installate.",
    },
    analytics: {
      label: "Misurazione",
      required: false,
      description:
        "Categoria predisposta per strumenti di analisi non ancora installati.",
    },
    marketing: {
      label: "Marketing",
      required: false,
      description:
        "Categoria predisposta per servizi promozionali non ancora installati.",
    },
  },
} as const;
