import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Dashboard</p>
            <h1 className="text-3xl font-bold">
              Bonjour {session.user.name ?? "aventurier"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Ton espace SkillQuest est maintenant protégé.
            </p>
          </div>

          <form
            action={async () => {
              "use server";

              await signOut({
                redirectTo: "/login",
              });
            }}
          >
            <button
              type="submit"
              className="rounded-md border px-4 py-2 text-sm font-medium"
            >
              Se déconnecter
            </button>
          </form>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Niveau</p>
            <p className="mt-2 text-2xl font-bold">1</p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">XP total</p>
            <p className="mt-2 text-2xl font-bold">0 XP</p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Série actuelle</p>
            <p className="mt-2 text-2xl font-bold">0 jour</p>
          </div>
        </div>
      </section>
    </main>
  );
}