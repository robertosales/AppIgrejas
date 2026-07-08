import { Navigate } from "react-router";
import { useAuth } from "../../lib/auth-context";

export function RoleProtectedRoute({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const { churchUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!churchUser || !allowedRoles.includes(churchUser.role)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
