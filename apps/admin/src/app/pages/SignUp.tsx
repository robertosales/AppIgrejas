import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../lib/auth-context";

export function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signUp(email, password, name);
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex flex-col h-full bg-white relative">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-serif text-slate-900 mb-2">Conta Criada!</h2>
          <p className="text-slate-600 mb-8 max-w-xs">
            Verifique seu email <strong>{email}</strong> para confirmar o cadastro.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full max-w-xs bg-slate-900 text-white font-medium py-4 rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex items-center p-6 pt-12">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="flex-1 px-6 flex flex-col">
        <div className="mb-10 mt-4">
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Criar Conta</h1>
          <p className="text-slate-500 font-light">Cadastre-se na sua igreja.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4 flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Nome completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={20} className="text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
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
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-medium py-4 rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>
          </div>
        </form>

        <div className="pb-12 text-center">
          <p className="text-slate-500 text-sm">
            Já tem conta?{" "}
            <button onClick={() => navigate("/login")} className="text-amber-600 font-medium ml-1 hover:underline">
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
