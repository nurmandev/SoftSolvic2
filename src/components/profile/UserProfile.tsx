import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Mail, User, Bell, Moon, Sun, Save } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useTheme } from "@/components/theme/ThemeProvider";

interface UserProfileProps {
  userId?: string;
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  email_notifications: boolean;
  theme_preference: "light" | "dark" | "system";
  job_title?: string;
  bio?: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [editedData, setEditedData] = useState<Partial<UserData>>({});
  const [saveMessage, setSaveMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        // Mock data for demo
        const mockUser: UserData = {
          id: "mock-user-id",
          email: "user@example.com",
          full_name: "Demo User",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=profile",
          created_at: new Date().toISOString(),
          email_notifications: true,
          theme_preference: theme as "light" | "dark" | "system",
          job_title: "Software Engineer",
          bio: "Passionate about technology and improving interview skills.",
        };
        setUserData(mockUser);
        setEditedData(mockUser);
        setIsLoading(false);
        return;
      }

      // Get current user from Supabase
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        throw new Error("User not authenticated");
      }

      const currentUserId = userId || authData.user.id;

      // Get user profile from database
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", currentUserId)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        throw profileError;
      }

      const user: UserData = {
        id: currentUserId,
        email: authData.user.email || "",
        full_name: profileData.full_name || "",
        avatar_url: profileData.avatar_url,
        created_at: profileData.created_at,
        email_notifications: profileData.email_notifications !== false, // Default to true
        theme_preference: profileData.theme_preference || "system",
        job_title: profileData.job_title,
        bio: profileData.bio,
      };

      setUserData(user);
      setEditedData(user);

      // Set theme based on user preference
      if (user.theme_preference && user.theme_preference !== "system") {
        setTheme(user.theme_preference);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setEditedData({ ...editedData, [name]: checked });
  };

  const handleThemeChange = (value: string) => {
    const themeValue = value as "light" | "dark" | "system";
    setEditedData({ ...editedData, theme_preference: themeValue });
    setTheme(themeValue);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      if (!isSupabaseConfigured()) {
        // Mock save for demo
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUserData({ ...userData, ...editedData } as UserData);
        setSaveMessage({
          text: "Profile updated successfully",
          type: "success",
        });
        return;
      }

      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        throw new Error("User not authenticated");
      }

      const currentUserId = userId || authData.user.id;

      // Update user profile in database
      const { error } = await supabase
        .from("user_profiles")
        .update({
          full_name: editedData.full_name,
          avatar_url: editedData.avatar_url,
          email_notifications: editedData.email_notifications,
          theme_preference: editedData.theme_preference,
          job_title: editedData.job_title,
          bio: editedData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", currentUserId);

      if (error) {
        throw error;
      }

      // Refresh user data
      await fetchUserData();
      setSaveMessage({ text: "Profile updated successfully", type: "success" });
    } catch (error) {
      console.error("Failed to save profile:", error);
      setSaveMessage({ text: "Failed to update profile", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile Information
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage
                    src={
                      userData?.avatar_url ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=profile"
                    }
                  />
                  <AvatarFallback>
                    {userData?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full max-w-[200px]"
                >
                  Change Avatar
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 200x200px
                </p>
              </div>

              <div className="md:w-2/3 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={editedData.full_name || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="email"
                      name="email"
                      value={editedData.email || ""}
                      onChange={handleInputChange}
                      disabled
                    />
                    <Button variant="outline" size="icon" disabled>
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title</Label>
                  <Input
                    id="job_title"
                    name="job_title"
                    value={editedData.job_title || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={editedData.bio || ""}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div className="pt-4">
                  <p className="text-xs text-muted-foreground">
                    Member since{" "}
                    {new Date(userData?.created_at || "").toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Theme</h4>
                      <p className="text-sm text-muted-foreground">
                        Select your preferred theme
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={
                          editedData.theme_preference === "light"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleThemeChange("light")}
                        className="flex items-center gap-1"
                      >
                        <Sun className="h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={
                          editedData.theme_preference === "dark"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleThemeChange("dark")}
                        className="flex items-center gap-1"
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                      </Button>
                      <Button
                        variant={
                          editedData.theme_preference === "system"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleThemeChange("system")}
                      >
                        System
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your interviews and results
                      </p>
                    </div>
                    <Switch
                      checked={editedData.email_notifications || false}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("email_notifications", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {saveMessage && (
          <div
            className={`mt-4 p-3 rounded-md ${saveMessage.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          >
            {saveMessage.text}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
