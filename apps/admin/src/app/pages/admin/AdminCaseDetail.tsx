import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, UserCircle, MapPin, Send, AlertCircle, Calendar, MessageSquare, Briefcase, Forward } from "lucide-react";
import { StatusIcon, mockCases } from "./AdminCases";

export function AdminCaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock finding case
  const caseData = mockCases.find(c => c.id === id) || mockCases[0];

  const [status, setStatus] = useState(caseData.status);
  const [responsible, setResponsible] = useState(caseData.responsible);
  
  // Mock transcript
  const transcript = [
    { id: 1, sender: 'bot', text: 'Olá! Sou a assistente de acolhimento da Comunidade Vida. Como posso ajudar você hoje?' },
    { id: 2, sender: 'user', text: caseData.snippet + ' não sei com quem conversar.' },
    { id: 3, sender: 'bot', text: 'Entendo a sua situação. Por favor, aguarde que estou encaminhando seu contato para nossa equipe pastoral.' }
  ];

  const levelLabels = {
    red: { text: 'Urgência Alta (Risco/Crise)', bg: 'bg-red-50 text-red-700 border-red-200' },
    yellow: { text: 'Atenção Pastoral', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    green: { text: 'Dúvida Simples', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };

  const currentLevel = levelLabels[caseData.level];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-lg font-medium text-slate-900 leading-tight">Detalhes do Caso</h1>
            <p className="text-xs text-slate-500">ID: #{caseData.id.padStart(4, '0')}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Priority Banner */}
        <div className={`px-6 py-3 border-b flex items-center gap-2 ${currentLevel.bg}`}>
          <AlertCircle size={18} />
          <span className="text-sm font-semibold tracking-wide uppercase">{currentLevel.text}</span>
        </div>

        {/* User Info Card */}
        <div className="p-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-50">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <UserCircle size={32} />
              </div>
              <div>
                <h2 className="text-xl font-serif text-slate-900">{caseData.name}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={14}/> {caseData.campus}</span>
                  <span className="flex items-center gap-1"><Calendar size={14}/> {caseData.date.split(',')[0]}</span>
                </div>
              </div>
            </div>

            {/* Admin Actions / Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Responsável</label>
                <div className="bg-slate-50 px-3 py-2 rounded-lg text-sm text-slate-800 font-medium border border-slate-200 flex items-center justify-between">
                  {responsible || 'Nenhum'}
                  {!responsible && (
                    <button onClick={() => setResponsible('Você')} className="text-amber-600 text-xs font-bold hover:underline">
                      Assumir
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-50 px-3 py-2 rounded-lg text-sm text-slate-800 font-medium border border-slate-200 outline-none focus:border-amber-500"
                >
                  <option value="open">Aberto</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="resolved">Resolvido</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <MessageSquare size={16} /> Falar com Membro
              </button>
              <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-transform">
                <Forward size={16} /> Encaminhar
              </button>
            </div>
          </div>
        </div>

        {/* Transcript Section */}
        <div className="p-4 pt-0">
          <h3 className="font-serif text-lg text-slate-900 mb-3 px-1 flex items-center gap-2">
            <Briefcase size={18} className="text-slate-400" />
            Transcrição da Triagem (IA)
          </h3>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
            {transcript.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.sender === 'user' 
                    ? 'bg-slate-100 text-slate-800 rounded-tr-sm' 
                    : 'bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
