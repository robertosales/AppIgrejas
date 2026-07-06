import { useNavigate } from "react-router";
import { User, Settings, LogOut, Heart, Bookmark, ChevronRight } from "lucide-react";

export function Profile() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <header className="px-6 pt-12 pb-6 bg-slate-900 text-white rounded-b-[32px] shadow-sm relative z-10">
        <h1 className="text-xl font-serif mb-6">Meu Perfil</h1>
        
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700">
            <User size={32} className="text-slate-400" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-white">João Silva</h2>
            <p className="text-slate-400 text-sm">Membro desde 2021</p>
            <span className="inline-block px-2 py-0.5 bg-amber-500 text-slate-900 text-[10px] font-bold rounded-full mt-2 uppercase tracking-wide">Membro</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Heart size={20} />
              </div>
              <span className="font-medium text-slate-700">Meus Pedidos de Oração</span>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                <Bookmark size={20} />
              </div>
              <span className="font-medium text-slate-700">Inscrições em Eventos</span>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 active:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                <Settings size={20} />
              </div>
              <span className="font-medium text-slate-700">Configurações da Conta</span>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </button>
        </div>

        <button 
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-medium bg-red-50 rounded-2xl active:bg-red-100 transition-colors"
        >
          <LogOut size={20} /> Sair da conta
        </button>

      </div>
    </div>
  );
}
