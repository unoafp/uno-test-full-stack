import { Button } from "@/components/ui/button";
import { useIdentity } from "@/features/auth/hooks/use-identity";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { Link } from "@tanstack/react-router";
import { LogOut, Trophy } from "lucide-react";
import ContainerBox from "../ui/container-box";

export function Navbar() {
  const { identity } = useIdentity();
  const { logout, isPending } = useLogout();
  const handleLogout = () => {
    logout();
  };
  return (
    <nav className="w-full border-b border-border bg-background">
      <ContainerBox className="flex h-16 items-center justify-between px-4">
        <Link to="/app" className="text-xl font-bold">
          Memorice
        </Link>
        <h2>{identity?.name}</h2>

        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to={"/app/stats"}>
              <Trophy className="w-5 h-5" />
              Ver Puntajes
            </Link>
          </Button>

          <Button variant="outline" onClick={handleLogout} disabled={isPending}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </ContainerBox>
    </nav>
  );
}
