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

const PLACEMENTS = [
  { value: "header_banner", label: "Banner no Topo" },
  { value: "sidebar_top", label: "Sidebar - Topo" },
  { value: "sidebar_middle", label: "Sidebar - Meio" },
  { value: "sidebar_bottom", label: "Sidebar - Rodapé" },
  { value: "between_questions", label: "Entre Questões" },
  { value: "footer", label: "Rodapé" },
];

export default function AdsManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    placement: "header_banner",
    adCode: "",
    priority: "0",
  });

  const { data: ads, refetch: refetchAds } = trpc.ads.list.useQuery();

  const createMutation = trpc.ads.create.useMutation({
    onSuccess: () => {
      toast.success("Anúncio criado com sucesso!");
      setOpen(false);
      setFormData({ name: "", placement: "header_banner", adCode: "", priority: "0" });
      refetchAds();
    },
    onError: (error) => {
      toast.error(`Erro ao criar anúncio: ${error.message}`);
    },
  });

  const updateMutation = trpc.ads.update.useMutation({
    onSuccess: () => {
      toast.success("Anúncio atualizado com sucesso!");
      setOpen(false);
      setEditingId(null);
      refetchAds();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar anúncio: ${error.message}`);
    },
  });

  const deleteMutation = trpc.ads.delete.useMutation({
    onSuccess: () => {
      toast.success("Anúncio deletado com sucesso!");
      refetchAds();
    },
    onError: (error) => {
      toast.error(`Erro ao deletar anúncio: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.adCode) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const payload = {
      name: formData.name,
      placement: formData.placement as any,
      adCode: formData.adCode,
      priority: parseInt(formData.priority),
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
              <CardTitle>Gerenciar Anúncios</CardTitle>
              <CardDescription>
                Configure anúncios para monetização do portal
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingId(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Anúncio
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Editar Anúncio" : "Novo Anúncio"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure um novo anúncio para o portal
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Anúncio *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Google AdSense - Header"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="placement">Posição *</Label>
                    <Select
                      value={formData.placement}
                      onValueChange={(value) =>
                        setFormData({ ...formData, placement: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PLACEMENTS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Input
                      id="priority"
                      type="number"
                      placeholder="0"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="adCode">Código do Anúncio *</Label>
                    <Textarea
                      id="adCode"
                      placeholder="Cole aqui o código do anúncio (Google AdSense, AdNetwork, etc.)"
                      value={formData.adCode}
                      onChange={(e) =>
                        setFormData({ ...formData, adCode: e.target.value })
                      }
                      rows={6}
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
                        "Salvar Anúncio"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {ads && ads.length > 0 ? (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {ads.map((ad) => (
                <Card key={ad.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{ad.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Posição: {PLACEMENTS.find(p => p.value === ad.placement)?.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Prioridade: {ad.priority} | Ativo: {ad.isActive ? "Sim" : "Não"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(ad.id);
                          setFormData({
                            name: ad.name,
                            placement: ad.placement,
                            adCode: ad.adCode,
                            priority: ad.priority?.toString() || "0",
                          });
                          setOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(ad.id)}
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
              Nenhum anúncio cadastrado
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
