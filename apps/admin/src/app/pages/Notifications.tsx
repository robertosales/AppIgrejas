import { useNavigate } from "react-router";
import { ChevronLeft, Bell, Calendar, Heart } from "lucide-react";

export function Notifications() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <header className="px-6 pt-12 pb-4 bg-white border-b border-slate-100 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full mr-4 hover:bg-slate-50">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-slate-900">Notificações</h1>
      </header>

      <div className="p-4 space-y-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 opacity-100">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
            <Bell size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900 text-sm">O Culto vai começar!</h3>
            <p className="text-slate-500 text-sm mt-1">Estamos ao vivo no YouTube. Venha adorar com a gente.</p>
            <span className="text-xs text-slate-400 mt-2 block">Há 5 min</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 opacity-70">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900 text-sm">Inscrição confirmada</h3>
            <p className="text-slate-500 text-sm mt-1">Sua vaga para o Encontro de Jovens está garantida.</p>
            <span className="text-xs text-slate-400 mt-2 block">Ontem</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 opacity-70">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
            <Heart size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900 text-sm">Atualização de Oração</h3>
            <p className="text-slate-500 text-sm mt-1">Alguém da equipe pastoral começou a orar pelo seu pedido.</p>
            <span className="text-xs text-slate-400 mt-2 block">2 dias atrás</span>
          </div>
        </div>
      </div>
    </div>
  );
}
