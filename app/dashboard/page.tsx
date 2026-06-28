import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      username: true,
      level: true,
      totalXp: true,
      onboardingCompletedAt: true,
      streak: {
        select: {
          currentStreak: true,
        },
      },
      learningPaths: {
        where: {
          status: "ACTIVE",
        },
        select: {
          id: true,
          title: true,
          progress: true,
        },
        take: 3,
        orderBy: {
          createdAt: "desc",
        },
      },
      quests: {
        where: {
          status: "TODO",
        },
        select: {
          id: true,
          title: true,
          xpReward: true,
        },
        take: 1,
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (!user.onboardingCompletedAt) {
    redirect("/onboarding");
  }

  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Dashboard</p>
            <h1 className="text-3xl font-bold">
              Bonjour {user.name ?? user.username ?? "aventurier"}
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
            <p className="mt-2 text-2xl font-bold">{user.level}</p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">XP total</p>
            <p className="mt-2 text-2xl font-bold">{user.totalXp} XP</p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Série actuelle</p>
            <p className="mt-2 text-2xl font-bold">
              {user.streak?.currentStreak ?? 0} jour
            </p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border p-5">
            <h2 className="font-semibold">Quête du jour</h2>

            {user.quests[0] ? (
              <div className="mt-4 rounded-lg border p-4">
                <p className="font-medium">{user.quests[0].title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Récompense : {user.quests[0].xpReward} XP
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Aucune quête disponible pour le moment.
              </p>
            )}
          </section>

          <section className="rounded-xl border p-5">
            <h2 className="font-semibold">Parcours actifs</h2>

            <div className="mt-4 space-y-3">
              {user.learningPaths.length > 0 ? (
                user.learningPaths.map((path) => (
                  <div key={path.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium">{path.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {path.progress}%
                      </p>
                    </div>

                    <div className="mt-3 h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-foreground"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucun parcours actif.
                </p>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
