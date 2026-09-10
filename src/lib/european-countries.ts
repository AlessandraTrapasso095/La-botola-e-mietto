export const europeanCountries = [
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgio" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croazia" },
  { code: "CZ", name: "Repubblica Ceca" },
  { code: "DK", name: "Danimarca" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finlandia" },
  { code: "FR", name: "Francia" },
  { code: "DE", name: "Germania" },
  { code: "GR", name: "Grecia" },
  { code: "HU", name: "Ungheria" },
  { code: "IS", name: "Islanda" },
  { code: "IT", name: "Italia" },
  { code: "LV", name: "Lettonia" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lituania" },
  { code: "LU", name: "Lussemburgo" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Paesi Bassi" },
  { code: "NO", name: "Norvegia" },
  { code: "PL", name: "Polonia" },
  { code: "PT", name: "Portogallo" },
  { code: "RO", name: "Romania" },
  { code: "SK", name: "Slovacchia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spagna" },
  { code: "SE", name: "Svezia" },
  { code: "CH", name: "Svizzera" },
] as const;

export type EuropeanCountryCode = (typeof europeanCountries)[number]["code"];

export function isEuropeanCountryCode(
  value: string,
): value is EuropeanCountryCode {
  return europeanCountries.some((country) => country.code === value);
}
