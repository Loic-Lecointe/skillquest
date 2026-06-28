import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Le pseudo doit contenir au moins 3 caractères.")
    .max(30, "Le pseudo ne peut pas dépasser 30 caractères."),
  email: z
    .string()
    .email("Adresse email invalide.")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule.")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Adresse email invalide.")
    .toLowerCase(),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;