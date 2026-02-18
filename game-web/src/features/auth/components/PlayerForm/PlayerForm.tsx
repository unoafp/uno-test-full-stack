"use client";

import { useState } from "react";

import { User, Gamepad2 } from "lucide-react";

import { Label } from "@/shared/components/ui/Label";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Card } from "@/shared/components/ui/Card";
import { useLogin } from "../hooks/useLogin";
import { useRouter } from "next/navigation";
import { RutInput } from "@/shared/components/RutInput";

export const PlayerForm = () => {
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");

  const router = useRouter();

  const { mutateAsync, isPending } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rut.trim()) return;
    await mutateAsync({ name: name.trim(), run: rut.trim() });
    router.push("/play");
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
            <Label htmlFor="rut">Nickname</Label>
            <RutInput
              id="rut"
              placeholder="12.345.678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
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
