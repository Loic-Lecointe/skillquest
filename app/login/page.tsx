import Link from "next/link";
import { loginAction } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    registered?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-xl border p-6 shadow-sm">
        <div className="mb-6 space-y-2">
          <p className="text-sm text-muted-foreground">SkillQuest</p>
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-sm text-muted-foreground">
            Reprends ton parcours là où tu t’es arrêté.
          </p>

          {params.registered === "true" ? (
            <p className="rounded-md border px-3 py-2 text-sm">
              Ton compte a bien été créé. Tu peux maintenant te connecter.
            </p>
          ) : null}

          {params.error ? (
            <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {params.error}
            </p>
          ) : null}
        </div>

        <form action={loginAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="alex@email.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-medium text-foreground">
            Créer un compte
          </Link>
        </p>
      </section>
    </main>
  );
}
