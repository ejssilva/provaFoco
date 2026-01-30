import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function BanksManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
  });

  const { data: banks, refetch: refetchBanks } = trpc.banks.list.useQuery();

  const createMutation = trpc.banks.create.useMutation({
    onSuccess: () => {
      toast.success("Banca criada com sucesso!");
      setOpen(false);
      setFormData({ name: "", description: "", logo: "" });
      refetchBanks();
    },
    onError: (error) => {
      toast.error(`Erro ao criar banca: ${error.message}`);
    },
  });

  const updateMutation = trpc.banks.update.useMutation({
    onSuccess: () => {
      toast.success("Banca atualizada com sucesso!");
      setOpen(false);
      setEditingId(null);
      refetchBanks();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar banca: ${error.message}`);
    },
  });

  const deleteMutation = trpc.banks.delete.useMutation({
    onSuccess: () => {
      toast.success("Banca deletada com sucesso!");
      refetchBanks();
    },
    onError: (error) => {
      toast.error(`Erro ao deletar banca: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Preencha o nome da banca");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      logo: formData.logo || undefined,
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
              <CardTitle>Gerenciar Bancas</CardTitle>
              <CardDescription>
                Crie e edite bancas examinadoras (CESPE, FCC, FGV, etc.)
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingId(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Banca
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Editar Banca" : "Nova Banca"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados da banca abaixo
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: CESPE"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descrição da banca"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="logo">URL da Logo</Label>
                    <Input
                      id="logo"
                      placeholder="https://example.com/logo.png"
                      value={formData.logo}
                      onChange={(e) =>
                        setFormData({ ...formData, logo: e.target.value })
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
                        "Salvar Banca"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {banks && banks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banks.map((bank) => (
                <Card key={bank.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{bank.name}</p>
                      {bank.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {bank.description}
                        </p>
                      )}
                      {bank.logo && (
                        <p className="text-xs text-muted-foreground mt-2 truncate">
                          Logo: {bank.logo}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(bank.id);
                          setFormData({
                            name: bank.name,
                            description: bank.description || "",
                            logo: bank.logo || "",
                          });
                          setOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(bank.id)}
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
              Nenhuma banca cadastrada
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
