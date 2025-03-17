import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  BarChart,
  History,
  Settings,
  CheckCircle2,
  Calendar as CalendarIcon,
} from "lucide-react";
import ApiKeyDialog from "./ApiKeyDialog";
import LanguageSelector from "./LanguageSelector";
import NavBar from "./NavBar";
import LearningPlanPanel from "./LearningPlanPanel";
import LiveInterviewPanel from "./LiveInterviewPanel";
import HistoryPanel from "./HistoryPanel";
import CalendarPanel from "./CalendarPanel";

interface InterviewDashboardProps {
  onSelectRole?: (role: string) => void;
  onConfigureInterview?: () => void;
}

const InterviewDashboard = ({
  onSelectRole = () => {},
  onConfigureInterview = () => {},
}: InterviewDashboardProps) => {
  const [activeTab, setActiveTab] = useState("new");
  const [customRole, setCustomRole] = useState("");
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [interfaceLanguage, setInterfaceLanguage] = useState("en");

  // Check if API key exists on component mount
  useEffect(() => {
    const apiKey =
      localStorage.getItem("deepseekApiKey") ||
      import.meta.env.VITE_DEEPSEEK_API_KEY;
    setHasApiKey(!!apiKey);
    if (!apiKey) {
      setApiKeyDialogOpen(true);
    }
  });

  const handleRoleSelect = (role: string) => {
    onSelectRole(role);
    onConfigureInterview();
  };

  const handleCustomRoleSubmit = () => {
    if (customRole.trim()) {
      onSelectRole(customRole.trim());
      onConfigureInterview();
    }
  };

  const handleApiKeySave = (apiKey: string) => {
    setHasApiKey(!!apiKey);
  };

  return (
    <div className="bg-background min-h-screen">
      <NavBar onSettingsClick={() => setApiKeyDialogOpen(true)} />
      <div className="container mx-auto py-8 px-4">
        <Tabs
          defaultValue="new"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="new" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Interview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Learning Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Start a New Practice Interview</CardTitle>
                    <CardDescription>
                      Configure your interview settings and begin practicing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            title: "Software Engineering",
                            description:
                              "Technical and behavioral questions for software roles",
                          },
                          {
                            title: "Product Management",
                            description:
                              "Strategy, execution, and leadership questions",
                          },
                          {
                            title: "Data Science",
                            description:
                              "Analytics, statistics, and technical questions",
                          },
                          {
                            title: "Marketing",
                            description:
                              "Brand strategy, campaigns, and growth questions",
                          },
                          {
                            title: "UX/UI Design",
                            description:
                              "User experience, design thinking, and portfolio review",
                          },
                          {
                            title: "DevOps Engineering",
                            description:
                              "CI/CD, infrastructure, and automation questions",
                          },
                          {
                            title: "Project Management",
                            description:
                              "Methodology, risk management, and team leadership",
                          },
                          {
                            title: "Sales",
                            description:
                              "Negotiation, client relationships, and closing techniques",
                          },
                          {
                            title: "Customer Success",
                            description:
                              "Client satisfaction, retention, and relationship building",
                          },
                          {
                            title: "Finance",
                            description:
                              "Financial analysis, forecasting, and reporting",
                          },
                        ].map((role, index) => (
                          <Card
                            key={index}
                            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleRoleSelect(role.title)}
                          >
                            <h3 className="font-semibold mb-2">{role.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {role.description}
                            </p>
                          </Card>
                        ))}
                      </div>

                      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Enter a custom role (e.g., UX Designer)"
                            value={customRole}
                            onChange={(e) => setCustomRole(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleCustomRoleSubmit()
                            }
                          />
                        </div>
                        <Button
                          onClick={handleCustomRoleSubmit}
                          disabled={!customRole.trim()}
                        >
                          Start Custom Interview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="md:col-span-1">
                <LiveInterviewPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Track your progress and improvement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">
                    Analytics dashboard will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <HistoryPanel />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <CalendarPanel />
          </TabsContent>

          <TabsContent value="learning" className="space-y-4">
            <LearningPlanPanel />
          </TabsContent>
        </Tabs>

        <ApiKeyDialog
          open={apiKeyDialogOpen}
          onOpenChange={setApiKeyDialogOpen}
          onSave={handleApiKeySave}
        />
      </div>
    </div>
  );
};

export default InterviewDashboard;
