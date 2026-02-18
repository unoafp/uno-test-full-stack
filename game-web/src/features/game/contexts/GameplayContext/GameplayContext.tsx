"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { createGameplayStore } from "../../stores/game.store";
import { StoreApi } from "zustand";
import { GameplayStore } from "../../stores/game.types";

const GameplayContext = createContext<StoreApi<GameplayStore> | null>(null);

export const GameplayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [store] = useState(() => createGameplayStore());

  return (
    <GameplayContext.Provider value={store}>
      {children}
    </GameplayContext.Provider>
  );
};

export const useGameplayStore = <T,>(
  selector: (state: GameplayStore) => T,
): T => {
  const store = useContext(GameplayContext);

  if (!store) {
    throw new Error("useGameplayStore must be used inside GameplayProvider");
  }

  return useStore(store, selector);
};
