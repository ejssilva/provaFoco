import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import AdDisplay from "@/components/AdDisplay";
import Header from "@/components/Header";

import { saveGuestAnswer } from "@/lib/guestStats";

export default function Questions() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; correctAnswer: string; explanation?: string } | null>(null);

  const [filters, setFilters] = useState({
    category: "",
    bank: "",
    difficulty: "",
    search: "",
  });

  const { data: filterOptions } = trpc.questions.getFilters.useQuery(undefined);
  const { data: questions, isLoading } = trpc.questions.list.useQuery({
    category: filters.category || undefined,
    bank: filters.bank || undefined,
    difficulty: filters.difficulty || undefined,
    search: filters.search || undefined,
    limit: 100,
  });

  const submitAnswerMutation = trpc.userAnswers.submit.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
      setShowResult(true);
    },
    onError: (error: any) => {
      toast.error(`Erro ao enviar resposta: ${error.message}`);
    },
  });

  // useEffect(() => {
  //   if (!user) {
  //     setLocation("/");
  //   }
  // }, [user, setLocation]);

  // if (!user) {
  //   return null;
  // }

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !selectedAnswer) {
      toast.error("Selecione uma resposta");
      return;
    }

    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswer as "a" | "b" | "c" | "d" | "e",
    }, {
      onSuccess: (data: any) => {
        if (!user) {
          saveGuestAnswer({
            questionId: currentQuestion.id,
             isCorrect: data.isCorrect,
             categoryId: currentQuestion.category || currentQuestion.categoryId?.toString(),
           });
        }
        setResult(data);
        setShowResult(true);
      },
      onError: (error: any) => {
        toast.error(`Erro ao enviar resposta: ${error.message}`);
      }
    });
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setResult(null);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setResult(null);
    } else {
      toast.success("Você respondeu todas as questões!");
      if (user) {
        setLocation("/stats");
      } else {
        // Se não tiver logado, reinicia ou volta pra home
        if (confirm("Você finalizou as questões listadas. Deseja reiniciar?")) {
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setShowResult(false);
          setResult(null);
        } else {
          setLocation("/");
        }
      }
    }
  };

  return (
    <>
      <SEO
        title="Resolver Questões - Prova Foco"
        description="Resolva questões de concurso público em Português, Matemática e Informática. Pratique com filtros por categoria, banca e dificuldade."
        keywords="questões, concurso, português, matemática, informática"
        noindex={true}
      />
      <div className="min-h-screen bg-background pb-8">
        <Header />
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold gradient-text">Resolver Questões</h1>
          </div>

          {/* Filters */}
          <AdDisplay placement="header_banner" className="mb-6" />

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search">Buscar por assunto/conteúdo</Label>
                  <Input
                    id="search"
                    placeholder="Digite para pesquisar..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters({ ...filters, category: value === "all" ? "" : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {filterOptions?.categories.map((cat: string) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bank">Banca</Label>
                  <Select
                    value={filters.bank}
                    onValueChange={(value) =>
                      setFilters({ ...filters, bank: value === "all" ? "" : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as bancas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as bancas</SelectItem>
                      {filterOptions?.banks.map((bank: string) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select
                    value={filters.difficulty}
                    onValueChange={(value) =>
                      setFilters({ ...filters, difficulty: value === "all" ? "" : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as dificuldades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as dificuldades</SelectItem>
                      {filterOptions?.difficulties.map((level: string) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <AdDisplay placement="between_questions" className="mb-6" />

        {/* Question Card */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : currentQuestion ? (
          <Card key={currentQuestion.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Questão {currentQuestionIndex + 1}
                    {currentQuestion.category && (
                      <span className="ml-2 text-base font-medium text-muted-foreground">
                        - {currentQuestion.category}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {currentQuestionIndex + 1} de {questions?.length || 0}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Progresso</p>
                  <p className="text-lg font-semibold">
                    {Math.round(((currentQuestionIndex + 1) / (questions?.length || 1)) * 100)}%
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-lg font-semibold mb-4">{currentQuestion.questionText}</p>
              </div>

              {!showResult ? (
                <>
                  <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
                    <div className="space-y-3">
                      {["a", "b", "c", "d", "e"].map((letter) => {
                        const alternative =
                          currentQuestion.alternatives[letter as keyof typeof currentQuestion.alternatives];
                        if (!alternative) return null;

                        return (
                          <div key={letter} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                            <RadioGroupItem value={letter} id={letter} />
                            <Label htmlFor={letter} className="flex-1 cursor-pointer">
                              <span className="font-semibold mr-2">{letter.toUpperCase()})</span>
                              {alternative}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>

                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer || submitAnswerMutation.isPending}
                    className="w-full mb-4"
                    size="lg"
                  >
                    {submitAnswerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      "Responder"
                    )}
                  </Button>

                  <div className="flex gap-4">
                    <Button
                      onClick={handlePreviousQuestion}
                      variant="outline"
                      className="flex-1"
                      disabled={currentQuestionIndex === 0}
                      size="lg"
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={handleNextQuestion}
                      variant="outline"
                      className="flex-1"
                      disabled={currentQuestionIndex === (questions?.length || 0) - 1}
                      size="lg"
                    >
                      Próxima
                    </Button>
                  </div>
                </>
              ) : result ? (
                <>
                  <div className={`p-4 rounded-lg ${result.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {result.isCorrect ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <p className="font-semibold text-green-600">Resposta Correta!</p>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-600" />
                          <p className="font-semibold text-red-600">Resposta Incorreta</p>
                        </>
                      )}
                    </div>
                    <p className="text-sm">
                      Resposta correta: <span className="font-semibold">{result.correctAnswer.toUpperCase()}</span>
                    </p>
                  </div>

                  {result.explanation && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="font-semibold text-blue-900 mb-2">Explicação:</p>
                      <p className="text-sm text-blue-800">{result.explanation}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={handlePreviousQuestion}
                      variant="outline"
                      className="flex-1"
                      disabled={currentQuestionIndex === 0}
                      size="lg"
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={handleNextQuestion}
                      className="flex-1"
                      size="lg"
                    >
                      {currentQuestionIndex < (questions?.length || 0) - 1
                        ? "Próxima Questão"
                        : "Finalizar"}
                    </Button>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhuma questão encontrada com os filtros selecionados.</p>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </>
  );
}