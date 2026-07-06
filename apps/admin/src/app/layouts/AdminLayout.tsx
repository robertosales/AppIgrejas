import { Outlet, NavLink } from "react-router";
import { LayoutDashboard, Users, Smartphone } from "lucide-react";

export function AdminLayout() {
  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative overflow-hidden">
      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <Outlet />
      </div>

      {/* Admin Bottom Navigation */}
      <div className="absolute bottom-0 left-0 w-full bg-slate-900 text-slate-400 border-t border-slate-800 px-6 py-3 pb-8 sm:pb-3 shadow-2xl z-50">
        <div className="flex justify-around items-center">
          <NavItem to="/admin" icon={<LayoutDashboard size={22} />} label="Dashboard" end />
          <NavItem to="/admin/cases" icon={<Users size={22} />} label="Casos" />
          <NavItem to="/welcome" icon={<Smartphone size={22} />} label="Sair (App)" />
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, end }: { to: string; icon: React.ReactNode; label: string; end?: boolean }) {
  return (
    <NavLink 
      to={to} 
      end={end}
      className={({ isActive }) => 
        `flex flex-col items-center justify-center space-y-1 p-2 w-20 transition-colors ${
          isActive ? "text-amber-500" : "hover:text-slate-200"
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
