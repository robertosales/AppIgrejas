import { useNavigate, useParams } from "react-router";
import { ChevronLeft, Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { motion } from "motion/react";

export function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="absolute top-0 w-full h-64 bg-slate-200 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800&auto=format&fit=crop" 
          alt="Event" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/40"></div>
      </div>

      <header className="px-6 pt-12 pb-4 flex justify-between items-center relative z-10 text-white">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full active:scale-95 transition-transform">
          <Share2 size={20} />
        </button>
      </header>

      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 bg-white flex-1 rounded-t-[32px] mt-16 px-6 py-8 flex flex-col"
      >
        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wide w-fit">
          Especial
        </div>
        
        <h1 className="text-2xl font-serif text-slate-900 mb-6">Encontro de Jovens: Propósito</h1>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-slate-800 font-medium">Sábado, 21 de Setembro</p>
              <p className="text-slate-500 text-sm">Adicionar ao calendário</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-slate-800 font-medium">19:30 às 21:30</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-slate-800 font-medium">Espaço Jovem</p>
              <p className="text-slate-500 text-sm">Templo Sede</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-medium text-slate-900 mb-2">Sobre o evento</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Um tempo especial de louvor, palavra e comunhão para a juventude. Venha descobrir mais sobre o propósito de Deus para a sua vida e construir amizades verdadeiras. Teremos um coffee break após o encontro.
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <button className="w-full bg-slate-900 text-white font-medium py-4 rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all">
            Fazer Inscrição Gratuita
          </button>
        </div>
      </motion.div>
    </div>
  );
}
