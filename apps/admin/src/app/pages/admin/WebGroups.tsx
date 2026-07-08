import { useEffect, useState } from "react";
import { Users2, Plus, Search, Calendar, MapPin, User } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";

type Ministry = {
  id: string;
  name: string;
  description: string | null;
  leader_id: string | null;
  is_active: boolean;
};

type Group = {
  id: string;
  name: string;
  description: string | null;
  meeting_schedule: string | null;
  location: string | null;
  max_capacity: number | null;
  is_active: boolean;
  ministry_id: string | null;
};

export function WebGroups() {
  const { churchUser } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Grupos e Ministérios</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão de ministérios e pequenos grupos</p>
        </div>
      </div>

      <Tabs defaultValue="ministries">
        <TabsList>
          <TabsTrigger value="ministries">Ministérios</TabsTrigger>
          <TabsTrigger value="groups">Pequenos Grupos</TabsTrigger>
        </TabsList>

        <TabsContent value="ministries" className="mt-4">
          <MinistryList churchId={churchUser?.church_id} />
        </TabsContent>

        <TabsContent value="groups" className="mt-4">
          <GroupList churchId={churchUser?.church_id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MinistryList({ churchId }: { churchId?: string }) {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!churchId) return;
    supabase
      .from("ministries")
      .select("id, name, description, leader_id, is_active")
      .eq("church_id", churchId)
      .order("name", { ascending: true })
      .then(({ data }) => {
        setMinistries(data ?? []);
        setLoading(false);
      });
  }, [churchId]);

  const filtered = ministries.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ministérios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {search ? "Nenhum ministério encontrado" : "Nenhum ministério cadastrado"}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border p-4 hover:shadow-sm transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{m.name}</h3>
                  <Badge variant={m.is_active ? "default" : "secondary"}>
                    {m.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                {m.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{m.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GroupList({ churchId }: { churchId?: string }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!churchId) return;
    supabase
      .from("groups")
      .select("id, name, description, meeting_schedule, location, max_capacity, is_active, ministry_id")
      .eq("church_id", churchId)
      .order("name", { ascending: true })
      .then(({ data }) => {
        setGroups(data ?? []);
        setLoading(false);
      });
  }, [churchId]);

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar grupos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {search ? "Nenhum grupo encontrado" : "Nenhum grupo cadastrado"}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g) => (
              <div
                key={g.id}
                className="rounded-lg border p-4 hover:shadow-sm transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{g.name}</h3>
                  <Badge variant={g.is_active ? "default" : "secondary"}>
                    {g.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                {g.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{g.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {g.meeting_schedule && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {g.meeting_schedule}
                    </span>
                  )}
                  {g.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {g.location}
                    </span>
                  )}
                  {g.max_capacity && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Máx: {g.max_capacity}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
