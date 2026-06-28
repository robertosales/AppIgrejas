import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Send, Bot, User, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  triageLevel?: 'green' | 'yellow' | 'red';
};

export function ChatFlow() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Olá! Sou a assistente de acolhimento da Comunidade Vida. Como posso ajudar você hoje?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock flow logic
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), text: userMsg, sender: 'user' }]);
    setInput('');

    // Triage Logic Mock based on keywords
    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      if (lower.includes('horário') || lower.includes('culto') || lower.includes('endereço')) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          text: 'Nossos cultos acontecem aos Domingos às 10h e 18h. Precisa de mais alguma informação geral?', 
          sender: 'bot', 
          triageLevel: 'green' 
        }]);
      } else if (lower.includes('triste') || lower.includes('oração') || lower.includes('conselho') || lower.includes('dificuldade')) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          text: 'Sinto muito que esteja passando por isso. Gostaria de conversar com um de nossos conselheiros pastorais? Posso encaminhar seu contato.', 
          sender: 'bot', 
          triageLevel: 'yellow' 
        }]);
      } else if (lower.includes('desespero') || lower.includes('suicídio') || lower.includes('urgente') || lower.includes('socorro')) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          text: 'Por favor, saiba que você não está sozinho(a). Estou notificando nossa equipe pastoral de plantão agora mesmo para que entrem em contato com urgência. Se for uma emergência médica ou risco de vida, ligue 188 (CVV) ou 192.', 
          sender: 'bot', 
          triageLevel: 'red' 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          text: 'Compreendo. Você gostaria de falar com nossa equipe pastoral sobre isso?', 
          sender: 'bot', 
          triageLevel: 'green' 
        }]);
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
              
              {/* Triage indicator */}
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
