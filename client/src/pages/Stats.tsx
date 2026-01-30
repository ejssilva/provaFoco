import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, TrendingUp, Target, Clock, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#8b5cf6", "#ec4899", "#f59e0b"];

import Header from "@/components/Header";

import { calculateGuestStats } from "@/lib/guestStats";
import { getLoginUrl } from "@/const";

export default function Stats() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: apiStats, isLoading: statsLoading } = trpc.stats.get.useQuery(undefined, { enabled: !!user });
  const { data: apiCategoryStats, isLoading: categoryStatsLoading } = trpc.stats.categoryStats.useQuery(undefined, { enabled: !!user });

  // Load guest stats if user is not logged in
  const guestStats = !user ? calculateGuestStats() : null;

  const stats = user ? apiStats : guestStats ? {
    totalAnswered: guestStats.totalAnswered,
    totalCorrect: guestStats.totalCorrect,
    totalIncorrect: guestStats.totalIncorrect,
  } : null;

  const categoryStats = user ? apiCategoryStats : guestStats?.categoryStats.map(cat => ({
    categoryId: parseInt(cat.categoryId) || 0, // Mock ID or handle string
    categoryName: cat.categoryId, // Pass name if available
    totalAnswered: cat.totalAnswered,
    totalCorrect: cat.totalCorrect
  })) || [];

  const isLoading = user ? (statsLoading || categoryStatsLoading) : false;

  const chartData = categoryStats?.map((stat) => ({
    name: (stat as any).categoryName || `Categoria ${stat.categoryId}`,
    acertos: stat.totalCorrect || 0,
    erros: (stat.totalAnswered || 0) - (stat.totalCorrect || 0),
  })) || [];

  const accuracyData = [
    { name: "Acertos", value: stats?.totalCorrect || 0 },
    { name: "Erros", value: stats?.totalIncorrect || 0 },
  ];

  return (
    <>
      <SEO
        title="Suas Estatísticas - Prova Foco"
        description="Acompanhe seu desempenho e progresso em questões de concurso. Veja estatísticas detalhadas por categoria."
        keywords="estatísticas, desempenho, concurso"
        noindex={true}
      />
      <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Suas Estatísticas</h1>
              <p className="text-muted-foreground mt-2">
                Acompanhe seu desempenho e progresso
              </p>
            </div>
          </div>
          {!user && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border text-sm text-muted-foreground">
              <span className="font-semibold">Nota:</span> Você está visualizando estatísticas locais. 
              <a href={getLoginUrl()} className="text-primary hover:underline ml-1 font-medium">Faça login</a> para salvar seu progresso na nuvem.
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Questões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{stats?.totalAnswered || 0}</div>
                    <CheckCircle2 className="h-8 w-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Acertos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-green-600">{stats?.totalCorrect || 0}</div>
                    <TrendingUp className="h-8 w-8 text-green-600 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Erros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-red-600">{stats?.totalIncorrect || 0}</div>
                    <Target className="h-8 w-8 text-red-600 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Taxa de Acerto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{stats?.accuracy || 0}%</div>
                    <Clock className="h-8 w-8 text-blue-600 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Bar Chart */}
              {chartData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho por Categoria</CardTitle>
                    <CardDescription>
                      Acertos e erros em cada categoria
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="acertos" fill="#3b82f6" />
                        <Bar dataKey="erros" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Pie Chart */}
              {stats && (stats.totalAnswered || 0) > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Taxa de Acerto</CardTitle>
                    <CardDescription>
                      Proporção de acertos e erros
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={accuracyData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {accuracyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Category Details */}
            {categoryStats && categoryStats.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes por Categoria</CardTitle>
                  <CardDescription>
                    Estatísticas detalhadas de cada categoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryStats.map((stat) => (
                      <div key={stat.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">Categoria {stat.categoryId}</p>
                          <p className="text-sm text-muted-foreground">
                            {stat.totalAnswered} questões respondidas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{stat.accuracy}%</p>
                          <p className="text-sm text-muted-foreground">
                            {stat.totalCorrect} acertos
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <Button
                onClick={() => setLocation("/questions")}
                size="lg"
                className="flex-1"
              >
                Continuar Respondendo
              </Button>
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Voltar para Home
              </Button>
            </div>
          </>
        )}
      </div>
      </div>
    </>
  );
}
