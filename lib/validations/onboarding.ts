import { z } from "zod";

export const onboardingSchema = z.object({
  skillTitle: z
    .string()
    .min(2, "La compétence doit contenir au moins 2 caractères.")
    .max(80, "La compétence ne peut pas dépasser 80 caractères."),
  goal: z
    .string()
    .min(5, "L'objectif doit contenir au moins 5 caractères.")
    .max(200, "L'objectif ne peut pas dépasser 200 caractères."),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  dailyGoalMinutes: z.coerce
    .number()
    .min(5, "L'objectif quotidien doit être d'au moins 5 minutes.")
    .max(240, "L'objectif quotidien ne peut pas dépasser 240 minutes."),
  learningStyle: z.enum(["READING", "VIDEO", "PRACTICE", "QUIZ", "MIXED"]),
  learningRhythm: z.enum(["RELAX", "NORMAL", "INTENSIVE"]),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;