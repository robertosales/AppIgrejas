import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, Clock, MapPin } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth-context";

type Event = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  category: string | null;
  image_url: string | null;
  description: string | null;
};

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export function Agenda() {
  const navigate = useNavigate();
  const { churchUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());

  useEffect(() => {
    if (!churchUser) return;
    setLoading(true);

    const startDate = new Date(new Date().getFullYear(), monthIndex, 1).toISOString().split("T")[0];
    const endDate = new Date(new Date().getFullYear(), monthIndex + 1, 0).toISOString().split("T")[0];

    supabase
      .from("events")
      .select("id, title, date, start_time, end_time, location, category, image_url, description")
      .eq("church_id", churchUser.church_id)
      .eq("status", "published")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true })
      .then(({ data }) => {
        if (data) setEvents(data);
        setLoading(false);
      });
  }, [churchUser, monthIndex]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return {
      dayName: dayNames[d.getDay()],
      day: String(d.getDate()).padStart(2, "0"),
      month: MONTHS[d.getMonth()],
    };
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 sticky top-0 z-10">
        <h1 className="text-2xl font-serif text-slate-900">Agenda</h1>
        <p className="text-slate-500 text-sm mt-1">Acompanhe nossos encontros</p>
      </header>

      <div className="p-5 space-y-6">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {MONTHS.map((m, i) => (
            <button
              key={m}
              onClick={() => setMonthIndex(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                i === monthIndex ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-slate-400 py-12">Nenhum evento neste mês.</p>
          ) : (
            events.map(ev => {
              const { dayName, day, month } = formatDate(ev.date);
              return (
                <div
                  key={ev.id}
                  onClick={() => navigate(`/app/agenda/${ev.id}`)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex flex-col items-center justify-center w-16 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{dayName}</span>
                    <span className="text-xl font-serif text-slate-900 mt-1">{day}</span>
                  </div>
                  <div className="flex-1 py-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-slate-800">{ev.title}</h3>
                      {ev.category && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wide">
                          {ev.category}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 mt-2">
                      <div className="flex items-center text-slate-500 text-xs">
                        <Clock size={14} className="mr-2 text-slate-400" /> {ev.start_time.slice(0, 5)}{ev.end_time ? ` - ${ev.end_time.slice(0, 5)}` : ""}
                      </div>
                      {ev.location && (
                        <div className="flex items-center text-slate-500 text-xs">
                          <MapPin size={14} className="mr-2 text-slate-400" /> {ev.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
