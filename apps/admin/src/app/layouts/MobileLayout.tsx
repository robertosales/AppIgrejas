import { Outlet, NavLink, useLocation } from "react-router";
import { Home, Calendar, MessageCircle, Heart, User } from "lucide-react";

export function MobileLayout() {
  const location = useLocation();
  const hideBottomNav = ['/app/chat', '/app/agenda/'].some(path => location.pathname.includes(path));

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center font-sans text-slate-800">
      <div className="w-full h-full sm:w-[400px] sm:h-[850px] sm:rounded-[40px] sm:shadow-2xl sm:overflow-hidden relative bg-gray-50 flex flex-col border-[12px] border-slate-900">
        <div className="flex flex-col h-full w-full bg-slate-50 relative overflow-hidden">
          <div className={`flex-1 overflow-y-auto no-scrollbar pb-24 ${hideBottomNav ? 'pb-0' : ''}`}>
            <Outlet />
          </div>

          {!hideBottomNav && (
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-100 px-6 py-3 pb-8 sm:pb-3 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-50">
              <div className="flex justify-between items-center">
                <NavItem to="/app" icon={<Home size={22} />} label="Início" />
                <NavItem to="/app/agenda" icon={<Calendar size={22} />} label="Agenda" />
                <NavItem to="/app/prayer" icon={<Heart size={22} />} label="Oração" />
                <NavItem to="/app/care-warning" icon={<MessageCircle size={22} />} label="Atendimento" />
                <NavItem to="/app/profile" icon={<User size={22} />} label="Perfil" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink 
      to={to} 
      end={to === "/app"}
      className={({ isActive }) => 
        `flex flex-col items-center justify-center space-y-1 p-2 w-14 transition-colors ${
          isActive ? "text-amber-600" : "text-slate-400 hover:text-slate-600"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`${isActive ? "scale-110" : "scale-100"} transition-transform duration-200`}>
            {icon}
          </div>
          <span className="text-[10px] font-medium tracking-wide">{label}</span>
        </>
      )}
    </NavLink>
  );
}
