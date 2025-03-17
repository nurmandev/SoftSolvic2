import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  BookOpen,
  Target,
  Award,
  BarChart,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const LearningPlanPanel = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("plan");
  const [userProgress, setUserProgress] = useState<any>(null);

  useEffect(() => {
    // Fetch user progress data from Supabase or use mock data
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async () => {
    try {
      const { isSupabaseConfigured } = await import("@/lib/supabase");
      if (!isSupabaseConfigured()) {
        // Use mock data for demo
        setUserProgress(learningPlan);
        return;
      }

      // In a real implementation, this would fetch from Supabase
      // For now, we'll use the mock data but simulate a real fetch
      setTimeout(() => {
        setUserProgress(learningPlan);
      }, 500);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      setUserProgress(learningPlan);
    }
  };

  // Generate dynamic learning plan based on user's interview history and scheduled interviews
  const generateLearningPlan = (
    historyData: any[],
    scheduledInterviews: any[],
  ) => {
    // Calculate days active - difference between first interview and now
    const sortedHistory = [...historyData].sort(
      (a, b) =>
        new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime(),
    );

    const firstInterviewDate =
      sortedHistory.length > 0
        ? new Date(sortedHistory[0].completed_at)
        : new Date();

    const daysActive = Math.max(
      1,
      Math.floor(
        (new Date().getTime() - firstInterviewDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );

    // Calculate progress based on interview scores and count
    const totalInterviews = historyData.length;
    const averageScore =
      totalInterviews > 0
        ? Math.round(
            historyData.reduce(
              (sum, item) => sum + (item.overall_score || 0),
              0,
            ) / totalInterviews,
          )
        : 0;

    // Calculate progress as a combination of interview count and average score
    const progress = Math.min(
      100,
      Math.round(totalInterviews * 5 + averageScore * 0.5),
    );

    // Generate focus areas based on question types and scores
    const questionTypeScores: Record<
      string,
      { count: number; totalScore: number }
    > = {};

    historyData.forEach((interview) => {
      if (interview.detailed_analysis) {
        interview.detailed_analysis.forEach((analysis: any) => {
          const type = analysis.type || "general";
          if (!questionTypeScores[type]) {
            questionTypeScores[type] = { count: 0, totalScore: 0 };
          }
          questionTypeScores[type].count += 1;
          questionTypeScores[type].totalScore += analysis.metrics?.clarity || 0;
        });
      }
    });

    const focusAreas = Object.entries(questionTypeScores).map(
      ([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        progress: data.count > 0 ? Math.round(data.totalScore / data.count) : 0,
      }),
    );

    // If no focus areas, add default ones
    if (focusAreas.length === 0) {
      focusAreas.push(
        { name: "Behavioral", progress: 0 },
        { name: "Technical", progress: 0 },
        { name: "System Design", progress: 0 },
        { name: "Coding", progress: 0 },
      );
    }

    // Sort focus areas by progress (ascending) to prioritize areas needing improvement
    focusAreas.sort((a, b) => a.progress - b.progress);

    // Generate upcoming practice tasks based on focus areas and scheduled interviews
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    // Get day name for day after tomorrow
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayAfterTomorrowName = dayNames[dayAfterTomorrow.getDay()];

    // Generate practice tasks based on weakest areas
    const upcomingPractice = [
      {
        day: "Today",
        tasks: [
          `Practice ${focusAreas[0]?.name || "behavioral"} questions`,
          `Review ${focusAreas[1]?.name || "technical"} concepts`,
        ],
      },
      {
        day: "Tomorrow",
        tasks: [
          `Mock interview focusing on ${focusAreas[0]?.name || "behavioral"} questions`,
          "Review feedback from previous interviews",
        ],
      },
      {
        day: dayAfterTomorrowName,
        tasks: [
          `${focusAreas[2]?.name || "Coding"} practice session`,
          `Prepare for upcoming ${scheduledInterviews.length > 0 ? scheduledInterviews[0].title : "interviews"}`,
        ],
      },
    ];

    // Add scheduled interviews to practice tasks
    scheduledInterviews.forEach((interview) => {
      const interviewDate = new Date(interview.scheduled_at);
      const today = new Date();

      // Only add if it's today or in the future
      if (interviewDate >= today) {
        // Find which day bucket to put it in
        const dayDiff = Math.floor(
          (interviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (dayDiff === 0) {
          // Today
          upcomingPractice[0].tasks.push(`Scheduled: ${interview.title}`);
        } else if (dayDiff === 1) {
          // Tomorrow
          upcomingPractice[1].tasks.push(`Scheduled: ${interview.title}`);
        } else if (dayDiff === 2) {
          // Day after tomorrow
          upcomingPractice[2].tasks.push(`Scheduled: ${interview.title}`);
        }
      }
    });

    // Generate achievements based on history
    const achievements = [];

    if (totalInterviews > 0) {
      achievements.push(
        `Completed ${totalInterviews} interview${totalInterviews > 1 ? "s" : ""}`,
      );
    }

    if (averageScore > 70) {
      achievements.push(`Achieved ${averageScore}% average score`);
    }

    // Add achievements for high scores in specific areas
    Object.entries(questionTypeScores).forEach(([type, data]) => {
      const avgScore =
        data.count > 0 ? Math.round(data.totalScore / data.count) : 0;
      if (avgScore > 80 && data.count >= 3) {
        achievements.push(
          `Mastered ${type} questions with ${avgScore}% average`,
        );
      }
    });

    // If no achievements, add default ones
    if (achievements.length === 0) {
      achievements.push(
        "Started interview practice journey",
        "Set up your learning plan",
        "Ready to improve interview skills",
      );
    }

    return {
      progress,
      daysActive,
      totalInterviews,
      focusAreas,
      upcomingPractice,
      achievements,
    };
  };

  // State for history and scheduled interviews
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [scheduledInterviews, setScheduledInterviews] = useState<any[]>([]);
  const [learningPlan, setLearningPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data for learning plan
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch interview history
        let history: any[] = [];
        let interviews: any[] = [];

        if (!isSupabaseConfigured()) {
          // Mock data for demo
          history = [
            {
              id: "1",
              completed_at: new Date(
                Date.now() - 7 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              overall_score: 75,
              detailed_analysis: [
                { type: "behavioral", metrics: { clarity: 80 } },
                { type: "technical", metrics: { clarity: 65 } },
              ],
            },
            {
              id: "2",
              completed_at: new Date(
                Date.now() - 3 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              overall_score: 82,
              detailed_analysis: [
                { type: "behavioral", metrics: { clarity: 85 } },
                { type: "coding", metrics: { clarity: 78 } },
              ],
            },
          ];

          interviews = [
            {
              id: "1",
              title: "Mock Interview - Software Engineer",
              scheduled_at: new Date(
                Date.now() + 1 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
            {
              id: "2",
              title: "System Design Practice",
              scheduled_at: new Date(
                Date.now() + 3 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
          ];
        } else {
          // Fetch real data from Supabase
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            // Fetch interview results
            const { data: historyData, error: historyError } = await supabase
              .from("interview_results")
              .select("*")
              .eq("user_id", userData.user.id);

            if (historyError) {
              console.error("Error fetching interview history:", historyError);
            } else if (historyData) {
              history = historyData;
            }

            // Fetch scheduled interviews
            const { data: interviewData, error: interviewError } =
              await supabase
                .from("scheduled_interviews")
                .select("*")
                .eq("user_id", userData.user.id)
                .order("scheduled_at", { ascending: true });

            if (interviewError) {
              console.error(
                "Error fetching scheduled interviews:",
                interviewError,
              );
            } else if (interviewData) {
              interviews = interviewData;
            }
          }
        }

        setHistoryData(history);
        setScheduledInterviews(interviews);

        // Generate learning plan based on fetched data
        const plan = generateLearningPlan(history, interviews);
        setLearningPlan(plan);
      } catch (error) {
        console.error("Error generating learning plan:", error);
        // Set default learning plan if error occurs
        setLearningPlan({
          progress: 0,
          daysActive: 0,
          totalInterviews: 0,
          focusAreas: [
            { name: "Behavioral", progress: 0 },
            { name: "Technical", progress: 0 },
            { name: "System Design", progress: 0 },
            { name: "Coding", progress: 0 },
          ],
          upcomingPractice: [
            {
              day: "Today",
              tasks: [
                "Practice behavioral questions",
                "Review system design basics",
              ],
            },
            {
              day: "Tomorrow",
              tasks: ["Mock interview - Frontend role", "Review feedback"],
            },
            {
              day: "Wednesday",
              tasks: [
                "Coding practice - Algorithms",
                "Technical concepts review",
              ],
            },
          ],
          achievements: [
            "Started interview practice journey",
            "Set up your learning plan",
            "Ready to improve interview skills",
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate calendar events from scheduled interviews
  const calendarEvents = scheduledInterviews.map((interview) => ({
    date: new Date(interview.scheduled_at),
    title: interview.title,
    id: interview.id,
  }));

  // Check if a date has an event
  const hasEvent = (date: Date) => {
    return calendarEvents.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    );
  };

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personalized Learning Plan</CardTitle>
        <CardDescription>
          Track your progress and follow your improvement plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="plan"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="plan">Learning Plan</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : learningPlan ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-primary" />
                      Overall Progress
                    </h3>
                    <span className="text-sm font-medium">
                      {learningPlan.progress}%
                    </span>
                  </div>
                  <Progress value={learningPlan.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/50 p-3 rounded-lg text-center border border-border/50">
                    <div className="flex justify-center mb-1">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">
                      {learningPlan.daysActive}
                    </p>
                    <p className="text-xs text-muted-foreground">Days Active</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-center border border-border/50">
                    <div className="flex justify-center mb-1">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">
                      {learningPlan.totalInterviews}
                    </p>
                    <p className="text-xs text-muted-foreground">Interviews</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Focus Areas
                  </h3>
                  <div className="space-y-3">
                    {learningPlan.focusAreas.map((area, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium">
                            {area.name}
                          </span>
                          <span className="text-xs">{area.progress}%</span>
                        </div>
                        <Progress
                          value={area.progress}
                          className="h-1.5"
                          // Different colors based on progress
                          indicatorClassName={
                            area.progress > 70
                              ? "bg-green-500"
                              : area.progress > 40
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Upcoming Practice
                  </h3>
                  <div className="space-y-3">
                    {learningPlan.upcomingPractice.map((day, index) => (
                      <div
                        key={index}
                        className="bg-muted/30 p-3 rounded-lg border border-border/50"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">{day.day}</h4>
                          <Badge variant="outline" className="text-xs">
                            {day.tasks.length} tasks
                          </Badge>
                        </div>
                        <ul className="space-y-1">
                          {day.tasks.map((task, i) => (
                            <li
                              key={i}
                              className="text-xs flex items-start gap-2"
                            >
                              <CheckCircle2 className="h-3 w-3 mt-0.5 text-muted-foreground" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Achievements
                  </h3>
                  <div className="space-y-2">
                    {learningPlan.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="bg-muted/30 p-2 rounded-lg text-xs flex items-center gap-2 border border-border/50"
                      >
                        <div className="bg-primary/10 p-1 rounded-full">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        </div>
                        {achievement}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Failed to load learning plan
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => fetchUserProgress()}
                >
                  Retry
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border mx-auto"
              modifiers={{
                event: (date) => hasEvent(date),
              }}
              modifiersClassNames={{
                event: "bg-primary/10 font-bold text-primary",
              }}
            />

            {date && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>

                {getEventsForDate(date).length > 0 ? (
                  <div className="space-y-2">
                    {getEventsForDate(date).map((event, index) => (
                      <div
                        key={index}
                        className="bg-muted/30 p-3 rounded-lg flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{event.title}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Start
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/30 p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      No events scheduled for this day
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LearningPlanPanel;
