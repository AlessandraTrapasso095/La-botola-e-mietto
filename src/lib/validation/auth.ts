import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Usa almeno 8 caratteri.")
  .regex(/[A-Z]/, "Aggiungi una lettera maiuscola.")
  .regex(/[a-z]/, "Aggiungi una lettera minuscola.")
  .regex(/\d/, "Aggiungi un numero.")
  .regex(/[^A-Za-z0-9]/, "Aggiungi un simbolo.");

const normalizedEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Inserisci un indirizzo email valido."));

export const loginInputSchema = z.object({
  email: normalizedEmailSchema,
  password: z.string().min(8),
});

export const registrationInputSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  email: normalizedEmailSchema,
  password: passwordSchema,
  privacyConsent: z.literal(true),
  marketingConsent: z.boolean(),
  adultConfirmation: z.literal(true),
});

export const passwordResetInputSchema = z.object({
  email: normalizedEmailSchema,
});

export const passwordUpdateInputSchema = z.object({
  password: passwordSchema,
});

export const profileUpdateInputSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(40),
  birthDate: z.union([
    z.literal(""),
    z.iso.date().refine((value) => new Date(value) <= new Date(), {
      message: "La data di nascita non può essere futura.",
    }),
  ]),
});

export const preferencesUpdateInputSchema = z.object({
  marketingConsent: z.boolean(),
  emailUpdates: z.boolean(),
});

export const accountUserSchema = z.object({
  id: z.string().min(1),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string(),
  birthDate: z.string(),
  marketingConsent: z.boolean(),
  emailUpdates: z.boolean(),
});

export const accountRegistrationResultSchema = z.object({
  status: z.enum(["authenticated", "confirmation-required"]),
  user: accountUserSchema.nullable(),
});
