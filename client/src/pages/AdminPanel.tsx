import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowLeft, LogOut } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import QuestionsManagerV2 from "@/components/admin/QuestionsManagerV2";
import CategoriesManager from "@/components/admin/CategoriesManager";
import BanksManager from "@/components/admin/BanksManager";
import AdsManager from "@/components/admin/AdsManager";
import AdminDashboard from "@/components/admin/AdminDashboard";
import Header from "@/components/Header";

export default function AdminPanel() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  useEffect(() => {
    // Só redireciona se terminou de carregar E (não tem usuário OU usuário não é admin)
    if (!loading) {
        if (!user || user.role !== "admin") {
            console.log("Redirecionando para login. User:", user, "Role:", user?.role);
            // setLocation("/admin/login"); // Comentado temporariamente para debug
        }
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Debug visual se não for admin mas estiver na página (por causa do comentário acima)
  if (!user || user.role !== "admin") {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-red-500">Acesso Negado (Debug Mode)</h1>
            <div className="bg-slate-100 p-4 rounded text-sm font-mono">
                <p>User: {JSON.stringify(user, null, 2)}</p>
                <p>Role esperada: admin</p>
                <p>Role atual: {user?.role}</p>
            </div>
            <Button onClick={() => setLocation("/admin/login")}>Ir para Login</Button>
        </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white text-xs rounded shadow-lg max-w-sm z-50 font-mono">
        <h3 className="font-bold mb-2 text-green-400">Admin Debug</h3>
        <p>User: {user.name}</p>
        <p>Role: {user.role}</p>
      </div>
      <SEO
        title="Painel Administrativo - Prova Foco"
        description="Gerencie questões, categorias, bancas e anúncios do portal."
        keywords="admin, painel, gestão"
        noindex={true}
      />
      <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Painel Administrativo</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie questões, categorias, bancas e anúncios
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="questions">Questões</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="banks">Bancas</TabsTrigger>
            <TabsTrigger value="ads">Anúncios</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <QuestionsManagerV2 />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <CategoriesManager />
          </TabsContent>

          <TabsContent value="banks" className="space-y-4">
            <BanksManager />
          </TabsContent>

          <TabsContent value="ads" className="space-y-4">
            <AdsManager />
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </>
  );
}
