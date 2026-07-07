import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth-context";

type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  category: string | null;
  image_url: string | null;
  max_capacity: number | null;
};

export function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { churchUser } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !churchUser) return;

    supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .eq("church_id", churchUser.church_id)
      .single()
      .then(({ data }) => {
        if (data) setEvent(data);
        setLoading(false);
      });
  }, [id, churchUser]);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center">
        <p className="text-slate-500">Evento não encontrado</p>
        <button onClick={() => navigate("/app/agenda")} className="mt-4 text-amber-600 font-medium">Voltar</button>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="absolute top-0 w-full h-64 bg-slate-200 z-0">
        <img
          src={event.image_url ?? "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800&auto=format&fit=crop"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/40"></div>
      </div>

      <header className="px-6 pt-12 pb-4 flex justify-between items-center relative z-10 text-white">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full active:scale-95 transition-transform">
          <Share2 size={20} />
        </button>
      </header>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 bg-white flex-1 rounded-t-[32px] mt-16 px-6 py-8 flex flex-col"
      >
        {event.category && (
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wide w-fit">
            {event.category}
          </div>
        )}

        <h1 className="text-2xl font-serif text-slate-900 mb-6">{event.title}</h1>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-slate-800 font-medium">{formatDate(event.date)}</p>
              <p className="text-slate-500 text-sm">Adicionar ao calendário</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-slate-800 font-medium">
                {event.start_time.slice(0, 5)}{event.end_time ? ` às ${event.end_time.slice(0, 5)}` : ""}
              </p>
            </div>
          </div>

          {event.location && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-slate-800 font-medium">{event.location}</p>
              </div>
            </div>
          )}
        </div>

        {event.description && (
          <div className="mb-8">
            <h3 className="font-medium text-slate-900 mb-2">Sobre o evento</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100">
          <button className="w-full bg-slate-900 text-white font-medium py-4 rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all">
            {event.max_capacity ? "Fazer Inscrição" : "Confirmar Presença"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
