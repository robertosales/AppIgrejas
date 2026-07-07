import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BarChart3, Activity, Clock, Users, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../lib/auth-context";

type CaseCounts = {
  open: number;
  in_progress: number;
  resolved: number;
  red: number;
  yellow: number;
  green: number;
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { churchUser } = useAuth();
  const [counts, setCounts] = useState<CaseCounts | null>(null);

  useEffect(() => {
    if (!churchUser) return;

    async function fetchCounts() {
      const churchId = churchUser.church_id;

      const { count: open } = await supabase
        .from("care_cases").select("*", { count: "exact", head: true })
        .eq("church_id", churchId).eq("status", "open");

      const { count: inProgress } = await supabase
        .from("care_cases").select("*", { count: "exact", head: true })
        .eq("church_id", churchId).eq("status", "in_progress");

      const { count: resolved } = await supabase
        .from("care_cases").select("*", { count: "exact", head: true })
        .eq("church_id", churchId).eq("status", "resolved");

      const { count: red } = await supabase
        .from("care_cases").select("*", { count: "exact", head: true })
        .eq("church_id", churchId).eq("priority", "red");

      const { count: yellow } = await supabase
        .from("care_cases").select("*", { count: "exact", head: true })
        .eq("church_id", churchId).eq("priority", "yellow");

      const { count: green } = await supabase
        .from("care_cases").select("*", { count: "exact", head: true })
        .eq("church_id", churchId).eq("priority", "green");

      setCounts({
        open: open ?? 0,
        in_progress: inProgress ?? 0,
        resolved: resolved ?? 0,
        red: red ?? 0,
        yellow: yellow ?? 0,
        green: green ?? 0,
      });
    }

    fetchCounts();
  }, [churchUser]);

  const openCases = counts ? counts.open + counts.in_progress : 0;

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative">
      <header className="px-6 pt-12 pb-6 bg-slate-900 text-white rounded-b-[32px] shadow-sm relative z-10">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-serif">Área Pastoral</h1>
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
            {churchUser?.church_name?.charAt(0) ?? "?"}
          </div>
        </div>
        <p className="text-slate-400 text-sm">{churchUser?.church_name ?? "Resumo de Atendimentos"}</p>
      </header>

      <div className="p-5 space-y-5 -mt-4 relative z-20">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 shadow-sm">
          <ShieldAlert className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-medium text-slate-900">Triagem por IA</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              A inteligência artificial apenas classifica e organiza os pedidos. O contato e aconselhamento continuam sendo realizados inteiramente pela nossa equipe pastoral humana.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center col-span-2"
          >
            <Activity className="text-amber-500 mb-2" size={28} />
            <span className="text-4xl font-serif text-slate-900">{openCases}</span>
            <span className="text-sm font-medium text-slate-500">Casos em Aberto</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-50 p-4 rounded-2xl flex flex-col items-center border border-red-100">
            <span className="text-2xl font-bold text-red-600 mb-1">{counts?.red ?? 0}</span>
            <span className="text-[10px] font-bold text-red-800 uppercase text-center tracking-wider">Urgência</span>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl flex flex-col items-center border border-amber-100">
            <span className="text-2xl font-bold text-amber-600 mb-1">{counts?.yellow ?? 0}</span>
            <span className="text-[10px] font-bold text-amber-800 uppercase text-center tracking-wider">Atenção</span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl flex flex-col items-center border border-emerald-100">
            <span className="text-2xl font-bold text-emerald-600 mb-1">{counts?.green ?? 0}</span>
            <span className="text-[10px] font-bold text-emerald-800 uppercase text-center tracking-wider">Dúvidas</span>
          </div>
        </div>

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
