import { useNavigate } from "react-router";
import { ShieldAlert, ChevronLeft, Bot, HeartHandshake } from "lucide-react";

export function CareWarning() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative">
      <header className="px-6 pt-12 pb-4 flex items-center bg-slate-50 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-slate-600 rounded-full mr-4 hover:bg-slate-50">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-slate-900">Atendimento</h1>
      </header>

      <div className="p-6 flex-1 flex flex-col justify-center pb-24">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
          
          <div className="flex justify-center mb-6 relative">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-sm">
              <Bot size={28} className="text-blue-600" />
            </div>
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center absolute -right-4 z-0 border-4 border-white">
              <HeartHandshake size={28} className="text-emerald-600" />
            </div>
          </div>

          <h2 className="text-xl font-serif text-slate-900 mb-4">Acolhimento Inteligente</h2>
          
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Para garantir que você receba o melhor cuidado o mais rápido possível, nosso atendimento inicial é feito por uma <strong>assistente virtual</strong>.
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 text-left mb-8">
            <div className="flex items-start gap-3">
              <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                A inteligência artificial <strong className="text-slate-700">não substitui</strong> o cuidado pastoral humano. Ela nos ajuda a entender sua necessidade para direcioná-lo(a) ao conselheiro ou pastor adequado caso seja necessário.
              </p>
            </div>
          </div>

          <button 
            onClick={() => navigate("/app/chat")}
            className="w-full bg-slate-900 text-white font-medium py-4 rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
          >
            Iniciar Atendimento
          </button>
        </div>
      </div>
    </div>
  );
}
