"use client";

import { useRouter } from "next/navigation";

import { RotateCcw, Home, Trophy, XCircle } from "lucide-react";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";

interface GameOverProps {
  won: boolean;
  attempts: number;
  maxAttempts: number;
  correctPairs: number;
  totalPairs: number;
  onReplay: () => void;
}

export const GameOver = ({
  won,
  attempts,
  maxAttempts,
  correctPairs,
  totalPairs,
  onReplay,
}: GameOverProps) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm">
      <Card.Root className="w-full max-w-sm border-2 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <Card.Header className="text-center">
          {won ? (
            <>
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15">
                <Trophy className="size-8 text-success" />
              </div>
              <Card.Title className="mt-3 text-2xl text-foreground">
                You Won!
              </Card.Title>
              <Card.Description>
                Great memory! You found all pairs.
              </Card.Description>
            </>
          ) : (
            <>
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/15">
                <XCircle className="size-8 text-destructive" />
              </div>
              <Card.Title className="mt-3 text-2xl text-foreground">
                Game Over
              </Card.Title>
              <Card.Description>
                You ran out of attempts. Try again!
              </Card.Description>
            </>
          )}
        </Card.Header>
        <Card.Content className="flex flex-col gap-4">
          <div className="flex justify-center gap-3">
            <Badge variant="outline" className="gap-1 px-3 py-1.5 text-sm">
              <span className="font-mono">
                {correctPairs}/{totalPairs}
              </span>{" "}
              pairs
            </Badge>
            <Badge variant="outline" className="gap-1 px-3 py-1.5 text-sm">
              <span className="font-mono">
                {attempts}/{maxAttempts}
              </span>{" "}
              attempts
            </Badge>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={onReplay} size="lg" className="cursor-pointer">
              <RotateCcw className="size-4" />
              Play Again
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/")}
              className="cursor-pointer"
            >
              <Home className="size-4" />
              Back Home
            </Button>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  );
};
