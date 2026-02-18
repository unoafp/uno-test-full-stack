"use client";

import { useState } from "react";

import { User, Gamepad2 } from "lucide-react";

import { Label } from "@/shared/components/ui/Label";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Card } from "@/shared/components/ui/Card";
import { useLogin } from "../hooks/useLogin";

export const PlayerForm = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const { mutate, isPending } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nickname.trim()) return;
    mutate({ name: name.trim(), run: nickname.trim() });
  };

  return (
    <Card.Root className="border border-primary/20">
      <Card.Header>
        <Card.Title className="flex items-center gap-2 text-lg">
          <User className="size-5 text-primary" />
          New Player
        </Card.Title>
        <Card.Description>Enter your details to start playing</Card.Description>
      </Card.Header>
      <Card.Content>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              placeholder="Your game nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="mt-2 cursor-pointer"
            disabled={isPending}
          >
            <Gamepad2 className="size-5" />
            Play Now
          </Button>
        </form>
      </Card.Content>
    </Card.Root>
  );
};
