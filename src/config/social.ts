export const socialLinks = {
  instagram: {
    id: "instagram",
    label: "Instagram",
    ariaLabel: "Instagram La Botola e Mietto",
    href: "https://www.instagram.com/labotolaemietto/",
    handle: "@labotolaemietto",
  },
  facebook: {
    id: "facebook",
    label: "Facebook",
    ariaLabel: "Facebook Mietto Beverage",
    href: "https://www.facebook.com/miettobeverage",
    handle: "Mietto Beverage",
  },
} as const;

export const confirmedSocialLinks = [
  socialLinks.instagram,
  socialLinks.facebook,
] as const;
