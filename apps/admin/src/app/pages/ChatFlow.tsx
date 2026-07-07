import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Send, Bot, User, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth-context";

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  triageLevel?: 'green' | 'yellow' | 'red';
};

export function ChatFlow() {
  const navigate = useNavigate();
  const { profile, churchUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Olá! Sou a assistente de acolhimento. Como posso ajudar você hoje?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [caseCreated, setCaseCreated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getTriageLevel = (text: string): { level: 'green' | 'yellow' | 'red'; response: string } => {
    const lower = text.toLowerCase();
    if (lower.includes('desespero') || lower.includes('suicídio') || lower.includes('urgente') || lower.includes('socorro') || lower.includes('morrer')) {
      return {
        level: 'red',
        response: 'Por favor, saiba que você não está sozinho(a). Estou notificando nossa equipe pastoral de plantão agora mesmo para que entrem em contato com urgência. Se for uma emergência médica ou risco de vida, ligue 188 (CVV) ou 192.'
      };
    }
    if (lower.includes('triste') || lower.includes('oração') || lower.includes('conselho') || lower.includes('dificuldade') || lower.includes('ansiedade') || lower.includes('depressão')) {
      return {
        level: 'yellow',
        response: 'Sinto muito que esteja passando por isso. Gostaria de conversar com um de nossos conselheiros pastorais? Posso encaminhar seu contato.'
      };
    }
    if (lower.includes('horário') || lower.includes('culto') || lower.includes('endereço') || lower.includes('informação')) {
      return {
        level: 'green',
        response: 'Nossos cultos acontecem aos Domingos às 10h e 18h. Precisa de mais alguma informação geral?'
      };
    }
    return {
      level: 'green',
      response: 'Compreendo. Você gostaria de falar com nossa equipe pastoral sobre isso?'
    };
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !profile || !churchUser) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), text: userMsg, sender: 'user' }]);
    setInput('');

    const { level, response } = getTriageLevel(userMsg);

    setTimeout(async () => {
      const botMsgId = Date.now().toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        text: response,
        sender: 'bot',
        triageLevel: level
      }]);

      if (!caseCreated) {
        setCaseCreated(true);

        const { data: careCase } = await supabase.from('care_cases').insert({
          church_id: churchUser.church_id,
          user_id: profile.id,
          status: 'open',
          priority: level,
          subject: `Triagem: ${userMsg.slice(0, 80)}`,
          description: userMsg,
        }).select().single();

        if (careCase) {
          await supabase.from('triage_assessments').insert({
            care_case_id: careCase.id,
            classification: level,
            summary: response,
            risk_indicators: [],
            ai_confidence: 0.85,
          });

          const priority_hint = level === 'red' ? ' (Prioridade Alta)' : level === 'yellow' ? ' (Atenção Pastoral)' : '';
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            text: `Seu caso foi registrado${priority_hint}. Nossa equipe pastoral entrará em contato em breve.`,
            sender: 'bot',
          }]);
        }
      }
    }, 1000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative z-50">
      <header className="px-6 py-4 flex items-center bg-white border-b border-slate-100 shadow-sm shrink-0">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full mr-3 hover:bg-slate-50">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-base font-medium text-slate-900">Acolhimento Vida</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        <div className="text-center text-xs text-slate-400 my-4 font-medium uppercase tracking-wider">Hoje</div>

        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 shrink-0 self-end mb-1">
                <Bot size={16} className="text-blue-600" />
              </div>
            )}

            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.sender === 'user'
                ? 'bg-slate-900 text-white rounded-br-sm'
                : 'bg-white border border-slate-100 shadow-sm text-slate-800 rounded-bl-sm'
            }`}>
              <p className="text-[15px] leading-relaxed">{msg.text}</p>

              {msg.triageLevel && (
                <div className={`mt-3 pt-3 border-t text-xs flex items-center gap-1.5 font-medium ${
                  msg.triageLevel === 'green' ? 'border-emerald-100 text-emerald-600' :
                  msg.triageLevel === 'yellow' ? 'border-amber-100 text-amber-600' :
                  'border-red-100 text-red-600'
                }`}>
                  <AlertCircle size={14} />
                  {msg.triageLevel === 'green' && 'Dúvida Simples (Nível 1)'}
                  {msg.triageLevel === 'yellow' && 'Atenção Pastoral (Nível 2)'}
                  {msg.triageLevel === 'red' && 'Prioridade Alta (Nível 3)'}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center ml-2 shrink-0 self-end mb-1">
                <User size={16} className="text-slate-600" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3.5 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-12 h-12 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shrink-0"
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
