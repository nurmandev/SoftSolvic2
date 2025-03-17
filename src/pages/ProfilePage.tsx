import UserProfile from "@/components/profile/UserProfile";
import NavBar from "@/components/interview/NavBar";
import { useAuth } from "@/components/auth/AuthProvider";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-background min-h-screen">
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <UserProfile userId={user?.id} />
      </div>
    </div>
  );
};

export default ProfilePage;
