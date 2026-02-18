"use client";

import { useRouter } from "next/navigation";

import { Gamepad2, LogOut } from "lucide-react";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { useAuthContext } from "../AuthGuard/AuthContext";

export const PlayerWelcome = () => {
  const router = useRouter();

  const { user, logout } = useAuthContext("PlayerWelcome");

  return (
    <Card.Root className="border border-primary/20">
      <Card.Header>
        <Card.Title className="text-lg">
          Welcome back, <span className="text-primary">{user.name}</span>
        </Card.Title>
        <Card.Description>
          {user.name} — Ready for another round?
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-3">
        <Button
          size="lg"
          className="cursor-pointer"
          onClick={() => router.push("/play")}
        >
          <Gamepad2 className="size-5" />
          Play Now
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="cursor-pointer"
        >
          <LogOut className="size-4" />
          Switch Player
        </Button>
      </Card.Content>
    </Card.Root>
  );
};
