import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

type Member = {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  birth_date: string | null;
  avatar_url: string | null;
};

export function WebMembers() {
  const navigate = useNavigate();
  const { churchUser } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!churchUser) return;
    setLoading(true);
    supabase
      .from("members")
      .select("id, user_id, is_active, birth_date")
      .eq("church_id", churchUser.church_id)
      .order("created_at", { ascending: false })
      .then(async ({ data: memberData }) => {
        if (!memberData) {
          setMembers([]);
          setLoading(false);
          return;
        }
        const userIds = memberData.map((m) => m.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, avatar_url")
          .in("id", userIds);

        const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

        setMembers(
          memberData.map((m) => {
            const profile = profileMap.get(m.user_id);
            return {
              id: m.id,
              user_id: m.user_id,
              full_name: profile?.full_name ?? "",
              email: profile?.email ?? null,
              phone: profile?.phone ?? null,
              avatar_url: profile?.avatar_url ?? null,
              is_active: m.is_active,
              birth_date: m.birth_date,
            };
          })
        );
        setLoading(false);
      });
  }, [churchUser]);

  const filtered = members.filter((m) =>
    m.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Membros</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {members.length} {members.length === 1 ? "membro cadastrado" : "membros cadastrados"}
          </p>
        </div>
        <Button onClick={() => navigate("/admin/members/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Membro
        </Button>
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
              {search ? "Nenhum membro encontrado" : "Nenhum membro cadastrado"}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Membro</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Telefone</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Aniversário</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => navigate(`/admin/members/${m.id}`)}
                      className="border-b last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {m.avatar_url ? (
                              <img src={m.avatar_url} alt="" className="h-full w-full object-cover rounded-full" />
                            ) : (
                              <AvatarFallback className="text-xs">
                                {m.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="font-medium">{m.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{m.email ?? "—"}</td>
                      <td className="py-3 text-muted-foreground">{m.phone ?? "—"}</td>
                      <td className="py-3">
                        <Badge variant={m.is_active ? "default" : "secondary"}>
                          {m.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {m.birth_date ? new Date(m.birth_date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long" }) : "—"}
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
