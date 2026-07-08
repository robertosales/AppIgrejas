import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Save, User, Mail, Phone, Cake, MapPin, Cross, CalendarDays, Camera, Search } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../lib/auth-context";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";

export function WebMemberNew() {
  const navigate = useNavigate();
  const { churchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
    gender: "",
    cep: "",
    address: "",
    city: "",
    state: "",
    baptized_at: "",
    joined_at: "",
  });

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const fetchAddressByCep = useCallback(async (cep: string) => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((f) => ({
          ...f,
          address: data.logradouro || f.address,
          city: data.localidade || f.city,
          state: data.uf || f.state,
        }));
      }
    } catch {
      // silencioso
    } finally {
      setLoadingCep(false);
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!churchUser) return;
    setError(null);
    setLoading(true);

    try {
      const email = form.email.trim().toLowerCase();
      const password = Math.random().toString(36).slice(2, 10) + "A1!";

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: form.full_name } },
      });

      if (signUpError) {
        if (signUpError.message?.includes("rate limit")) {
          setError("Limite de envio excedido. Aguarde 1 minuto e tente novamente.");
          setLoading(false);
          return;
        }
        if (signUpError.message?.includes("already registered")) {
          setError("Este email já possui cadastro. Use outro email.");
          setLoading(false);
          return;
        }
        throw signUpError;
      }

      const userId = signUpData?.user?.id;
      if (!userId) throw new Error("Erro ao criar usuário");

      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId, email,
        full_name: form.full_name,
        phone: form.phone || null,
      });
      if (profileError) throw profileError;

      await supabase.from("church_users").insert({
        church_id: churchUser.church_id, user_id: userId, role: "member",
      });

      const { data: member, error: memberError } = await supabase
        .from("members")
        .insert({
          church_id: churchUser.church_id, user_id: userId,
          birth_date: form.birth_date || null, gender: form.gender || null,
          address: form.address || null, city: form.city || null,
          state: form.state || null, baptized_at: form.baptized_at || null,
          joined_at: form.joined_at || null,
        })
        .select("id")
        .single();

      if (memberError) throw memberError;

      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const filePath = `avatars/${userId}/photo.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("church_media")
          .upload(filePath, avatarFile, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = await supabase.storage
            .from("church_media")
            .getPublicUrl(filePath);

          if (urlData) {
            await supabase.from("profiles").update({
              avatar_url: urlData.publicUrl,
            }).eq("id", userId);
          }
        }
      }

      navigate(`/admin/members/${member.id}`);
    } catch (err: any) {
      setError(err.message ?? "Erro ao criar membro");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/members")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Novo Membro</h1>
          <p className="text-sm text-muted-foreground">Cadastrar novo membro na igreja</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Foto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-6 h-6 text-slate-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div>
                <p className="text-sm font-medium">Foto do membro</p>
                <p className="text-xs text-muted-foreground">JPG, PNG ou GIF.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Nome do membro"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="(11) 99999-9999"
                    value={form.phone}
                    maxLength={16}
                    onChange={(e) => update("phone", formatPhone(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Data de Nascimento</Label>
                <div className="relative">
                  <Cake className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" type="date" value={form.birth_date} onChange={(e) => update("birth_date", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Gênero</Label>
                <select
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
                >
                  <option value="">Selecione</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>CEP</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="00000-000"
                  value={form.cep}
                  maxLength={9}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                    const masked = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
                    update("cep", masked);
                    if (raw.length === 8) fetchAddressByCep(raw);
                  }}
                />
                {loadingCep && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Endereço</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Rua, número, bairro"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input placeholder="São Paulo" value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input placeholder="SP" value={form.state} onChange={(e) => update("state", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Vida Eclesiástica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Data de Batismo</Label>
                <div className="relative">
                  <Cross className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" type="date" value={form.baptized_at} onChange={(e) => update("baptized_at", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Data de Ingresso</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" type="date" value={form.joined_at} onChange={(e) => update("joined_at", e.target.value)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button" onClick={() => navigate("/admin/members")}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Salvando..." : "Salvar Membro"}
          </Button>
        </div>
      </form>
    </div>
  );
}
