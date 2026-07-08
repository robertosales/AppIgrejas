import { useEffect, useState } from "react";
import { Users, Heart, Calendar, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

type DashboardData = {
  totalMembers: number;
  newMembersThisMonth: number;
  openCases: number;
  upcomingEvents: number;
};

export function WebDashboard() {
  const { churchUser } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!churchUser) return;

    async function fetchData() {
      const churchId = churchUser.church_id;

      const [{ count: totalMembers }, { count: newMembers }, { count: openCases }, { count: upcomingEvents }] =
        await Promise.all([
          supabase.from("members").select("*", { count: "exact", head: true }).eq("church_id", churchId),
          supabase.from("members").select("*", { count: "exact", head: true }).eq("church_id", churchId).gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
          supabase.from("care_cases").select("*", { count: "exact", head: true }).eq("church_id", churchId).in("status", ["open", "in_progress"]),
          supabase.from("events").select("*", { count: "exact", head: true }).eq("church_id", churchId).gte("date", new Date().toISOString().split("T")[0]).lte("date", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]),
        ]);

      setData({
        totalMembers: totalMembers ?? 0,
        newMembersThisMonth: newMembers ?? 0,
        openCases: openCases ?? 0,
        upcomingEvents: upcomingEvents ?? 0,
      });
      setLoading(false);
    }

    fetchData();
  }, [churchUser]);

  const stats = data ? [
    { title: "Total de Membros", value: data.totalMembers, icon: Users, change: `+${data.newMembersThisMonth} este mês`, trend: "up" as const },
    { title: "Casos em Aberto", value: data.openCases, icon: Heart, change: "Casos ativos", trend: "up" as const },
    { title: "Próximos Eventos", value: data.upcomingEvents, icon: Calendar, change: "Nos próximos 7 dias", trend: "up" as const },
    { title: "Novos Membros", value: data.newMembersThisMonth, icon: TrendingUp, change: "Este mês", trend: "up" as const },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral da igreja</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-amber-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{loading ? "..." : stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Casos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentCases churchId={churchUser?.church_id} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingEvents churchId={churchUser?.church_id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RecentCases({ churchId }: { churchId?: string }) {
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    if (!churchId) return;
    supabase
      .from("care_cases")
      .select("id, title, status, priority, created_at")
      .eq("church_id", churchId)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setCases(data ?? []));
  }, [churchId]);

  if (cases.length === 0) return <p className="text-sm text-muted-foreground py-4 text-center">Nenhum caso recente</p>;

  return (
    <div className="space-y-3">
      {cases.map((c) => (
        <div key={c.id} className="flex items-center justify-between border-b pb-2 last:border-0">
          <span className="text-sm font-medium truncate flex-1">{c.title}</span>
          <div className="flex gap-2 shrink-0">
            <Badge variant={c.priority === "red" ? "destructive" : c.priority === "yellow" ? "secondary" : "outline"}>
              {c.priority === "red" ? "Urgente" : c.priority === "yellow" ? "Atenção" : "Normal"}
            </Badge>
            <Badge variant={c.status === "open" ? "default" : c.status === "in_progress" ? "secondary" : "outline"}>
              {c.status === "open" ? "Aberto" : c.status === "in_progress" ? "Em Andamento" : "Resolvido"}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function UpcomingEvents({ churchId }: { churchId?: string }) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!churchId) return;
    supabase
      .from("events")
      .select("id, title, date, time")
      .eq("church_id", churchId)
      .gte("date", new Date().toISOString().split("T")[0])
      .order("date", { ascending: true })
      .limit(5)
      .then(({ data }) => setEvents(data ?? []));
  }, [churchId]);

  if (events.length === 0) return <p className="text-sm text-muted-foreground py-4 text-center">Nenhum evento agendado</p>;

  const formatDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" });

  return (
    <div className="space-y-3">
      {events.map((e) => (
        <div key={e.id} className="flex items-center gap-3 border-b pb-2 last:border-0">
          <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold leading-tight">
            <span>{new Date(e.date + "T12:00:00").getDate()}</span>
            <span className="text-[10px] font-normal">{new Date(e.date + "T12:00:00").toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{e.title}</p>
            <p className="text-xs text-muted-foreground">{e.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
