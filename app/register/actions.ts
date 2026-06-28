"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

function registerErrorUrl(message: string) {
  return `/register?error=${encodeURIComponent(message)}`;
}

export async function registerAction(formData: FormData): Promise<void> {
  const rawData = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = registerSchema.safeParse(rawData);

  if (!result.success) {
    redirect(
      registerErrorUrl(result.error.issues[0]?.message ?? "Données invalides."),
    );
  }

  const { username, email, password } = result.data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    redirect(
      registerErrorUrl("Un utilisateur existe déjà avec cet email ou ce pseudo."),
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      username,
      email,
      name: username,
      passwordHash,
      profile: {
        create: {},
      },
      streak: {
        create: {},
      },
    },
  });

  redirect("/login?registered=true");
}