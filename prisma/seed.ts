import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.badge.upsert({
    where: { name: "Premier pas" },
    update: {},
    create: {
      name: "Premier pas",
      description: "Terminer ta première quête.",
      icon: "footprints",
      conditionType: "FIRST_QUEST_COMPLETED",
      rarity: "COMMON",
    },
  });

  await prisma.badge.upsert({
    where: { name: "Régulier" },
    update: {},
    create: {
      name: "Régulier",
      description: "Maintenir une série de 7 jours.",
      icon: "flame",
      conditionType: "SEVEN_DAY_STREAK",
      rarity: "RARE",
    },
  });

  await prisma.badge.upsert({
    where: { name: "Quiz Master" },
    update: {},
    create: {
      name: "Quiz Master",
      description: "Réussir ton premier quiz.",
      icon: "brain",
      conditionType: "FIRST_QUIZ_PASSED",
      rarity: "RARE",
    },
  });

  console.log("Seed terminé.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });