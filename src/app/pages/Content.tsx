import { useNavigate } from "react-router";
import { ChevronLeft, PlayCircle, BookOpen, Headphones } from "lucide-react";

const videos = [
  { id: 1, title: "O Caminho da Graça", author: "Pr. Marcos", duration: "45 min" },
  { id: 2, title: "Superando os Medos", author: "Pr. Carlos", duration: "52 min" }
];

export function Content() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <header className="px-6 pt-12 pb-4 bg-white border-b border-slate-100 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full mr-4 hover:bg-slate-50">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-slate-900">Mensagens</h1>
      </header>

      <div className="p-4 space-y-6 pb-24">
        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          <button className="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap bg-slate-900 text-white flex items-center gap-2">
            <PlayCircle size={16} /> Vídeos
          </button>
          <button className="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap bg-white text-slate-600 border border-slate-200 flex items-center gap-2">
            <Headphones size={16} /> Podcasts
          </button>
          <button className="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap bg-white text-slate-600 border border-slate-200 flex items-center gap-2">
            <BookOpen size={16} /> Devocionais
          </button>
        </div>

        {/* Featured */}
        <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-lg p-5">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
          <div className="relative z-10 flex flex-col items-center text-center py-6">
            <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 text-white hover:bg-white/30 transition-colors">
              <PlayCircle size={32} />
            </button>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wide mb-2">Última Mensagem</span>
            <h2 className="text-xl font-serif text-white mb-1">A Esperança Não Decepciona</h2>
            <p className="text-slate-300 text-sm">Pra. Lúcia Santos</p>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-slate-900 mb-2">Mais Recentes</h3>
          {videos.map(v => (
            <div key={v.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center">
              <div className="w-24 h-16 bg-slate-200 rounded-xl overflow-hidden relative">
                <img src={`https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=400&auto=format&fit=crop&sig=${v.id}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                  <PlayCircle size={20} className="text-white opacity-80" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800 text-sm">{v.title}</h4>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-slate-500">{v.author}</p>
                  <span className="text-[10px] text-slate-400 font-medium">{v.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
