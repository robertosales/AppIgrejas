import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Heart, User } from "lucide-react";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-white h-full relative">
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-slate-900 rounded-b-[40px] z-0"></div>
      
      <div className="relative z-10 flex flex-col h-full p-6">
        <div className="flex-1 flex flex-col justify-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white mb-12"
          >
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900">
                <path d="M12 2v20M17 7H7" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif mb-2">Bem-vindo à nossa casa</h1>
            <p className="text-slate-300 font-light">Como podemos ajudar você hoje?</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <button 
              onClick={() => navigate("/app")}
              className="w-full bg-white border border-slate-100 shadow-sm p-5 rounded-2xl flex items-center group active:scale-95 transition-all"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-colors">
                <Heart size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-slate-800 text-lg">Sou Visitante</h3>
                <p className="text-slate-500 text-sm">Quero conhecer a igreja</p>
              </div>
            </button>

            <button 
              onClick={() => navigate("/login")}
              className="w-full bg-white border border-slate-100 shadow-sm p-5 rounded-2xl flex items-center group active:scale-95 transition-all"
            >
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mr-4 group-hover:bg-amber-100 transition-colors">
                <User size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-slate-800 text-lg">Sou Membro</h3>
                <p className="text-slate-500 text-sm">Acessar minha conta</p>
              </div>
            </button>
          </motion.div>
        </div>

        <div className="text-center pb-8 pt-4 flex flex-col items-center">
          <p className="text-slate-400 text-sm mb-2">Acesso Restrito</p>
          <button onClick={() => navigate("/admin")} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">
            Painel Pastoral (Admin)
          </button>
        </div>
      </div>
    </div>
  );
}
