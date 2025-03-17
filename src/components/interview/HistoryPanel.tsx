import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText, ArrowRight } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface InterviewHistoryItem {
  id: string;
  role: string;
  completed_at: string;
  overall_score: number;
  question_count: number;
}

const HistoryPanel = () => {
  const [historyItems, setHistoryItems] = useState<InterviewHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recent");
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviewHistory();
  }, []);

  const fetchInterviewHistory = async () => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        // Mock data for demo purposes
        const mockHistory = generateMockHistory();
        setHistoryItems(mockHistory);
        setIsLoading(false);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setIsLoading(false);
        return;
      }

      // Fetch interview results from Supabase
      const { data, error } = await supabase
        .from("interview_results")
        .select(
          "id, completed_at, overall_score, questions, session_id, interview_sessions(role, question_count)",
        )
        .eq("user_id", userData.user.id)
        .order("completed_at", { ascending: false });

      if (error) {
        console.error("Error fetching interview history:", error);
        setHistoryItems(generateMockHistory());
      } else if (data) {
        const formattedData = data.map((item) => ({
          id: item.id,
          role: item.interview_sessions?.role || "Unknown Role",
          completed_at: item.completed_at,
          overall_score: item.overall_score || 0,
          question_count:
            item.interview_sessions?.question_count ||
            item.questions?.length ||
            0,
        }));
        setHistoryItems(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch interview history:", error);
      setHistoryItems(generateMockHistory());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockHistory = (): InterviewHistoryItem[] => {
    return [
      {
        id: "1",
        role: "Software Engineer",
        completed_at: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        overall_score: 78,
        question_count: 5,
      },
      {
        id: "2",
        role: "Product Manager",
        completed_at: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        overall_score: 82,
        question_count: 6,
      },
      {
        id: "3",
        role: "UX Designer",
        completed_at: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        overall_score: 75,
        question_count: 4,
      },
    ];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const viewInterviewDetails = (id: string) => {
    // In a real implementation, this would navigate to a detailed view
    console.log(`Viewing interview ${id}`);
    navigate(`/results?id=${id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interview History</CardTitle>
        <CardDescription>
          Review your past interview sessions and track your progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="recent"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
            <TabsTrigger value="stats">Performance Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : historyItems.length > 0 ? (
              <div className="space-y-3">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{item.role} Interview</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(item.completed_at)}</span>
                          <span className="mx-1">•</span>
                          <FileText className="h-3.5 w-3.5" />
                          <span>{item.question_count} questions</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={getScoreColor(item.overall_score)}
                      >
                        {item.overall_score}%
                      </Badge>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => viewInterviewDetails(item.id)}
                      >
                        View Details
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't completed any interviews yet
                </p>
                <Button variant="outline" onClick={() => navigate("/setup")}>
                  Start Your First Interview
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            {historyItems.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-3xl font-bold">{historyItems.length}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Interviews
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-3xl font-bold">
                      {Math.round(
                        historyItems.reduce(
                          (sum, item) => sum + item.overall_score,
                          0,
                        ) / historyItems.length,
                      )}
                      %
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Average Score
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Recent Progress</h3>
                  <div className="h-40 border rounded-md p-4 flex items-end justify-between">
                    {historyItems
                      .slice(0, 5)
                      .reverse()
                      .map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className="w-8 bg-primary rounded-t"
                            style={{
                              height: `${(item.overall_score / 100) * 120}px`,
                            }}
                          ></div>
                          <p className="text-xs mt-2">
                            {formatDate(item.completed_at).split(",")[0]}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Top Roles</h3>
                  <div className="space-y-2">
                    {Array.from(new Set(historyItems.map((item) => item.role)))
                      .slice(0, 3)
                      .map((role, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg flex justify-between items-center"
                        >
                          <span>{role}</span>
                          <Badge variant="outline">
                            {
                              historyItems.filter((item) => item.role === role)
                                .length
                            }{" "}
                            sessions
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Complete interviews to see your performance stats
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HistoryPanel;
