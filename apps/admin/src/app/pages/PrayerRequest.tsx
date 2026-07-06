import { useState } from "react";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function PrayerRequest() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate("/app");
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-full bg-white relative">
      <header className="px-6 pt-12 pb-4 flex items-center bg-white sticky top-0 z-10 border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full mr-4 hover:bg-slate-100">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-slate-900">Pedido de Oração</h1>
      </header>

      <div className="p-6 flex-1 flex flex-col">
        {!submitted ? (
          <>
            <div className="mb-8">
              <p className="text-slate-600 leading-relaxed">
                "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus." <br/>
                <span className="text-sm text-slate-400 font-medium">— Filipenses 4:6</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Seu nome (opcional)</label>
                <input 
                  type="text" 
                  placeholder="Como podemos te chamar?" 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-800"
                />
              </div>

              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-slate-700 ml-1">Seu pedido</label>
                <textarea 
                  required
                  placeholder="Escreva aqui o seu pedido de oração..." 
                  className="w-full px-4 py-4 h-48 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-800 resize-none"
                ></textarea>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium py-4 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  Enviar Pedido
                </button>
              </div>
            </form>
          </>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center pb-20"
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-serif text-slate-900 mb-2">Pedido Enviado!</h2>
            <p className="text-slate-600">Nossa equipe de intercessão estará orando por você.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
