import { useEffect, useState } from "react";
import { Building, Plus, Search, Wrench, MapPin, User } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

type Asset = {
  id: string;
  name: string;
  category: string;
  acquisition_value: number | null;
  current_value: number | null;
  location: string | null;
  status: string;
  responsible_id: string | null;
};

const categoryLabels: Record<string, string> = {
  real_estate: "Imóvel",
  vehicle: "Veículo",
  furniture: "Móvel",
  equipment: "Equipamento",
  instrument: "Instrumento",
  other: "Outro",
};

const statusLabels: Record<string, string> = {
  active: "Ativo",
  maintenance: "Em Manutenção",
  inactive: "Inativo",
  sold: "Vendido",
};

const statusColors: Record<string, string> = {
  active: "default",
  maintenance: "secondary",
  inactive: "outline",
  sold: "destructive",
} as const;

export function WebAssets() {
  const { churchUser } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, activeValue: 0 });

  useEffect(() => {
    if (!churchUser) return;
    supabase
      .from("assets")
      .select("id, name, category, acquisition_value, current_value, location, status, responsible_id")
      .eq("church_id", churchUser.church_id)
      .order("name", { ascending: true })
      .then(({ data }) => {
        const list = data ?? [];
        setAssets(list);
        setStats({
          total: list.length,
          activeValue: list
            .filter((a) => a.status === "active")
            .reduce((s, a) => s + Number(a.current_value ?? a.acquisition_value ?? 0), 0),
        });
        setLoading(false);
      });
  }, [churchUser]);

  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const filtered = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Patrimônio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.total} {stats.total === 1 ? "bem cadastrado" : "bens cadastrados"}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Bem
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Bens</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building className="h-4 w-4 text-blue-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{loading ? "..." : stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor do Patrimônio</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Building className="h-4 w-4 text-emerald-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {loading ? "..." : formatBRL(stats.activeValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {search ? "Nenhum bem encontrado" : "Nenhum bem cadastrado"}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Nome</th>
                    <th className="pb-3 font-medium">Categoria</th>
                    <th className="pb-3 font-medium">Localização</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                      <td className="py-3 font-medium">{a.name}</td>
                      <td className="py-3 text-muted-foreground">{categoryLabels[a.category] ?? a.category}</td>
                      <td className="py-3 text-muted-foreground">{a.location ?? "—"}</td>
                      <td className="py-3">
                        <Badge variant={(statusColors[a.status] as any) ?? "outline"}>
                          {statusLabels[a.status] ?? a.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right font-medium">
                        {a.current_value
                          ? formatBRL(Number(a.current_value))
                          : a.acquisition_value
                            ? formatBRL(Number(a.acquisition_value))
                            : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
