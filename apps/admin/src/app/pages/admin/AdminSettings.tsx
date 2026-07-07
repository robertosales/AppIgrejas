import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Building2, CreditCard, Users, Shield, UserPlus } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../lib/auth-context";

type ChurchInfo = {
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  max_members: number;
  status: string;
};

type SubscriptionInfo = {
  plan_name: string;
  status: string;
  max_members: number;
  features: string[];
};

type ChurchUser = {
  user_id: string;
  email: string;
  full_name: string;
  role: string;
};

export function AdminSettings() {
  const navigate = useNavigate();
  const { churchUser } = useAuth();
  const [church, setChurch] = useState<ChurchInfo | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [members, setMembers] = useState<ChurchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  useEffect(() => {
    if (!churchUser) return;
    loadData();
  }, [churchUser]);

  async function loadData() {
    const churchId = churchUser!.church_id;

    const { data: churchData } = await supabase
      .from("churches")
      .select("name, slug, email, phone, max_members, status")
      .eq("id", churchId)
      .single();

    if (churchData) setChurch(churchData);

    const { data: subData } = await supabase
      .from("subscriptions")
      .select("plan_id, status, subscription_plans!inner(name, max_members, features)")
      .eq("church_id", churchId)
      .maybeSingle();

    if (subData) {
      const plan = subData.subscription_plans as unknown as { name: string; max_members: number; features: string[] };
      setSubscription({
        plan_name: plan.name,
        status: subData.status,
        max_members: plan.max_members,
        features: plan.features,
      });
    }

    const { data: users } = await supabase
      .from("church_users")
      .select("user_id, role, profiles!inner(email, full_name)")
      .eq("church_id", churchId);

    if (users) {
      setMembers(users.map((u) => {
        const p = u.profiles as unknown as { email: string; full_name: string };
        return { user_id: u.user_id, email: p.email, full_name: p.full_name, role: u.role };
      }));
    }

    setLoading(false);
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !church) return;

    const { data: user } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", inviteEmail.trim())
      .maybeSingle();

    if (user) {
      await supabase.from("church_users").insert({
        church_id: churchUser!.church_id,
        user_id: user.id,
        role: inviteRole,
      });
      setInviteEmail("");
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate("/admin")} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-serif text-slate-900">Administração</h1>
        </div>
      </header>

      <div className="p-5 space-y-6 pb-24">
        {church && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="font-serif text-lg text-slate-900 mb-3 flex items-center gap-2">
              <Building2 size={20} className="text-amber-500" /> Igreja
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Nome</span><span className="font-medium">{church.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Slug</span><span className="font-medium">{church.slug}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium">{church.email ?? "—"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-medium capitalize">{church.status}</span></div>
            </div>
          </div>
        )}

        {subscription && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="font-serif text-lg text-slate-900 mb-3 flex items-center gap-2">
              <CreditCard size={20} className="text-amber-500" /> Assinatura
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Plano</span><span className="font-medium">{subscription.plan_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-medium capitalize">{subscription.status}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Máx. Membros</span><span className="font-medium">{subscription.max_members}</span></div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2 font-medium">Recursos disponíveis:</p>
              <div className="flex flex-wrap gap-1.5">
                {subscription.features.map((f: string) => (
                  <span key={f} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wide">
                    {f.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-serif text-lg text-slate-900 mb-3 flex items-center gap-2">
            <Users size={20} className="text-amber-500" /> Membros da Igreja
          </h2>

          <div className="space-y-3 mb-4">
            {members.map((m) => (
              <div key={m.user_id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{m.full_name}</p>
                  <p className="text-xs text-slate-400">{m.email}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ${
                  m.role === 'super_admin' ? 'bg-purple-50 text-purple-700' :
                  m.role === 'church_admin' ? 'bg-amber-50 text-amber-700' :
                  m.role === 'pastor' ? 'bg-blue-50 text-blue-700' :
                  'bg-slate-50 text-slate-600'
                }`}>
                  {m.role.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleInvite} className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-2 font-medium flex items-center gap-1">
              <UserPlus size={14} /> Convidar por email
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
              />
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="member">Membro</option>
                <option value="pastor">Pastor</option>
                <option value="church_admin">Admin</option>
                <option value="care_team">Equipe de Cuidado</option>
              </select>
              <button
                type="submit"
                disabled={!inviteEmail.trim()}
                className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-amber-600"
              >
                Convidar
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-serif text-lg text-slate-900 mb-3 flex items-center gap-2">
            <Shield size={20} className="text-amber-500" /> Funções (Roles)
          </h2>
          <div className="text-sm text-slate-600 space-y-2">
            <p><strong className="text-slate-800">super_admin</strong> — Acesso total ao sistema</p>
            <p><strong className="text-slate-800">church_admin</strong> — Gerencia a igreja, membros, conteúdos</p>
            <p><strong className="text-slate-800">pastor</strong> — Acesso a casos de cuidado pastoral</p>
            <p><strong className="text-slate-800">care_team</strong> — Equipe de aconselhamento</p>
            <p><strong className="text-slate-800">member</strong> — Acesso básico ao app</p>
          </div>
        </div>
      </div>
    </div>
  );
}
