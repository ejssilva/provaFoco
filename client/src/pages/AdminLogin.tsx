import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { refresh, user, loading, error: authError } = useAuth();
  
  const loginMutation = trpc.auth.adminLogin.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    loginMutation.mutate({ password }, {
      onSuccess: async () => {
        toast.success("Login realizado com sucesso!");
        try {
          await refresh();
          // Aguarda um pequeno delay para garantir que o estado propagou
          setTimeout(() => {
            setLocation("/admin");
          }, 100);
        } catch (e) {
          console.error("Erro ao atualizar sessão:", e);
        }
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erro ao realizar login");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Debug Overlay */}
      <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white text-xs rounded shadow-lg max-w-sm z-50 font-mono">
        <h3 className="font-bold mb-2 text-yellow-400">Debug Info</h3>
        <div className="space-y-1">
          <p>Status: {loginMutation.status}</p>
          <p>Auth Loading: {loading ? "Sim" : "Não"}</p>
          <p>User: {user ? `${user.name} (${user.role})` : "Não logado"}</p>
          {loginMutation.error && (
            <p className="text-red-400">Login Error: {loginMutation.error.message}</p>
          )}
          {authError && (
             <p className="text-red-400">Auth Error: {JSON.stringify(authError)}</p>
          )}
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Digite a senha de administrador para acessar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
