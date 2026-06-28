import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-white p-6 h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900">
            <path d="M12 2v20M17 7H7" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif font-medium tracking-tight mb-2">Comunidade Vida</h1>
        <p className="text-slate-400 text-sm font-light tracking-wide uppercase">Amor & Cuidado</p>
      </motion.div>
    </div>
  );
}
