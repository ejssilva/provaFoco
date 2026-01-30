import { useState } from "react";
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
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function QuestionsManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    categoryId: "",
    bankId: "",
    difficultyId: "",
    year: "",
    questionText: "",
    alternatives: { a: "", b: "", c: "", d: "", e: "" },
    correctAnswer: "a" as "a" | "b" | "c" | "d" | "e",
    explanation: "",
    source: "",
  });

  const { data: questions, isLoading: questionsLoading, refetch: refetchQuestions } = trpc.questions.list.useQuery({
    limit: 100,
  });

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: banks } = trpc.banks.list.useQuery();
  const { data: difficultyLevels } = trpc.difficultyLevels.list.useQuery();

  const createMutation = trpc.questions.create.useMutation({
    onSuccess: () => {
      toast.success("Questão criada com sucesso!");
      setOpen(false);
      setFormData({
        categoryId: "",
        bankId: "",
        difficultyId: "",
        year: "",
        questionText: "",
        alternatives: { a: "", b: "", c: "", d: "", e: "" },
        correctAnswer: "a",
        explanation: "",
        source: "",
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId || !formData.bankId || !formData.difficultyId || !formData.questionText) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const payload = {
      categoryId: parseInt(formData.categoryId),
      bankId: parseInt(formData.bankId),
      difficultyId: parseInt(formData.difficultyId),
      year: formData.year ? parseInt(formData.year) : undefined,
      questionText: formData.questionText,
      alternatives: {
        a: formData.alternatives.a,
        b: formData.alternatives.b,
        c: formData.alternatives.c,
        d: formData.alternatives.d,
        e: formData.alternatives.e || undefined,
      },
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation || undefined,
      source: formData.source || undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciar Questões</CardTitle>
              <CardDescription>
                Crie, edite e delete questões de concurso
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingId(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Questão
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Editar Questão" : "Nova Questão"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados da questão abaixo
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria *</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, categoryId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bank">Banca *</Label>
                      <Select
                        value={formData.bankId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, bankId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma banca" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks?.map((bank) => (
                            <SelectItem key={bank.id} value={bank.id.toString()}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="difficulty">Dificuldade *</Label>
                      <Select
                        value={formData.difficultyId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, difficultyId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a dificuldade" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyLevels?.map((level) => (
                            <SelectItem key={level.id} value={level.id.toString()}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="year">Ano</Label>
                      <Input
                        type="number"
                        placeholder="2024"
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({ ...formData, year: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="questionText">Texto da Questão *</Label>
                    <Textarea
                      placeholder="Digite o texto da questão"
                      value={formData.questionText}
                      onChange={(e) =>
                        setFormData({ ...formData, questionText: e.target.value })
                      }
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Alternativas *</Label>
                    {["a", "b", "c", "d", "e"].map((letter) => (
                      <div key={letter} className="flex items-center gap-2">
                        <span className="font-semibold w-6">{letter.toUpperCase()})</span>
                        <Input
                          placeholder={`Alternativa ${letter.toUpperCase()}`}
                          value={
                            formData.alternatives[letter as keyof typeof formData.alternatives]
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              alternatives: {
                                ...formData.alternatives,
                                [letter]: e.target.value,
                              },
                            })
                          }
                          required={letter !== "e"}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="correctAnswer">Resposta Correta *</Label>
                    <Select
                      value={formData.correctAnswer}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          correctAnswer: value as "a" | "b" | "c" | "d" | "e",
                        })
                      }
                    >
                      <SelectTrigger>
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

                  <div>
                    <Label htmlFor="explanation">Explicação</Label>
                    <Textarea
                      placeholder="Explicação da resposta correta"
                      value={formData.explanation}
                      onChange={(e) =>
                        setFormData({ ...formData, explanation: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="source">Fonte</Label>
                    <Input
                      placeholder="Ex: Concurso Público 2024"
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
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
          </div>
        </CardHeader>
        <CardContent>
          {questionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : questions && questions.length > 0 ? (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {questions.map((question) => (
                <Card key={question.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold line-clamp-2">{question.questionText}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Categoria: {question.categoryId} | Banca: {question.bankId}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(question.id);
                          setOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma questão cadastrada
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
