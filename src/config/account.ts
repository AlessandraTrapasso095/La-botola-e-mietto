export const accountNavigation = [
  { label: "Panoramica", href: "/account" },
  { label: "Ordini", href: "/account/ordini" },
  { label: "Offerte", href: "/account/offerte" },
  { label: "Preferiti", href: "/account/preferiti" },
  { label: "Indirizzi", href: "/account/indirizzi" },
  { label: "Profilo", href: "/account/profilo" },
  { label: "Impostazioni", href: "/account/impostazioni" },
] as const;

export const accountRoutes = {
  signIn: "/accedi",
  register: "/registrati",
  forgotPassword: "/password-dimenticata",
  dashboard: "/account",
} as const;
