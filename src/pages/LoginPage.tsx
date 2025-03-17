import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

const LoginPage = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
  const messageType = location.state?.type || "info";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">AI Interview Coach</h1>
          <p className="text-muted-foreground mt-2">
            Log in to continue your interview practice
          </p>
        </div>

        {message && (
          <Alert
            className={`mb-4 ${messageType === "success" ? "bg-green-50 text-green-800 border-green-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}
          >
            {messageType === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
