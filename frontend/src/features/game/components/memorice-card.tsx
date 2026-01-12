import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { PublicCardModel } from "../types/card.types";
import { Spinner } from "@/components/ui/spinner";
import { useRevealCard } from "../hooks/use-reveal-card";
import useEventListener from "@/lib/EventEmmiter/hooks/use-event-listener";
import eventEmitter from "@/lib/EventEmmiter/EventEmitter";

interface MemoriceCardProps {
  card: PublicCardModel;
}

export function MemoriceCard({ card }: MemoriceCardProps) {
  const { mutate: revealCard, isPending } = useRevealCard(card.id);
  const [isRevealed, setIsRevealed] = useState(card.status !== "hidden");
  const timeoutRef = useRef<number | null>(null);

  useEventListener(`cards-updated-${card.id}`, (item: PublicCardModel) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (item.status === "hidden")
      timeoutRef.current = window.setTimeout(() => {
        setIsRevealed(false);
      }, 500);
  });

  const handleClick = () => {
    if (isRevealed === true) {
      return;
    }
    setIsRevealed(true);
    revealCard(undefined, {
      onSuccess: (data) => {
        data.cards.forEach((item) => {
          eventEmitter.emit(`cards-updated-${item.id}`, item);
        });
      },
    });
  };

  return (
    <div
      className={cn("w-40 h-50  cursor-pointer perspective-1000")}
      onClick={handleClick}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-3d",
          isRevealed && "rotate-y-180"
        )}
      >
        {/* (Back content) */}
        <div className="absolute inset-0 backface-hidden rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg">
          {isPending ? <Spinner /> : card.position + 1}
        </div>

        {/* (Revealed content) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-card border-2 border-primary flex items-center justify-center text-4xl shadow-lg">
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <div>
                <img
                  src={card.imageUrl}
                  aria-label={card.title}
                  className="h-30 w-40 object-cover "
                />
                <h4 className="text-center mt-2">The {card.title} </h4>
              </div>
            </>
          )}
          {/* {JSON.stringify(card.id)} */}
        </div>
      </div>
    </div>
  );
}
