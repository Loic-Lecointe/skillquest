-- CreateEnum
CREATE TYPE "LearningRhythm" AS ENUM ('RELAX', 'NORMAL', 'INTENSIVE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "learningRhythm" "LearningRhythm" NOT NULL DEFAULT 'NORMAL';
