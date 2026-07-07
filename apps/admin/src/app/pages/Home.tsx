import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Bell, Heart, MessageCircle, CalendarDays, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth-context";

type Event = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  location: string | null;
  category: string | null;
};

export function Home() {
  const navigate = useNavigate();
  const { profile, churchUser, signOut } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!churchUser) return;

    supabase
      .from("events")
      .select("id, title, date, start_time, location, category")
      .eq("church_id", churchUser.church_id)
      .eq("status", "published")
      .order("date", { ascending: true })
      .limit(3)
      .then(({ data }) => {
        if (data) setEvents(data);
      });
  }, [churchUser]);

  const userFirstName = profile?.full_name?.split(" ")[0] ?? "Visitante";

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-full">
      <header className="px-6 pt-12 pb-4 bg-slate-900 text-white flex justify-between items-center rounded-b-[32px] shadow-sm relative z-10">
        <div>
          <p className="text-amber-400 text-xs font-medium tracking-widest uppercase mb-1">Bem-vindo, {userFirstName}</p>
          <h1 className="text-xl font-serif">{churchUser?.church_name ?? "Comunidade Vida"}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/app/notifications")}
            className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center relative hover:bg-slate-700 transition-colors"
          >
            <Bell size={20} className="text-slate-300" />
          </button>
        </div>
      </header>

      <div className="px-5 py-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-slate-800 rounded-3xl overflow-hidden aspect-[2/1] shadow-lg flex items-end p-5"
        >
          <img
            src="https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=800&auto=format&fit=crop"
            alt="Worship"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-amber-500 text-slate-900 text-xs font-bold rounded-full mb-2 uppercase tracking-wide">Domingo</span>
            <h2 className="text-white font-serif text-xl leading-tight">Série: O Caminho da Graça</h2>
            <p className="text-slate-300 text-sm mt-1">Cultos às 10h e 18h</p>
          </div>
        </motion.div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/app/prayer")}
            className="flex-1 bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Heart size={24} />
            </div>
            <span className="text-sm font-medium text-slate-700">Pedido de Oração</span>
          </button>

          <button
            onClick={() => navigate("/app/care-warning")}
            className="flex-1 bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle size={24} />
            </div>
            <span className="text-sm font-medium text-slate-700 text-center leading-tight">Atendimento Pastoral</span>
          </button>
        </div>

        <div>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-serif text-slate-900">Próximos Eventos</h3>
            <button onClick={() => navigate("/app/agenda")} className="text-amber-600 text-sm font-medium flex items-center hover:text-amber-700">
              Ver todos <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {events.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">Nenhum evento publicado ainda.</p>
            )}
            {events.map((ev) => (
              <div
                key={ev.id}
                onClick={() => navigate(`/app/agenda/${ev.id}`)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center shrink-0">
                  <CalendarDays size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">{ev.title}</h4>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {new Date(ev.date).toLocaleDateString("pt-BR")} - {ev.start_time.slice(0, 5)}
                    {ev.location ? ` - ${ev.location}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-serif text-slate-900 mb-4">Explore</h3>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/app/content")}
              className="flex-1 bg-slate-100/50 border border-slate-100 rounded-2xl p-4 text-left active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 bg-slate-900 text-amber-500 rounded-full flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
              <h4 className="font-medium text-slate-800">Mensagens</h4>
              <p className="text-xs text-slate-500 mt-1">Sermões e estudos</p>
            </button>
            <button
              onClick={() => navigate("/app/groups")}
              className="flex-1 bg-slate-100/50 border border-slate-100 rounded-2xl p-4 text-left active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 bg-slate-900 text-amber-500 rounded-full flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h4 className="font-medium text-slate-800">Ministérios</h4>
              <p className="text-xs text-slate-500 mt-1">Encontre seu grupo</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
