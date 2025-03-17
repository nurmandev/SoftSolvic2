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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface LiveInterviewPanelProps {
  onStartLiveInterview?: () => void;
  onEndLiveInterview?: () => void;
}

const LiveInterviewPanel = ({
  onStartLiveInterview = () => {},
  onEndLiveInterview = () => {},
}: LiveInterviewPanelProps) => {
  const [isLive, setIsLive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [interviewerType, setInterviewerType] = useState<"ai" | "mentor">("ai");
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsLive(true);
      onStartLiveInterview();
    }
  }, [countdown, onStartLiveInterview]);

  const startInterview = () => {
    setCountdown(3); // 3 second countdown
  };

  const endInterview = () => {
    setIsLive(false);
    onEndLiveInterview();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Live Interview Session</CardTitle>
        <CardDescription>
          Practice with AI interviewer or connect with a mentor
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isLive && countdown === null ? (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <h3 className="text-sm font-medium">Choose Interviewer Type:</h3>
              <div className="flex gap-2">
                <Button
                  variant={interviewerType === "ai" ? "default" : "outline"}
                  onClick={() => setInterviewerType("ai")}
                  className="flex-1"
                >
                  AI Interviewer
                </Button>
                <Button
                  variant={interviewerType === "mentor" ? "default" : "outline"}
                  onClick={() => setInterviewerType("mentor")}
                  className="flex-1"
                >
                  Human Mentor
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {interviewerType === "ai"
                  ? "Practice with our AI interviewer for immediate feedback"
                  : "Connect with an experienced professional for personalized coaching"}
              </p>
            </div>

            <Button onClick={startInterview} className="w-full" size="lg">
              Start Live Interview
            </Button>
          </div>
        ) : countdown !== null && countdown > 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="text-6xl font-bold mb-4">{countdown}</div>
            <p>Starting interview session...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {interviewerType === "ai" ? (
                    <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=interviewer" />
                  ) : (
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=mentor" />
                  )}
                  <AvatarFallback>
                    {interviewerType === "ai" ? "AI" : "M"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {interviewerType === "ai"
                      ? "AI Interviewer"
                      : "Mentor John"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {interviewerType === "ai"
                      ? "Powered by DeepSeek AI"
                      : "Senior Software Engineer"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMicOn(!isMicOn)}
                >
                  {isMicOn ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <VideoOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4 min-h-[200px] flex items-center justify-center">
              {isVideoOn ? (
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Video stream would appear here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Simulated for demo purposes)
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-2">
                    {interviewerType === "ai" ? (
                      <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=interviewer" />
                    ) : (
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=mentor" />
                    )}
                    <AvatarFallback>
                      {interviewerType === "ai" ? "AI" : "M"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-muted-foreground">Video is turned off</p>
                </div>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm">
                {interviewerType === "ai"
                  ? "Tell me about a challenging project you worked on recently and how you overcame obstacles."
                  : "I'd like to hear about your experience with team collaboration. Can you share an example?"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      {isLive && (
        <CardFooter>
          <Button
            variant="destructive"
            onClick={endInterview}
            className="w-full"
          >
            End Interview
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LiveInterviewPanel;
