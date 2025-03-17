import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";

const SignupPage = () => {
  const { user, loading } = useAuth();

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
            Create an account to start your interview practice journey
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
