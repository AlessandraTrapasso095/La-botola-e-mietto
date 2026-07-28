export type CurrencyCode = "EUR";

export type Money = Readonly<{
  amountMinor: bigint;
  currency: CurrencyCode;
}>;
