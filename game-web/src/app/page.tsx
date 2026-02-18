import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { PlayerForm } from "@/features/auth/components/PlayerForm";
import { PlayerWelcome } from "@/features/auth/components/PlayerWelcome";
import { Layers } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-svh">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Layers className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Memory Match
            </h1>
            <p className="text-sm text-muted-foreground">
              Flip cards, find pairs, test your memory
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-80 lg:shrink-0">
            <AuthGuard fallback={<PlayerForm />} skeleton={"loading..."}>
              <PlayerWelcome />
            </AuthGuard>
          </div>

          <div className="flex-1"></div>
        </div>
      </div>
    </main>
  );
}
