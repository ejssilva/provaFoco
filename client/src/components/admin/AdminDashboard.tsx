import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BookOpen, Users, HelpCircle, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: questions } = trpc.questions.list.useQuery({ limit: 1000 });

  // Calcular estatísticas
  const totalQuestions = questions?.length || 0;
  
  // Extract unique values from questions
  const uniqueCategories = Array.from(new Set(questions?.map(q => q.category).filter(Boolean))) as string[];
  const uniqueBanks = Array.from(new Set(questions?.map(q => q.bank).filter(Boolean))) as string[];
  
  const totalCategories = uniqueCategories.length;
  const totalBanks = uniqueBanks.length;

  // Dados para gráfico de questões por categoria
  const questionsByCategory = uniqueCategories.map((cat) => ({
    name: cat,
    count: questions?.filter((q) => q.category === cat).length || 0,
  }));

  // Dados para gráfico de questões por dificuldade
  const uniqueDifficulties = Array.from(new Set(questions?.map(q => q.difficulty).filter(Boolean))) as string[];
  const questionsByDifficulty = uniqueDifficulties.map(diff => ({
    name: diff,
    count: questions?.filter(q => q.difficulty === diff).length || 0
  }));

  // Dados para gráfico de questões por banca
  const questionsByBank = uniqueBanks.map((bank) => ({
    name: bank,
    count: questions?.filter((q) => q.bank === bank).length || 0,
  }));

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  return (
    <div className="space-y-8">
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Questões</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
            <p className="text-xs text-muted-foreground">questões cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">matérias disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bancas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBanks}</div>
            <p className="text-xs text-muted-foreground">bancas examinadoras</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Cobertura</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories > 0 ? Math.round((totalQuestions / (totalCategories * 10)) * 100) : 0}%</div>
            <p className="text-xs text-muted-foreground">questões vs categorias</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Questões por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Questões por Categoria</CardTitle>
            <CardDescription>Distribuição de questões entre as matérias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={questionsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Questões por Dificuldade */}
        <Card>
          <CardHeader>
            <CardTitle>Questões por Dificuldade</CardTitle>
            <CardDescription>Distribuição de níveis de dificuldade</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={questionsByDifficulty}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {questionsByDifficulty.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Questões por Banca */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Questões por Banca</CardTitle>
            <CardDescription>Distribuição de questões entre as bancas examinadoras</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={questionsByBank}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
