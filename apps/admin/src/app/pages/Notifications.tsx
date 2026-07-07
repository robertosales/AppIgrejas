import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Bell, Calendar, Heart } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth-context";

type Notification = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

const icons: Record<string, typeof Bell> = {
  calendar: Calendar,
  prayer: Heart,
};

export function Notifications() {
  const navigate = useNavigate();
  const { churchUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!churchUser) return;

    supabase
      .from("notifications")
      .select("id, title, body, created_at, read_at")
      .eq("church_id", churchUser.church_id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setNotifications(data);
        setLoading(false);
      });
  }, [churchUser]);

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-serif text-slate-900">Notificações</h1>
        </div>
      </header>

      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={40} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Nenhuma notificação</p>
            <p className="text-slate-400 text-sm mt-1">Você receberá notificações sobre eventos e atualizações.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white p-4 rounded-2xl border ${
                n.read_at ? "border-slate-100" : "border-amber-200 bg-amber-50/30"
              } shadow-sm flex gap-3 items-start`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                n.read_at ? "bg-slate-50 text-slate-400" : "bg-amber-50 text-amber-600"
              }`}>
                <Bell size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm ${n.read_at ? "text-slate-700" : "text-slate-900 font-semibold"}`}>{n.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {new Date(n.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              {!n.read_at && <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0 mt-2" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
