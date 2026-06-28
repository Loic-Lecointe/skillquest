"use server";

import { redirect, unstable_rethrow } from "next/navigation";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validations/auth";

function loginErrorUrl(message: string) {
  return `/login?error=${encodeURIComponent(message)}`;
}

export async function loginAction(formData: FormData): Promise<void> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = loginSchema.safeParse(rawData);

  if (!result.success) {
    redirect(loginErrorUrl(result.error.issues[0]?.message ?? "Données invalides."));
  }

  const { email, password } = result.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    unstable_rethrow(error);

    redirect(loginErrorUrl("Email ou mot de passe incorrect."));
  }

  redirect("/dashboard");
}