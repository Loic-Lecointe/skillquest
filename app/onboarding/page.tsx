import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { completeOnboardingAction } from "./actions";

type OnboardingPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      onboardingCompletedAt: true,
    },
  });

  if (user?.onboardingCompletedAt) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8 space-y-3">
          <p className="text-sm text-muted-foreground">SkillQuest</p>
          <h1 className="text-3xl font-bold">Prépare ton aventure</h1>
          <p className="text-muted-foreground">
            Réponds à quelques questions pour générer ton premier parcours
            d’apprentissage.
          </p>

          {params.error ? (
            <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {params.error}
            </p>
          ) : null}
        </div>

        <form
          action={completeOnboardingAction}
          className="space-y-6 rounded-xl border p-6 shadow-sm"
        >
          <div className="space-y-2">
            <label htmlFor="skillTitle" className="text-sm font-medium">
              Que veux-tu apprendre ?
            </label>
            <input
              id="skillTitle"
              name="skillTitle"
              type="text"
              required
              placeholder="React, TypeScript, anglais, UI design..."
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="goal" className="text-sm font-medium">
              Quel objectif veux-tu atteindre ?
            </label>
            <textarea
              id="goal"
              name="goal"
              required
              placeholder="Exemple : être capable de créer une application complète avec React."
              className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="difficulty" className="text-sm font-medium">
                Ton niveau actuel
              </label>
              <select
                id="difficulty"
                name="difficulty"
                defaultValue="BEGINNER"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
              >
                <option value="BEGINNER">Débutant</option>
                <option value="INTERMEDIATE">Intermédiaire</option>
                <option value="ADVANCED">Avancé</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dailyGoalMinutes"
                className="text-sm font-medium"
              >
                Temps disponible par jour
              </label>
              <select
                id="dailyGoalMinutes"
                name="dailyGoalMinutes"
                defaultValue="30"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 heure</option>
                <option value="90">1h30</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="learningStyle" className="text-sm font-medium">
                Style d’apprentissage préféré
              </label>
              <select
                id="learningStyle"
                name="learningStyle"
                defaultValue="MIXED"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
              >
                <option value="MIXED">Mixte</option>
                <option value="READING">Lecture</option>
                <option value="VIDEO">Vidéo</option>
                <option value="PRACTICE">Pratique</option>
                <option value="QUIZ">Quiz</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="learningRhythm" className="text-sm font-medium">
                Rythme souhaité
              </label>
              <select
                id="learningRhythm"
                name="learningRhythm"
                defaultValue="NORMAL"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
              >
                <option value="RELAX">Relax</option>
                <option value="NORMAL">Normal</option>
                <option value="INTENSIVE">Intensif</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Créer mon premier parcours
          </button>
        </form>
      </section>
    </main>
  );
}