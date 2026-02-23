import { useState } from "react";
import { Newspaper, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: any credentials work
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-accent mx-auto mb-4 flex items-center justify-center">
            <Newspaper className="w-7 h-7 text-accent-foreground" />
          </div>
          <h1 className="text-xl font-bold text-primary-foreground">Sistema de Inventario</h1>
          <p className="text-sm text-primary-foreground/60 mt-1">Gestión de Periódicos</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-lg border border-border p-6 space-y-4 shadow-lg">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Correo</label>
            <Input
              type="email"
              placeholder="admin@inventario.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contraseña</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full">
            <LogIn className="w-4 h-4 mr-2" />
            Iniciar Sesión
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">Demo: cualquier credencial funciona</p>
        </form>
      </div>
    </div>
  );
}
