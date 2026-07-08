import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Plus, Search, ArrowUpRight } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";

type FinanceSummary = {
  income: number;
  expense: number;
  tithes: number;
  balance: number;
};

type Transaction = {
  id: string;
  type: string;
  amount: number;
  description: string;
  transaction_date: string;
  reference: string | null;
};

export function WebFinance() {
  const { churchUser } = useAuth();
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!churchUser) return;
    async function fetchData() {
      const churchId = churchUser.church_id;
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;

      const { data: txData } = await supabase
        .from("financial_transactions")
        .select("id, type, amount, description, transaction_date, reference")
        .eq("church_id", churchId)
        .gte("transaction_date", `${year}-${String(month).padStart(2, "0")}-01`)
        .lte("transaction_date", `${year}-${String(month).padStart(2, "0")}-31`)
        .order("transaction_date", { ascending: false })
        .limit(50);

      const { data: titheData } = await supabase
        .from("tithes")
        .select("amount")
        .eq("church_id", churchId)
        .gte("transaction_date", `${year}-${String(month).padStart(2, "0")}-01`)
        .lte("transaction_date", `${year}-${String(month).padStart(2, "0")}-31`);

      setTransactions(txData ?? []);

      const income = (txData ?? [])
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0);
      const expense = (txData ?? [])
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0);
      const tithes = (titheData ?? []).reduce((s, t) => s + Number(t.amount), 0);

      setSummary({ income, expense, tithes, balance: income - expense });
      setLoading(false);
    }
    fetchData();
  }, [churchUser]);

  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const filtered = transactions.filter((t) =>
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const stats = summary ? [
    { title: "Receitas do Mês", value: summary.income, icon: TrendingUp, color: "bg-emerald-100 text-emerald-700" },
    { title: "Despesas do Mês", value: summary.expense, icon: TrendingDown, color: "bg-red-100 text-red-700" },
    { title: "Dízimos do Mês", value: summary.tithes, icon: DollarSign, color: "bg-amber-100 text-amber-700" },
    { title: "Saldo", value: summary.balance, icon: PiggyBank, color: summary.balance >= 0 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700" },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Financeiro</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão financeira da igreja</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {loading ? "..." : formatBRL(stat.value)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="tithes">Dízimos</TabsTrigger>
          <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar transações..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {search ? "Nenhuma transação encontrada" : "Nenhuma transação este mês"}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 font-medium">Data</th>
                        <th className="pb-3 font-medium">Descrição</th>
                        <th className="pb-3 font-medium">Tipo</th>
                        <th className="pb-3 font-medium text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((t) => (
                        <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                          <td className="py-3">{new Date(t.transaction_date + "T12:00:00").toLocaleDateString("pt-BR")}</td>
                          <td className="py-3 font-medium">{t.description}</td>
                          <td className="py-3">
                            <Badge variant={t.type === "income" ? "default" : "destructive"}>
                              {t.type === "income" ? "Receita" : t.type === "expense" ? "Despesa" : "Transferência"}
                            </Badge>
                          </td>
                          <td className={`py-3 text-right font-medium ${t.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                            {t.type === "income" ? "+" : "-"}{formatBRL(Number(t.amount))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tithes" className="mt-4">
          <TitheList churchId={churchUser?.church_id} />
        </TabsContent>

        <TabsContent value="budgets" className="mt-4">
          <BudgetList churchId={churchUser?.church_id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TitheList({ churchId }: { churchId?: string }) {
  const [tithes, setTithes] = useState<any[]>([]);

  useEffect(() => {
    if (!churchId) return;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    supabase
      .from("tithes")
      .select("id, amount, transaction_date, notes, members!inner(full_name)")
      .eq("church_id", churchId)
      .gte("transaction_date", `${year}-${String(month).padStart(2, "0")}-01`)
      .lte("transaction_date", `${year}-${String(month).padStart(2, "0")}-31`)
      .order("transaction_date", { ascending: false })
      .then(({ data }) => setTithes(data ?? []));
  }, [churchId]);

  if (tithes.length === 0)
    return <p className="text-sm text-muted-foreground text-center py-8">Nenhum dízimo registrado este mês</p>;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Data</th>
                <th className="pb-3 font-medium">Membro</th>
                <th className="pb-3 font-medium">Observação</th>
                <th className="pb-3 font-medium text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {tithes.map((t: any) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-3">{new Date(t.transaction_date + "T12:00:00").toLocaleDateString("pt-BR")}</td>
                  <td className="py-3 font-medium">{t.members?.full_name ?? "—"}</td>
                  <td className="py-3 text-muted-foreground">{t.notes ?? "—"}</td>
                  <td className="py-3 text-right font-medium text-amber-600">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(t.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function BudgetList({ churchId }: { churchId?: string }) {
  const [budgets, setBudgets] = useState<any[]>([]);

  useEffect(() => {
    if (!churchId) return;
    const year = new Date().getFullYear();
    supabase
      .from("budgets")
      .select("id, year, planned_amount, notes, chart_of_accounts!inner(name, type)")
      .eq("church_id", churchId)
      .eq("year", year)
      .order("planned_amount", { ascending: false })
      .then(({ data }) => setBudgets(data ?? []));
  }, [churchId]);

  if (budgets.length === 0)
    return <p className="text-sm text-muted-foreground text-center py-8">Nenhum orçamento registrado para {new Date().getFullYear()}</p>;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Conta</th>
                <th className="pb-3 font-medium">Tipo</th>
                <th className="pb-3 font-medium">Observação</th>
                <th className="pb-3 font-medium text-right">Previsto</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b: any) => (
                <tr key={b.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-medium">{b.chart_of_accounts?.name ?? "—"}</td>
                  <td className="py-3">
                    <Badge variant={b.chart_of_accounts?.type === "revenue" ? "default" : "secondary"}>
                      {b.chart_of_accounts?.type === "revenue" ? "Receita" : "Despesa"}
                    </Badge>
                  </td>
                  <td className="py-3 text-muted-foreground">{b.notes ?? "—"}</td>
                  <td className="py-3 text-right font-medium">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(b.planned_amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
