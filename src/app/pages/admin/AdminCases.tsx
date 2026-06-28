import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Filter, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export type Case = {
  id: string;
  name: string;
  date: string;
  level: 'red' | 'yellow' | 'green';
  status: 'open' | 'in_progress' | 'resolved';
  campus: string;
  responsible: string | null;
  snippet: string;
};

export const mockCases: Case[] = [
  { id: '1', name: 'Maria F.', date: 'Hoje, 10:42', level: 'red', status: 'open', campus: 'Sede', responsible: null, snippet: 'Usuária relatou crise de ansiedade severa e menções a...' },
  { id: '2', name: 'Pedro S.', date: 'Hoje, 09:15', level: 'yellow', status: 'in_progress', campus: 'Sul', responsible: 'Pr. Carlos', snippet: 'Pedido de aconselhamento sobre conflitos familiares...' },
  { id: '3', name: 'Ana T.', date: 'Ontem, 18:30', level: 'green', status: 'resolved', campus: 'Sede', responsible: 'Pra. Lúcia', snippet: 'Dúvida sobre horário do grupo de jovens, já respondido...' },
  { id: '4', name: 'João R.', date: 'Ontem, 14:20', level: 'red', status: 'in_progress', campus: 'Leste', responsible: 'Pr. Marcos', snippet: 'Urgente: internado no hospital após acidente...' },
];

export function AdminCases() {
  const navigate = useNavigate();
  const [filterLevel, setFilterLevel] = useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const [filterCampus, setFilterCampus] = useState<'all' | 'Sede' | 'Sul' | 'Leste'>('all');

  const filteredCases = mockCases.filter(c => {
    if (filterLevel !== 'all' && c.level !== filterLevel) return false;
    if (filterCampus !== 'all' && c.campus !== filterCampus) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <header className="px-6 pt-12 pb-4 bg-white border-b border-slate-100 flex flex-col sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin")} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-serif text-slate-900">Lista de Casos</h1>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <Filter size={20} />
          </button>
        </div>

        {/* Priority Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <FilterPill active={filterLevel === 'all'} onClick={() => setFilterLevel('all')} label="Todos" />
          <FilterPill active={filterLevel === 'red'} onClick={() => setFilterLevel('red')} label="Urgente" color="red" />
          <FilterPill active={filterLevel === 'yellow'} onClick={() => setFilterLevel('yellow')} label="Atenção" color="yellow" />
          <FilterPill active={filterLevel === 'green'} onClick={() => setFilterLevel('green')} label="Dúvidas" color="green" />
        </div>

        {/* Campus Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-1">
          <FilterPill small active={filterCampus === 'all'} onClick={() => setFilterCampus('all')} label="Qualquer Campus" />
          <FilterPill small active={filterCampus === 'Sede'} onClick={() => setFilterCampus('Sede')} label="Sede" />
          <FilterPill small active={filterCampus === 'Sul'} onClick={() => setFilterCampus('Sul')} label="Sul" />
          <FilterPill small active={filterCampus === 'Leste'} onClick={() => setFilterCampus('Leste')} label="Leste" />
        </div>
      </header>

      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {filteredCases.map((c, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={c.id} 
            onClick={() => navigate(`/admin/cases/${c.id}`)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <StatusIcon level={c.level} />
                <h3 className="font-medium text-slate-900">{c.name}</h3>
                <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-medium ml-1">
                  {c.campus}
                </span>
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> {c.date}</span>
            </div>
            
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">"{c.snippet}"</p>
            
            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
              <div className="text-xs font-medium text-slate-500">
                Resp: <span className={c.responsible ? "text-slate-800 font-semibold" : "text-amber-600 font-semibold"}>{c.responsible || 'Não atribuído'}</span>
              </div>
              <div className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-sm ${
                c.status === 'open' ? 'bg-red-50 text-red-600' :
                c.status === 'in_progress' ? 'bg-amber-50 text-amber-600' :
                'bg-emerald-50 text-emerald-600'
              }`}>
                {c.status === 'open' ? 'Aberto' : c.status === 'in_progress' ? 'Em andamento' : 'Resolvido'}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">Nenhum caso encontrado para estes filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, label, color, small }: any) {
  const baseColors = {
    red: active ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-600 border-red-200',
    yellow: active ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-600 border-amber-200',
    green: active ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-emerald-600 border-emerald-200',
    default: active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
  };
  
  const colorClass = color ? baseColors[color as keyof typeof baseColors] : baseColors.default;
  const sizeClass = small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  return (
    <button onClick={onClick} className={`${sizeClass} rounded-full font-medium whitespace-nowrap border transition-colors ${colorClass}`}>
      {label}
    </button>
  );
}

export function StatusIcon({ level }: { level: string }) {
  if (level === 'red') return <AlertCircle size={16} className="text-red-500" />;
  if (level === 'yellow') return <AlertCircle size={16} className="text-amber-500" />;
  return <CheckCircle size={16} className="text-emerald-500" />;
}
