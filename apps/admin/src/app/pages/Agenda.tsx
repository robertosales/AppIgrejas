import { useNavigate } from "react-router";
import { ChevronLeft, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

const events = [
  { id: "1", date: "15 Set", day: "Domingo", title: "Culto de Celebração", time: "10:00 - 11:30", loc: "Templo Principal", type: "Culto" },
  { id: "2", date: "15 Set", day: "Domingo", title: "Culto de Celebração", time: "18:00 - 19:30", loc: "Templo Principal", type: "Culto" },
  { id: "3", date: "18 Set", day: "Quarta", title: "Reunião de Oração", time: "20:00 - 21:00", loc: "Capela", type: "Oração" },
  { id: "4", date: "21 Set", day: "Sábado", title: "Encontro de Jovens", time: "19:30 - 21:30", loc: "Espaço Jovem", type: "Jovens" },
];

export function Agenda() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 sticky top-0 z-10">
        <h1 className="text-2xl font-serif text-slate-900">Agenda</h1>
        <p className="text-slate-500 text-sm mt-1">Acompanhe nossos encontros</p>
      </header>

      <div className="p-5 space-y-6">
        {/* Month selector simple mock */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {['Setembro', 'Outubro', 'Novembro'].map((m, i) => (
            <button key={m} className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
              {m}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {events.map(ev => (
            <div 
              key={ev.id}
              onClick={() => navigate(`/app/agenda/${ev.id}`)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex flex-col items-center justify-center w-16 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{ev.day.substring(0,3)}</span>
                <span className="text-xl font-serif text-slate-900 mt-1">{ev.date.split(' ')[0]}</span>
              </div>
              <div className="flex-1 py-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-slate-800">{ev.title}</h3>
                </div>
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center text-slate-500 text-xs">
                    <Clock size={14} className="mr-2 text-slate-400" /> {ev.time}
                  </div>
                  <div className="flex items-center text-slate-500 text-xs">
                    <MapPin size={14} className="mr-2 text-slate-400" /> {ev.loc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
