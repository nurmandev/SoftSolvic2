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
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Plus, Mail } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sendInterviewReminder } from "@/lib/emailService";

interface ScheduledInterview {
  id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  interview_type: string;
  role?: string;
}

const CalendarPanel = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [scheduledInterviews, setScheduledInterviews] = useState<
    ScheduledInterview[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInterview, setNewInterview] = useState<Partial<ScheduledInterview>>(
    {
      title: "",
      description: "",
      scheduled_at: new Date().toISOString(),
      duration_minutes: 30,
      interview_type: "practice",
      role: "",
    },
  );

  useEffect(() => {
    fetchScheduledInterviews();
  }, []);

  const fetchScheduledInterviews = async () => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        // Mock data for demo purposes
        const mockInterviews = generateMockInterviews();
        setScheduledInterviews(mockInterviews);
        setIsLoading(false);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setIsLoading(false);
        return;
      }

      // Fetch scheduled interviews from Supabase
      const { data, error } = await supabase
        .from("scheduled_interviews")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("scheduled_at", { ascending: true });

      if (error) {
        console.error("Error fetching scheduled interviews:", error);
        setScheduledInterviews(generateMockInterviews());
      } else if (data) {
        setScheduledInterviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch scheduled interviews:", error);
      setScheduledInterviews(generateMockInterviews());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockInterviews = (): ScheduledInterview[] => {
    const today = new Date();
    return [
      {
        id: "1",
        title: "Mock Interview - Software Engineer",
        description: "Practice technical and behavioral questions",
        scheduled_at: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 2,
          14,
          0,
        ).toISOString(),
        duration_minutes: 45,
        interview_type: "practice",
        role: "Software Engineer",
      },
      {
        id: "2",
        title: "System Design Practice",
        description: "Focus on distributed systems concepts",
        scheduled_at: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 5,
          10,
          30,
        ).toISOString(),
        duration_minutes: 60,
        interview_type: "practice",
        role: "Senior Developer",
      },
      {
        id: "3",
        title: "Behavioral Question Prep",
        description: "STAR method practice",
        scheduled_at: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 1,
          15,
          0,
        ).toISOString(),
        duration_minutes: 30,
        interview_type: "practice",
        role: "Product Manager",
      },
    ];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const hasEvent = (date: Date) => {
    return scheduledInterviews.some((interview) => {
      const interviewDate = new Date(interview.scheduled_at);
      return (
        interviewDate.getDate() === date.getDate() &&
        interviewDate.getMonth() === date.getMonth() &&
        interviewDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getEventsForDate = (date: Date) => {
    return scheduledInterviews.filter((interview) => {
      const interviewDate = new Date(interview.scheduled_at);
      return (
        interviewDate.getDate() === date.getDate() &&
        interviewDate.getMonth() === date.getMonth() &&
        interviewDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isPastEvent = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate < now;
  };

  const handleScheduleInterview = async () => {
    try {
      if (!isSupabaseConfigured()) {
        // For demo purposes
        const mockInterview = {
          id: Math.random().toString(36).substring(7),
          ...newInterview,
          scheduled_at: new Date(newInterview.scheduled_at || "").toISOString(),
        } as ScheduledInterview;

        setScheduledInterviews([...scheduledInterviews, mockInterview]);
        setIsDialogOpen(false);
        setNewInterview({
          title: "",
          description: "",
          scheduled_at: new Date().toISOString(),
          duration_minutes: 30,
          interview_type: "practice",
          role: "",
        });
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data, error } = await supabase
        .from("scheduled_interviews")
        .insert([
          {
            user_id: userData.user.id,
            title: newInterview.title,
            description: newInterview.description,
            scheduled_at: new Date(
              newInterview.scheduled_at || "",
            ).toISOString(),
            duration_minutes: newInterview.duration_minutes,
            interview_type: newInterview.interview_type,
            role: newInterview.role,
            created_at: new Date().toISOString(),
            reminder_sent: false,
          },
        ])
        .select();

      if (error) {
        console.error("Error scheduling interview:", error);
      } else if (data) {
        setScheduledInterviews([...scheduledInterviews, data[0]]);
      }

      setIsDialogOpen(false);
      setNewInterview({
        title: "",
        description: "",
        scheduled_at: new Date().toISOString(),
        duration_minutes: 30,
        interview_type: "practice",
        role: "",
      });
    } catch (error) {
      console.error("Failed to schedule interview:", error);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      // When selecting a date for a new interview, update the scheduled_at time
      const currentTime = new Date();
      const selectedDateTime = new Date(date);
      selectedDateTime.setHours(currentTime.getHours());
      selectedDateTime.setMinutes(currentTime.getMinutes());
      setNewInterview({
        ...newInterview,
        scheduled_at: selectedDateTime.toISOString(),
      });
    }
  };

  // Send email reminder for an interview
  const handleSendReminder = async (id: string) => {
    try {
      if (!isSupabaseConfigured()) {
        alert(
          "Email functionality is not available in demo mode. In a real implementation, a reminder would be sent to your email.",
        );
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        alert("You must be logged in to send reminders");
        return;
      }

      const success = await sendInterviewReminder(userData.user.id, id);

      if (success) {
        alert("Reminder has been sent to your email");
      } else {
        alert("Failed to send reminder. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      alert("An error occurred while sending the reminder");
    }
  };

  const handleDeleteInterview = async (id: string) => {
    try {
      if (!isSupabaseConfigured()) {
        // For demo purposes
        setScheduledInterviews(
          scheduledInterviews.filter((interview) => interview.id !== id),
        );
        return;
      }

      const { error } = await supabase
        .from("scheduled_interviews")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting interview:", error);
      } else {
        setScheduledInterviews(
          scheduledInterviews.filter((interview) => interview.id !== id),
        );
      }
    } catch (error) {
      console.error("Failed to delete interview:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Interview Calendar</CardTitle>
            <CardDescription>
              Schedule and manage your practice sessions
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
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
                {getEventsForDate(date).map((interview) => (
                  <div
                    key={interview.id}
                    className={`p-3 rounded-lg flex justify-between items-center ${isPastEvent(interview.scheduled_at) ? "bg-muted/30" : "bg-primary/5 border border-primary/20"}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {formatTime(interview.scheduled_at)}
                        </span>
                        {isPastEvent(interview.scheduled_at) && (
                          <Badge variant="outline" className="text-xs bg-muted">
                            Completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm mt-1">{interview.title}</p>
                      {interview.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {interview.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!isPastEvent(interview.scheduled_at) && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Start
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendReminder(interview.id)}
                            title="Send email reminder"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInterview(interview.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  No interviews scheduled for this day
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview Session</DialogTitle>
            <DialogDescription>
              Plan your next practice interview session
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newInterview.title}
                onChange={(e) =>
                  setNewInterview({ ...newInterview, title: e.target.value })
                }
                placeholder="e.g., Technical Interview Practice"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Target Role</Label>
              <Input
                id="role"
                value={newInterview.role}
                onChange={(e) =>
                  setNewInterview({ ...newInterview, role: e.target.value })
                }
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={newInterview.description}
                onChange={(e) =>
                  setNewInterview({
                    ...newInterview,
                    description: e.target.value,
                  })
                }
                placeholder="Focus areas or notes"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date & Time</Label>
                <div className="flex gap-2">
                  <Input
                    id="date"
                    type="datetime-local"
                    value={new Date(newInterview.scheduled_at || "")
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(e) =>
                      setNewInterview({
                        ...newInterview,
                        scheduled_at: new Date(e.target.value).toISOString(),
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  value={newInterview.duration_minutes?.toString()}
                  onValueChange={(value) =>
                    setNewInterview({
                      ...newInterview,
                      duration_minutes: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Interview Type</Label>
              <Select
                value={newInterview.interview_type}
                onValueChange={(value) =>
                  setNewInterview({ ...newInterview, interview_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="practice">Practice Session</SelectItem>
                  <SelectItem value="mock">Mock Interview</SelectItem>
                  <SelectItem value="real">Real Interview Prep</SelectItem>
                  <SelectItem value="technical">
                    Technical Assessment
                  </SelectItem>
                  <SelectItem value="behavioral">
                    Behavioral Questions
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleScheduleInterview}
              disabled={!newInterview.title}
            >
              Schedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CalendarPanel;
