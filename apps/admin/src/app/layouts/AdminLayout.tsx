import { Outlet, useNavigate, useLocation } from "react-router";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from "../components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Building,
  Users2,
  Calendar,
  Heart,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/members", icon: Users, label: "Membros" },
  { to: "/admin/finance", icon: DollarSign, label: "Financeiro" },
  { to: "/admin/assets", icon: Building, label: "Patrimônio" },
  { to: "/admin/groups", icon: Users2, label: "Grupos" },
  { to: "/admin/events", icon: Calendar, label: "Agenda" },
  { to: "/admin/care", icon: Heart, label: "Atendimento" },
  { to: "/admin/content", icon: FileText, label: "Conteúdo" },
  { to: "/admin/settings", icon: Settings, label: "Configurações" },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, churchUser, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white text-sm font-bold shrink-0">
              {churchUser?.church_name?.charAt(0) ?? "I"}
            </div>
            <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden min-w-0">
              <span className="text-sm font-semibold truncate">
                {churchUser?.church_name ?? "Igreja"}
              </span>
              <span className="text-xs text-muted-foreground">Painel Administrativo</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)}
                      tooltip={item.label}
                    >
                      <a href={item.to} onClick={(e) => { e.preventDefault(); navigate(item.to); }}>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Sair"
              >
                <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground">
                  <LogOut />
                  <span>Sair</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background sticky top-0 z-10 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none rounded-md hover:bg-accent px-2 py-1.5 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-amber-100 text-amber-800 text-xs font-medium">
                  {profile?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-sm leading-tight">
                <span className="font-medium text-foreground">{profile?.full_name ?? "Usuário"}</span>
                <span className="text-xs text-muted-foreground capitalize">{churchUser?.role?.replace("_", " ") ?? "membro"}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-slate-50/50">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
