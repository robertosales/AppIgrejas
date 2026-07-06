import { useNavigate } from "react-router";
import { ChevronLeft, Users, Music, HeartHandshake, Baby } from "lucide-react";

export function Groups() {
  const navigate = useNavigate();

  const ministries = [
    { id: 1, name: "Jovens e Adolescentes", desc: "Encontros focados nas novas gerações.", icon: <Users size={24} /> },
    { id: 2, name: "Louvor e Adoração", desc: "Equipe de música, coral e artes.", icon: <Music size={24} /> },
    { id: 3, name: "Ação Social", desc: "Trabalhos voluntários e ajuda comunitária.", icon: <HeartHandshake size={24} /> },
    { id: 4, name: "Ministério Infantil", desc: "Ensino bíblico lúdico para as crianças.", icon: <Baby size={24} /> },
  ];

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <header className="px-6 pt-12 pb-4 bg-white border-b border-slate-100 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full mr-4 hover:bg-slate-50">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-slate-900">Ministérios</h1>
      </header>

      <div className="p-4 space-y-4 pb-24">
        <p className="text-slate-600 px-2 text-sm leading-relaxed mb-2">
          Encontre seu lugar na casa de Deus. Conecte-se com pessoas, sirva com seus talentos e cresça em comunidade.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {ministries.map(m => (
            <div key={m.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-transform cursor-pointer">
              <div className="w-14 h-14 bg-slate-50 text-amber-500 rounded-full flex items-center justify-center shrink-0 border border-slate-100">
                {m.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 mb-1">{m.name}</h3>
                <p className="text-sm text-slate-500 leading-snug">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
