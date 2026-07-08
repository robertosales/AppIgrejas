import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Save, User, Phone, Mail, Cake, MapPin, Cross, CalendarDays, Camera, Search } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../lib/auth-context";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

type MemberProfile = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  birth_date: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  baptized_at: string | null;
  joined_at: string | null;
  is_active: boolean;
  role: string;
};

export function WebMemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { churchUser } = useAuth();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cep, setCep] = useState("");

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const fetchAddressByCep = useCallback(async (rawCep: string) => {
    if (rawCep.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await res.json();
      if (!data.erro && member) {
        setMember({
          ...member,
          address: data.logradouro || member.address,
          city: data.localidade || member.city,
          state: data.uf || member.state,
        });
      }
    } catch {
      // silencioso
    } finally {
      setLoadingCep(false);
    }
  }, [member]);

  useEffect(() => {
    if (!id || !churchUser) return;
    loadMember();
  }, [id, churchUser]);

  const loadMember = async () => {
    setLoading(true);
    const { data: memberData, error } = await supabase
      .from("members")
      .select("id, user_id, birth_date, gender, address, city, state, baptized_at, joined_at, is_active")
      .eq("id", id)
      .eq("church_id", churchUser!.church_id)
      .single();

    if (error || !memberData) {
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, phone, avatar_url")
      .eq("id", memberData.user_id)
      .single();

    const { data: churchUserData } = await supabase
      .from("church_users")
      .select("role")
      .eq("user_id", memberData.user_id)
      .eq("church_id", churchUser!.church_id)
      .single();

    setMember({
      id: memberData.id,
      user_id: memberData.user_id,
      full_name: profile?.full_name ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? null,
      avatar_url: profile?.avatar_url ?? null,
      birth_date: memberData.birth_date,
      gender: memberData.gender,
      address: memberData.address,
      city: memberData.city,
      state: memberData.state,
      baptized_at: memberData.baptized_at,
      joined_at: memberData.joined_at,
      is_active: memberData.is_active,
      role: churchUserData?.role ?? "member",
    });
    setLoading(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member || !churchUser) return;
    setSaving(true);

    let avatarUrl = member.avatar_url;

    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const filePath = `avatars/${member.user_id}/photo.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("church_media")
        .upload(filePath, avatarFile, { upsert: true });

      if (!uploadError) {
        const { data: urlData } = await supabase.storage
          .from("church_media")
          .getPublicUrl(filePath);

        if (urlData) avatarUrl = urlData.publicUrl;
      }
    }

    await supabase.from("members").update({
      birth_date: member.birth_date,
      gender: member.gender,
      address: member.address,
      city: member.city,
      state: member.state,
      baptized_at: member.baptized_at,
      joined_at: member.joined_at,
      is_active: member.is_active,
    }).eq("id", member.id);

    await supabase.from("profiles").update({
      phone: member.phone,
      avatar_url: avatarUrl,
    }).eq("id", member.user_id);

    setSaving(false);
    setEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    loadMember();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /></div>;

  if (!member) return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Membro não encontrado</p>
      <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/members")}>Voltar</Button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/members")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{member.full_name}</h1>
            <p className="text-sm text-muted-foreground">Detalhes do membro</p>
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={() => { setEditing(false); setAvatarFile(null); setAvatarPreview(null); }}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>Editar</Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Foto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : member.avatar_url ? (
                <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-slate-400" />
              )}
              {editing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{member.full_name}</p>
              <p className="text-xs text-muted-foreground">{editing ? "Clique na foto para alterar" : ""}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Nome completo" icon={User}>
              {editing ? (
                <Input value={member.full_name} disabled className="bg-slate-50" />
              ) : (
                <span>{member.full_name}</span>
              )}
            </Field>
            <Field label="Email" icon={Mail}>
              {editing ? (
                <Input value={member.email} disabled className="bg-slate-50" />
              ) : (
                <span>{member.email}</span>
              )}
            </Field>
              <Field label="Telefone" icon={Phone}>
              {editing ? (
                <Input value={member.phone ?? ""} maxLength={16} onChange={(e) => setMember({ ...member, phone: formatPhone(e.target.value) || null })} />
              ) : (
                <span>{member.phone ?? "—"}</span>
              )}
            </Field>
            <Field label="Aniversário" icon={Cake}>
              {editing ? (
                <Input type="date" value={member.birth_date ?? ""} onChange={(e) => setMember({ ...member, birth_date: e.target.value || null })} />
              ) : (
                <span>{member.birth_date ? new Date(member.birth_date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : "—"}</span>
              )}
            </Field>
            <Field label="Gênero">
              {editing ? (
                <select
                  value={member.gender ?? ""}
                  onChange={(e) => setMember({ ...member, gender: e.target.value || null })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              ) : (
                <span className="capitalize">{member.gender === "male" ? "Masculino" : member.gender === "female" ? "Feminino" : "—"}</span>
              )}
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing && (
              <Field label="CEP">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="00000-000"
                    value={cep}
                    maxLength={9}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                      const masked = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
                      setCep(masked);
                      if (raw.length === 8) fetchAddressByCep(raw);
                    }}
                  />
                  {loadingCep && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </Field>
            )}
            <Field label="Endereço" icon={MapPin}>
              {editing ? (
                <Input value={member.address ?? ""} onChange={(e) => setMember({ ...member, address: e.target.value || null })} />
              ) : (
                <span>{member.address ?? "—"}</span>
              )}
            </Field>
            <Field label="Cidade">
              {editing ? (
                <Input value={member.city ?? ""} onChange={(e) => setMember({ ...member, city: e.target.value || null })} />
              ) : (
                <span>{member.city ?? "—"}</span>
              )}
            </Field>
            <Field label="Estado">
              {editing ? (
                <Input value={member.state ?? ""} onChange={(e) => setMember({ ...member, state: e.target.value || null })} />
              ) : (
                <span>{member.state ?? "—"}</span>
              )}
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cross className="h-4 w-4" />
              Vida Eclesiástica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Data de Batismo" icon={Cross}>
              {editing ? (
                <Input type="date" value={member.baptized_at ?? ""} onChange={(e) => setMember({ ...member, baptized_at: e.target.value || null })} />
              ) : (
                <span>{member.baptized_at ? new Date(member.baptized_at + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : "—"}</span>
              )}
            </Field>
            <Field label="Data de Ingresso" icon={CalendarDays}>
              {editing ? (
                <Input type="date" value={member.joined_at ?? ""} onChange={(e) => setMember({ ...member, joined_at: e.target.value || null })} />
              ) : (
                <span>{member.joined_at ? new Date(member.joined_at + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : "—"}</span>
              )}
            </Field>
            <Field label="Status">
              {editing ? (
                <select
                  value={member.is_active ? "active" : "inactive"}
                  onChange={(e) => setMember({ ...member, is_active: e.target.value === "active" })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              ) : (
                <Badge variant={member.is_active ? "default" : "secondary"}>
                  {member.is_active ? "Ativo" : "Inativo"}
                </Badge>
              )}
            </Field>
            <Field label="Função">
              <span className="capitalize">{member.role.replace("_", " ")}</span>
            </Field>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </Label>
      <div className="text-sm">{children}</div>
    </div>
  );
}
