import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, UserCircle, MapPin, Send, AlertCircle, Calendar, MessageSquare, Briefcase, Forward } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../lib/auth-context";

type CareCase = {
  id: string;
  user_id: string;
  assigned_to: string | null;
  status: string;
  priority: string;
  subject: string;
  description: string;
  created_at: string;
  profile: { full_name: string; email: string } | null;
};

type Message = {
  id: string;
  content: string;
  sender_id: string;
  is_from_ai: boolean;
  created_at: string;
};

export function AdminCaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { churchUser } = useAuth();
  const [caseData, setCaseData] = useState<CareCase | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningUser, setAssigningUser] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    if (!id || !churchUser) return;

    async function fetchData() {
      const { data: careCase } = await supabase
        .from("care_cases")
        .select(`
          id, user_id, assigned_to, status, priority, subject, description, created_at,
          profiles!care_cases_user_id_fkey ( full_name, email )
        `)
        .eq("id", id)
        .single();

      if (careCase) {
        setCaseData(careCase as unknown as CareCase);
      }

      const { data: msgs } = await supabase
        .from("care_case_messages")
        .select("*")
        .eq("care_case_id", id)
        .order("created_at", { ascending: true });

      if (msgs) setMessages(msgs);

      setLoading(false);
    }

    fetchData();
  }, [id, churchUser]);

  const takeOwnership = async () => {
    if (!id || !churchUser) return;

    setAssigningUser(true);
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", churchUser.church_id)
      .single();

    await supabase
      .from("care_cases")
      .update({ assigned_to: profile?.id, status: "in_progress" })
      .eq("id", id);

    setCaseData(prev => prev ? { ...prev, assigned_to: profile?.id ?? null, status: "in_progress" } : null);
    setAssigningUser(false);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !id || !churchUser) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", churchUser.church_id)
      .single();

    if (!profile) return;

    await supabase.from("care_case_messages").insert({
      care_case_id: id,
      sender_id: profile.id,
      content: messageInput.trim(),
      is_from_ai: false,
    });

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: messageInput.trim(),
      sender_id: profile.id,
      is_from_ai: false,
      created_at: new Date().toISOString(),
    }]);

    setMessageInput("");
  };

  const updateStatus = async (newStatus: string) => {
    if (!id) return;
    await supabase.from("care_cases").update({ status: newStatus }).eq("id", id);
    setCaseData(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const levelLabels: Record<string, { text: string; bg: string }> = {
    red: { text: 'Urgência Alta (Risco/Crise)', bg: 'bg-red-50 text-red-700 border-red-200' },
    yellow: { text: 'Atenção Pastoral', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    green: { text: 'Dúvida Simples', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center">
        <p className="text-slate-500">Caso não encontrado</p>
        <button onClick={() => navigate("/admin/cases")} className="mt-4 text-amber-600 font-medium">Voltar</button>
      </div>
    );
  }

  const level = levelLabels[caseData.priority] ?? levelLabels.green;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-lg font-medium text-slate-900 leading-tight">Detalhes do Caso</h1>
            <p className="text-xs text-slate-500">ID: #{caseData.id.slice(0, 8)}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className={`px-6 py-3 border-b flex items-center gap-2 ${level.bg}`}>
          <AlertCircle size={18} />
          <span className="text-sm font-semibold tracking-wide uppercase">{level.text}</span>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-50">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <UserCircle size={32} />
              </div>
              <div>
                <h2 className="text-xl font-serif text-slate-900">{caseData.profile?.full_name ?? "Anônimo"}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(caseData.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Responsável</label>
                <div className="bg-slate-50 px-3 py-2 rounded-lg text-sm text-slate-800 font-medium border border-slate-200 flex items-center justify-between">
                  {caseData.assigned_to ? "Você" : "Nenhum"}
                  {!caseData.assigned_to && (
                    <button onClick={takeOwnership} disabled={assigningUser} className="text-amber-600 text-xs font-bold hover:underline">
                      {assigningUser ? "..." : "Assumir"}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Status</label>
                <select
                  value={caseData.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-2 rounded-lg text-sm text-slate-800 font-medium border border-slate-200 outline-none focus:border-amber-500"
                >
                  <option value="open">Aberto</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="resolved">Resolvido</option>
                  <option value="escalated">Escalonado</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex gap-2">
                <button className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <MessageSquare size={16} /> Falar com Membro
                </button>
                <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-transform">
                  <Forward size={16} /> Encaminhar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 pt-0">
          <h3 className="font-serif text-lg text-slate-900 mb-3 px-1 flex items-center gap-2">
            <Briefcase size={18} className="text-slate-400" />
            Histórico
          </h3>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
            {messages.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">Nenhuma mensagem ainda.</p>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender_id === caseData.user_id ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.sender_id === caseData.user_id
                    ? 'bg-slate-100 text-slate-800 rounded-tr-sm'
                    : 'bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="w-12 h-12 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shrink-0"
          >
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
