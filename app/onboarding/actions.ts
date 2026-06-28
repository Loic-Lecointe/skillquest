"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { onboardingSchema } from "@/lib/validations/onboarding";

function onboardingErrorUrl(message: string) {
  return `/onboarding?error=${encodeURIComponent(message)}`;
}

function getStarterModules(skillTitle: string) {
  return [
    {
      title: `Découvrir ${skillTitle}`,
      description: "Comprendre les bases, le vocabulaire et les objectifs.",
      position: 1,
      quests: [
        {
          title: `Lister ce que je veux apprendre en ${skillTitle}`,
          description:
            "Écris une courte note avec tes objectifs, tes motivations et les sujets que tu veux explorer.",
          xpReward: 20,
        },
        {
          title: `Trouver une ressource fiable sur ${skillTitle}`,
          description:
            "Ajoute une documentation, un article ou une vidéo de référence à ta bibliothèque.",
          xpReward: 20,
        },
      ],
    },
    {
      title: "Pratiquer les fondamentaux",
      description: "Passer rapidement de la théorie à la pratique.",
      position: 2,
      quests: [
        {
          title: `Réaliser un premier exercice en ${skillTitle}`,
          description:
            "Fais un exercice simple pour valider une première notion concrète.",
          xpReward: 50,
        },
      ],
    },
    {
      title: "Construire un mini-projet",
      description: "Consolider les acquis avec un livrable concret.",
      position: 3,
      quests: [
        {
          title: `Créer un mini-projet autour de ${skillTitle}`,
          description:
            "Construis un petit projet ou une production simple pour appliquer ce que tu as appris.",
          xpReward: 100,
        },
      ],
    },
  ];
}

export async function completeOnboardingAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const rawData = {
    skillTitle: formData.get("skillTitle"),
    goal: formData.get("goal"),
    difficulty: formData.get("difficulty"),
    dailyGoalMinutes: formData.get("dailyGoalMinutes"),
    learningStyle: formData.get("learningStyle"),
    learningRhythm: formData.get("learningRhythm"),
  };

  const result = onboardingSchema.safeParse(rawData);

  if (!result.success) {
    redirect(
      onboardingErrorUrl(
        result.error.issues[0]?.message ?? "Données invalides.",
      ),
    );
  }

  const {
    skillTitle,
    goal,
    difficulty,
    dailyGoalMinutes,
    learningStyle,
    learningRhythm,
  } = result.data;

  const userId = session.user.id;
  const starterModules = getStarterModules(skillTitle);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        dailyGoalMinutes,
        onboardingCompletedAt: new Date(),
        profile: {
          upsert: {
            create: {
              learningStyle,
              learningRhythm,
              difficulty,
              timezone: "Europe/Paris",
            },
            update: {
              learningStyle,
              learningRhythm,
              difficulty,
            },
          },
        },
      },
    });

    const skill = await tx.skill.create({
      data: {
        userId,
        title: skillTitle,
        goal,
        level: difficulty,
        status: "ACTIVE",
      },
    });

    const path = await tx.learningPath.create({
      data: {
        userId,
        skillId: skill.id,
        title: `Apprendre ${skillTitle}`,
        description: goal,
        difficulty,
        durationWeeks:
          learningRhythm === "INTENSIVE"
            ? 4
            : learningRhythm === "RELAX"
              ? 8
              : 6,
        status: "ACTIVE",
      },
    });

    for (const starterModule of starterModules) {
      const createdModule = await tx.module.create({
        data: {
          pathId: path.id,
          title: starterModule.title,
          description: starterModule.description,
          position: starterModule.position,
          status: starterModule.position === 1 ? "AVAILABLE" : "LOCKED",
        },
      });

      for (const starterQuest of starterModule.quests) {
        await tx.quest.create({
          data: {
            userId,
            moduleId: createdModule.id,
            title: starterQuest.title,
            description: starterQuest.description,
            type: starterModule.position === 3 ? "MINI_PROJECT" : "EXERCISE",
            difficulty,
            xpReward: starterQuest.xpReward,
            status: starterModule.position === 1 ? "TODO" : "POSTPONED",
          },
        });
      }
    }
  });

  redirect("/dashboard");
}
