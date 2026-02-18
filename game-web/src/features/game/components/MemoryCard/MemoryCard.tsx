"use client";

import { cn } from "@/shared/cn";
import { GameCard } from "../../stores/game.types";
import Image from "next/image";

interface MemoryCardProps {
  card: GameCard;
  onClick: (id: string) => void;
  disabled: boolean;
}

export function MemoryCard({ card, onClick, disabled }: MemoryCardProps) {
  const isRevealed = card.isFlipped || card.isMatched;

  return (
    <button
      type="button"
      onClick={() => onClick(card.id)}
      disabled={disabled || isRevealed}
      aria-label={isRevealed ? `${card.label} card` : "Hidden card"}
      style={{ perspective: "1000px" }}
      className={cn(
        "group relative aspect-square w-full cursor-pointer rounded-xl transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "hover:scale-105 active:scale-95",
        (disabled || isRevealed) && "pointer-events-auto",
        isRevealed && "cursor-default hover:scale-100 active:scale-100",
      )}
    >
      <div
        className={cn("relative size-full")}
        style={{
          transformStyle: "preserve-3d",
          transform: isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 500ms",
        }}
      >
        {/* Back of card (hidden state) */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-xl border-2 bg-primary shadow-md",
            "border-primary/80",
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-2xl font-bold text-primary-foreground select-none">
            {"?"}
          </span>
        </div>

        {/* Front of card (revealed state) */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-xl border-2 shadow-md overflow-hidden",
            card.isMatched
              ? "border-success bg-success/10"
              : "border-primary/30 bg-card",
          )}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Image
            src={card.url}
            alt={card.label}
            width={200}
            height={200}
            className="size-full object-fill aspect-square"
          />
        </div>
      </div>
    </button>
  );
}
