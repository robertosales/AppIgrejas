import { useNavigate } from "react-router";
import { ChevronLeft, Mail, Lock } from "lucide-react";

export function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app");
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center p-6 pt-12">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="flex-1 px-6 flex flex-col">
        <div className="mb-10 mt-4">
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Entrar</h1>
          <p className="text-slate-500 font-light">Acesse sua conta para continuar.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 flex-1">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">E-mail ou CPF</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-slate-400" />
              </div>
              <input 
                type="text" 
                defaultValue="admin@igreja.com"
                placeholder="Seu e-mail ou CPF" 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={20} className="text-slate-400" />
              </div>
              <input 
                type="password" 
                defaultValue="password123"
                placeholder="••••••••" 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
            <div className="text-right mt-2">
              <button type="button" className="text-sm text-amber-600 font-medium hover:text-amber-700">Esqueci minha senha</button>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white font-medium py-4 rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
            >
              Entrar
            </button>
          </div>
        </form>

        <div className="pb-12 text-center">
          <p className="text-slate-500 text-sm">
            Ainda não tem conta? <button className="text-amber-600 font-medium ml-1 hover:underline">Cadastre-se</button>
          </p>
        </div>
      </div>
    </div>
  );
}
