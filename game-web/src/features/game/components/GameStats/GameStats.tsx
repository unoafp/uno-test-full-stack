"use client";

import { Progress } from "@/shared/components/ui/Progress";
import { MousePointerClick, Target, Layers } from "lucide-react";

interface GameStatsProps {
  attempts: number;
  maxAttempts: number;
  correctPairs: number;
  totalPairs: number;
}

export function GameStats({
  attempts,
  maxAttempts,
  correctPairs,
  totalPairs,
}: GameStatsProps) {
  const attemptsPercent = (attempts / maxAttempts) * 100;
  const pairsPercent = (correctPairs / totalPairs) * 100;

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <MousePointerClick className="size-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Attempts</span>
        </div>
        <span className="font-mono text-sm font-bold text-foreground">
          {attempts} / {maxAttempts}
        </span>
      </div>
      <Progress value={attemptsPercent} className="h-2" />

      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-accent" />
          <span className="text-sm font-medium text-foreground">
            Pairs Found
          </span>
        </div>
        <span className="font-mono text-sm font-bold text-foreground">
          {correctPairs} / {totalPairs}
        </span>
      </div>
      <Progress
        value={pairsPercent}
        className="h-2 [&>[data-slot=progress-indicator]]:bg-accent"
      />

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Layers className="size-3" />
        <span>{totalPairs * 2} cards in play</span>
      </div>
    </div>
  );
}
