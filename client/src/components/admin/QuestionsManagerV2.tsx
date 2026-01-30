import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";

export default function QuestionsManagerV2() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterBank, setFilterBank] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    category: "",
    bank: "",
    difficulty: "",
    year: "",
    questionText: "",
    alternatives: { a: "", b: "", c: "", d: "", e: "" },
    correctAnswer: "a" as "a" | "b" | "c" | "d" | "e",
    explanation: "",
  });

  const { data: questions, isLoading: questionsLoading, refetch: refetchQuestions } = trpc.questions.list.useQuery({
    limit: 1000,
  });

  const { data: filterOptions } = trpc.questions.getFilters.useQuery();
  const { data: categories } = trpc.categories.list.useQuery(); // Keep for legacy fallback
  const { data: banks } = trpc.banks.list.useQuery(); // Keep for legacy fallback
  const { data: difficultyLevels } = trpc.difficultyLevels.list.useQuery(); // Keep for legacy fallback

  const getCategoryName = (id: number) => categories?.find((c) => c.id === id)?.name;
  const getBankName = (id: number) => banks?.find((b) => b.id === id)?.name;
  const getDifficultyName = (id: number) => {
    const levels = ["Fácil", "Médio", "Difícil"];
    return levels[id - 1];
  };

  const createMutation = trpc.questions.create.useMutation({
    onSuccess: () => {
      toast.success("Questão criada com sucesso!");
      setOpen(false);
      resetForm();
      refetchQuestions();
    },
    onError: (error) => {
      toast.error(`Erro ao criar questão: ${error.message}`);
    },
  });

  const updateMutation = trpc.questions.update.useMutation({
    onSuccess: () => {
      toast.success("Questão atualizada com sucesso!");
      setOpen(false);
      setEditingId(null);
      resetForm();
      refetchQuestions();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar questão: ${error.message}`);
    },
  });

  const deleteMutation = trpc.questions.delete.useMutation({
    onSuccess: () => {
      toast.success("Questão deletada com sucesso!");
      refetchQuestions();
    },
    onError: (error) => {
      toast.error(`Erro ao deletar questão: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      category: "",
      bank: "",
      difficulty: "",
      year: "",
      questionText: "",
      alternatives: { a: "", b: "", c: "", d: "", e: "" },
      correctAnswer: "a",
      explanation: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createMutation.mutate({
        ...formData,
      });
    }
  };

  const handleEdit = (question: any) => {
    setEditingId(question.id);
    setFormData({
      category: question.category || getCategoryName(question.categoryId) || "",
      bank: question.bank || getBankName(question.bankId) || "",
      difficulty: question.difficulty || getDifficultyName(question.difficultyId) || "",
      year: question.year?.toString() || "",
      questionText: question.questionText,
      alternatives: question.alternatives,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
    });
    setOpen(true);
  };

  // Filtrar questões
  const filteredQuestions = useMemo(() => {
    return (questions || []).filter((q) => {
      const matchesSearch = q.questionText.toLowerCase().includes(searchTerm.toLowerCase());
      
      const questionCategory = q.category || (q.categoryId ? getCategoryName(q.categoryId) : "") || "";
      const matchesCategory = !filterCategory || questionCategory === filterCategory;
      
      const questionBank = q.bank || (q.bankId ? getBankName(q.bankId) : "") || "";
      const matchesBank = !filterBank || questionBank === filterBank;
      
      return matchesSearch && matchesCategory && matchesBank;
    });
  }, [questions, searchTerm, filterCategory, filterBank, categories, banks]); // added deps

  // Paginação
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar Questão</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Digite parte da questão..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-filter">Categoria</Label>
              <Select value={filterCategory} onValueChange={(value) => {
                setFilterCategory(value === "all" ? "" : value);
                setCurrentPage(1);
              }}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Todas" />
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

            <div className="space-y-2">
              <Label htmlFor="bank-filter">Banca</Label>
              <Select value={filterBank} onValueChange={(value) => {
                setFilterBank(value === "all" ? "" : value);
                setCurrentPage(1);
              }}>
                <SelectTrigger id="bank-filter">
                  <SelectValue placeholder="Todas" />
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

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("");
                  setFilterBank("");
                  setCurrentPage(1);
                }}
                variant="outline"
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Adicionar */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => {
            setEditingId(null);
            resetForm();
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Questão
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Questão" : "Nova Questão"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Atualize os dados da questão" : "Preencha todos os campos para criar uma nova questão"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  placeholder="Digite a categoria"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank">Banca</Label>
                <Input
                  id="bank"
                  placeholder="Digite a banca"
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificuldade</Label>
                <Input
                  id="difficulty"
                  placeholder="Digite a dificuldade"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Ano</Label>
                <Input
                  id="year"
                  placeholder="2024"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Texto da Questão *</Label>
              <Textarea
                id="question"
                placeholder="Digite a questão..."
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                className="min-h-24"
              />
            </div>

            <div className="space-y-4">
              <Label>Alternativas *</Label>
              {["a", "b", "c", "d", "e"].map((letter) => (
                <div key={letter} className="space-y-2">
                  <Label htmlFor={`alt-${letter}`} className="text-sm">
                    {letter.toUpperCase()})
                  </Label>
                  <Input
                    id={`alt-${letter}`}
                    placeholder={`Alternativa ${letter.toUpperCase()}`}
                    value={formData.alternatives[letter as keyof typeof formData.alternatives]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        alternatives: {
                          ...formData.alternatives,
                          [letter]: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="correct">Resposta Correta *</Label>
              <Select value={formData.correctAnswer} onValueChange={(value) => setFormData({ ...formData, correctAnswer: value as any })}>
                <SelectTrigger id="correct">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["a", "b", "c", "d", "e"].map((letter) => (
                    <SelectItem key={letter} value={letter}>
                      {letter.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="explanation">Explicação *</Label>
              <Textarea
                id="explanation"
                placeholder="Explique por que a resposta está correta..."
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className="min-h-20"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Questão"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tabela de Questões */}
      <Card>
        <CardHeader>
          <CardTitle>Questões Cadastradas</CardTitle>
          <CardDescription>
            Mostrando {paginatedQuestions.length} de {filteredQuestions.length} questões
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : paginatedQuestions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma questão encontrada</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Questão</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Banca</TableHead>
                      <TableHead>Dificuldade</TableHead>
                      <TableHead>Ano</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="max-w-xs truncate">
                          {question.questionText}
                        </TableCell>
                        <TableCell>{question.category || getCategoryName(question.categoryId) || "N/A"}</TableCell>
                        <TableCell>{question.bank || getBankName(question.bankId) || "N/A"}</TableCell>
                        <TableCell>{question.difficulty || getDifficultyName(question.difficultyId) || "N/A"}</TableCell>
                        <TableCell>{question.year}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(question)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm("Tem certeza que deseja deletar esta questão?")) {
                                deleteMutation.mutate(question.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
