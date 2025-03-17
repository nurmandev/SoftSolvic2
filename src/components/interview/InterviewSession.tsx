import { useState, useEffect, useRef } from "react";
import LanguageSelector from "./LanguageSelector";
import NavBar from "./NavBar";
import NotesPanel from "./NotesPanel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Mic,
  MicOff,
  SkipForward,
  ArrowLeft,
  Loader2,
  Code,
} from "lucide-react";
import { generateFeedback } from "@/lib/deepseek";
import CodeEditor, { getDefaultCode } from "./CodeEditor";

interface InterviewSessionProps {
  onComplete?: (
    answers: string[],
    codeAnswers: string[],
    codingLanguages: string[],
  ) => void;
  questions?: string[];
  questionTypes?: string[];
}

const defaultQuestions = [
  "Tell me about a time when you had to deal with a difficult team member. How did you handle it?",
  "Describe a project where you had to learn a new technology quickly. What was your approach?",
  "What's your greatest professional achievement and why?",
  "How do you prioritize tasks when you have multiple deadlines?",
  "Implement a function to find the maximum subarray sum in an array of integers. For example, for the array [-2, 1, -3, 4, -1, 2, 1, -5, 4], the contiguous subarray with the largest sum is [4, -1, 2, 1], with sum 6.",
];

const defaultTypes = [
  "behavioral",
  "behavioral",
  "behavioral",
  "behavioral",
  "coding",
];

const InterviewSession = ({
  onComplete = () => {},
  questions = defaultQuestions,
  questionTypes = defaultTypes,
}: InterviewSessionProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [userCode, setUserCode] = useState<string>("");
  const [codingLanguage, setCodingLanguage] = useState<string>("javascript");
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill(""),
  );
  const [codeAnswers, setCodeAnswers] = useState<string[]>(
    Array(questions.length).fill(""),
  );
  const [codingLanguages, setCodingLanguages] = useState<string[]>(
    Array(questions.length).fill("javascript"),
  );
  const [interviewLanguage, setInterviewLanguage] = useState("en");
  const [notes, setNotes] = useState<string[]>(
    Array(questions.length).fill(""),
  );
  const [realTimeFeedback, setRealTimeFeedback] = useState<string | null>(null);
  const [isGeneratingRealTimeFeedback, setIsGeneratingRealTimeFeedback] =
    useState(false);

  // For speech recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(true);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };
    } else {
      setIsRecognitionSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    let interval: number | null = null;

    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      window.clearInterval(interval);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isRecording]);

  // Generate real-time feedback as the user speaks
  useEffect(() => {
    if (isRecording && userAnswer.length > 30) {
      const debounceTimeout = setTimeout(() => {
        generateRealTimeFeedback();
      }, 3000); // Generate feedback every 3 seconds during recording

      return () => clearTimeout(debounceTimeout);
    }
  }, [userAnswer, isRecording]);

  const generateRealTimeFeedback = async () => {
    if (!isRecording || isGeneratingRealTimeFeedback) return;

    setIsGeneratingRealTimeFeedback(true);
    try {
      const { generateFeedback } = await import("@/lib/deepseek");
      const realtimeFeedback = await generateFeedback(
        `[REAL-TIME] ${questions[currentQuestionIndex]}`,
        userAnswer,
        interviewLanguage,
      );

      setRealTimeFeedback(realtimeFeedback);
    } catch (error) {
      console.error("Error generating real-time feedback:", error);
    } finally {
      setIsGeneratingRealTimeFeedback(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording and generate feedback
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Save the answer
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = userAnswer;
      setAnswers(newAnswers);

      // If it's a coding question, also save the code
      if (questionTypes[currentQuestionIndex] === "coding") {
        const newCodeAnswers = [...codeAnswers];
        newCodeAnswers[currentQuestionIndex] = userCode;
        setCodeAnswers(newCodeAnswers);

        const newCodingLanguages = [...codingLanguages];
        newCodingLanguages[currentQuestionIndex] = codingLanguage;
        setCodingLanguages(newCodingLanguages);
      }

      // Generate feedback
      generateAIFeedback();
    } else {
      // Start recording
      setIsRecording(true);
      setFeedback(null);
      setRealTimeFeedback(null);
      setRecordingTime(0);
      setUserAnswer("");

      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    }
  };

  const generateAIFeedback = async () => {
    if (questionTypes[currentQuestionIndex] === "coding") {
      if (!userCode.trim()) {
        setFeedback("No code submitted. Please write some code and run it.");
        return;
      }
    } else if (!userAnswer.trim()) {
      setFeedback("No answer detected. Please try again.");
      return;
    }

    setIsGeneratingFeedback(true);
    try {
      const answer =
        questionTypes[currentQuestionIndex] === "coding"
          ? userCode
          : userAnswer;

      // Include question type and current question index to help with context
      const aiFeedback = await generateFeedback(
        `[${questionTypes[currentQuestionIndex].toUpperCase()}] [Question ${currentQuestionIndex + 1}/${questions.length}] ${questions[currentQuestionIndex]}`,
        answer,
        interviewLanguage,
      );
      setFeedback(aiFeedback);
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedback(
        "Your answer was concise, but could benefit from more structure. Consider using the STAR method (Situation, Task, Action, Result) to make your response more compelling and complete.",
      );
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Save notes for current question if any
      if (notes[currentQuestionIndex]) {
        const updatedNotes = [...notes];
        updatedNotes[currentQuestionIndex] = notes[currentQuestionIndex];
        setNotes(updatedNotes);
      }

      setCurrentQuestionIndex((prev) => prev + 1);
      setIsRecording(false);
      setRecordingTime(0);
      setFeedback(null);
      setRealTimeFeedback(null);
      setUserAnswer("");
      setUserCode("");
    } else {
      // Save interview data to Supabase before completing
      saveInterviewToSupabase();
      onComplete(answers, codeAnswers, codingLanguages);
    }
  };

  const saveInterviewToSupabase = async () => {
    try {
      const { supabase, isSupabaseConfigured } = await import("@/lib/supabase");

      if (!isSupabaseConfigured()) {
        console.log("Supabase not configured, skipping save to database");
        return;
      }

      const interviewData = {
        questions,
        question_types: questionTypes,
        answers,
        code_answers: codeAnswers,
        coding_languages: codingLanguages,
        notes,
        completed_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("interviews")
        .insert([interviewData]);

      if (error) {
        console.error("Error saving interview to Supabase:", error);
      }
    } catch (error) {
      console.error("Failed to save interview data:", error);
    }
  };

  const handleSaveNote = (index: number, noteText: string) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = noteText;
    setNotes(updatedNotes);
  };

  // Removed ability to go back to previous questions
  const previousQuestion = () => {
    // Functionality removed as per requirement
    return;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Add tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert(
          "Please don't switch tabs during the interview. Focus on your current session.",
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <LanguageSelector onLanguageChange={setInterviewLanguage} />
            </div>
            <h2 className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="w-full mb-6">
              <CardHeader>
                <CardTitle>Interview Question</CardTitle>
                <CardDescription>
                  Take your time to think before answering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">
                  {questions[currentQuestionIndex]}
                </p>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Your Response</CardTitle>
                <CardDescription>
                  {questionTypes[currentQuestionIndex] === "coding"
                    ? "Write and run your code to solve the problem"
                    : isRecognitionSupported
                      ? "Click the microphone to record your answer"
                      : "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {questionTypes[currentQuestionIndex] === "coding" ? (
                  <div className="mb-6">
                    <CodeEditor
                      initialCode={getDefaultCode(codingLanguage)}
                      onCodeChange={setUserCode}
                      language={codingLanguage}
                      onLanguageChange={setCodingLanguage}
                      testCases={[
                        {
                          input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
                          output: "6",
                        },
                        {
                          input: "[1, 2, 3, 4, 5]",
                          output: "15",
                        },
                        {
                          input: "[-1, -2, -3, -4, -5]",
                          output: "-1",
                        },
                      ]}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center py-8">
                      <Button
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        className="rounded-full h-16 w-16 flex items-center justify-center mb-4"
                        onClick={toggleRecording}
                        disabled={
                          !isRecognitionSupported || isGeneratingFeedback
                        }
                      >
                        {isRecording ? (
                          <MicOff className="h-6 w-6" />
                        ) : (
                          <Mic className="h-6 w-6" />
                        )}
                      </Button>
                      <p className="text-sm font-medium">
                        {isRecording
                          ? `Recording: ${formatTime(recordingTime)}`
                          : "Click to start recording"}
                      </p>
                    </div>

                    {userAnswer && (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold mb-2">Your Answer:</h3>
                        <p>{userAnswer}</p>
                      </div>
                    )}
                  </>
                )}

                {isGeneratingFeedback && (
                  <div className="mt-6 p-4 bg-muted rounded-lg flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <p>Generating feedback...</p>
                  </div>
                )}

                {feedback && !isGeneratingFeedback && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">AI Feedback:</h3>
                    <p>{feedback}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {/* Previous question button removed */}
                <div></div>
                <Button
                  onClick={nextQuestion}
                  disabled={
                    isRecording ||
                    isGeneratingFeedback ||
                    (questionTypes[currentQuestionIndex] === "coding" &&
                      !userCode)
                  }
                  className="flex items-center gap-2"
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      Next Question
                      <SkipForward className="h-4 w-4" />
                    </>
                  ) : (
                    "Complete Interview"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-1">
            <NotesPanel
              questionIndex={currentQuestionIndex}
              onSaveNote={handleSaveNote}
              savedNotes={notes}
            />

            {realTimeFeedback && isRecording && (
              <Card className="w-full mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md">Real-Time Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{realTimeFeedback}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
