export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full border px-4 py-2 text-sm text-muted-foreground">
          SkillQuest — Apprends comme dans une aventure
        </p>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Transforme tes objectifs d’apprentissage en quêtes motivantes.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Crée des compétences, suis des parcours, termine des quêtes, gagne de
          l’XP et mesure ta progression jour après jour.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/register"
            className="rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background"
          >
            Commencer l’aventure
          </a>

          <a
            href="/login"
            className="rounded-md border px-5 py-3 text-sm font-medium"
          >
            Se connecter
          </a>
        </div>
      </section>
    </main>
  );
}