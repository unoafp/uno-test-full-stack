import { GameBoard } from "@/features/game/components/GameBoard";
import { GameplayProvider } from "@/features/game/contexts/GameplayContext";
import { Button } from "@/shared/components/ui/Button";
import { ArrowLeft, Layers } from "lucide-react";
import Link from "next/link";

export default function Play() {
  return (
    <main className="min-h-svh">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Layers className="size-4" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">
                Memory Match
              </h1>
              <p className="text-xs text-muted-foreground">
                Playing as <span className="font-medium text-primary"></span>
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="cursor-pointer">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        <GameplayProvider>
          <GameBoard />
        </GameplayProvider>
      </div>
    </main>
  );
}
