export const commerceConfig = {
  currency: "EUR",
  locale: "it-IT",
  defaultVatRateBasisPoints: 2_200n,
  pricesSourceIncludesVat: false,
} as const;

export const shippingConfig = {
  destinations: ["Italia"],
  courier: "TNT",
  indicativeDeliveryHoursFromDispatch: 72,
  protectivePackaging: true,
  insuranceAvailableOnRequest: true,
  returnWindowDays: 14,
  returnCondition: "Bottiglie integre e sigillate",
  corkDefectProcedureRequired: true,
} as const;
