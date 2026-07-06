import { useNavigate } from "react-router";
import { AlertCircle, BarChart3, Activity, Clock, Users, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative">
      <header className="px-6 pt-12 pb-6 bg-slate-900 text-white rounded-b-[32px] shadow-sm relative z-10">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-serif">Área Pastoral</h1>
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
            PC
          </div>
        </div>
        <p className="text-slate-400 text-sm">Resumo de Atendimentos</p>
      </header>

      <div className="p-5 space-y-5 -mt-4 relative z-20">
        
        {/* IA Notice */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 shadow-sm">
          <ShieldAlert className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-medium text-slate-900">Triagem por IA</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              A inteligência artificial apenas classifica e organiza os pedidos. O contato e aconselhamento continuam sendo realizados inteiramente pela nossa equipe pastoral humana.
            </p>
          </div>
        </div>

        {/* Big Metric */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center col-span-2"
          >
            <Activity className="text-amber-500 mb-2" size={28} />
            <span className="text-4xl font-serif text-slate-900">12</span>
            <span className="text-sm font-medium text-slate-500">Casos em Aberto</span>
          </motion.div>
        </div>

        {/* Priority Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-50 p-4 rounded-2xl flex flex-col items-center border border-red-100">
            <span className="text-2xl font-bold text-red-600 mb-1">3</span>
            <span className="text-[10px] font-bold text-red-800 uppercase text-center tracking-wider">Urgência</span>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl flex flex-col items-center border border-amber-100">
            <span className="text-2xl font-bold text-amber-600 mb-1">5</span>
            <span className="text-[10px] font-bold text-amber-800 uppercase text-center tracking-wider">Atenção</span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl flex flex-col items-center border border-emerald-100">
            <span className="text-2xl font-bold text-emerald-600 mb-1">4</span>
            <span className="text-[10px] font-bold text-emerald-800 uppercase text-center tracking-wider">Dúvidas</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-2">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-serif text-slate-900 text-lg">Acesso Rápido</h3>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate("/admin/cases")}
              className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                  <Users size={20} />
                </div>
                <span className="font-medium text-slate-800">Ver Lista de Casos</span>
              </div>
              <Clock size={16} className="text-slate-400" />
            </button>
            
            <button className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                  <BarChart3 size={20} />
                </div>
                <span className="font-medium text-slate-800">Relatórios de Atendimento</span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
