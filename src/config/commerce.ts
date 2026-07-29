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
  returnExceptions: [
    "Beni che rischiano di deteriorarsi o scadere rapidamente.",
    "Beni sigillati che non si prestano a essere restituiti per motivi igienici o connessi alla tutela della salute e che sono stati aperti dopo la consegna.",
    "Bevande alcoliche il cui prezzo sia stato concordato alla conclusione del contratto, con consegna oltre trenta giorni e valore dipendente da fluttuazioni di mercato non controllabili dal venditore.",
  ],
  corkDefectProcedureRequired: true,
  corkDefectProcedure:
    "Conservare la bottiglia, il tappo e una quantità sufficiente del contenuto per consentire le verifiche necessarie.",
} as const;
