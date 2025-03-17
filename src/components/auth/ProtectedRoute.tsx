import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { isSupabaseConfigured } from "@/lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If Supabase is not configured, check for mock user
  if (!isSupabaseConfigured()) {
    const mockUser = localStorage.getItem("mockUser");
    if (!mockUser) {
      return <Navigate to="/login" replace />;
    }
  } else if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
