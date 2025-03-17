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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Loader2, FileText } from "lucide-react";
import { generateInterviewQuestions } from "@/lib/deepseek";
import { generateJobSpecificQuestions } from "@/lib/jobSpecificQuestions";
import ResumeAnalysis from "./ResumeAnalysis";
import LanguageSelector from "./LanguageSelector";
import NavBar from "./NavBar";

interface InterviewSetupProps {
  onStart?: () => void;
  selectedRole?: string;
  onQuestionsGenerated?: (questions: any) => void;
}

const InterviewSetup = ({
  onStart = () => {},
  selectedRole = "",
  onQuestionsGenerated = () => {},
}: InterviewSetupProps) => {
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState(selectedRole);
  const [difficulty, setDifficulty] = useState([3]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [questionCategories, setQuestionCategories] = useState<string[]>([
    "behavioral",
    "technical",
    "coding",
  ]);
  const [interviewLanguage, setInterviewLanguage] = useState("en");
  const [resumeText, setResumeText] = useState<string>("");

  useEffect(() => {
    if (selectedRole) {
      setRole(selectedRole);
    }
  }, [selectedRole]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);

      // Simple text extraction from file
      try {
        const text = await file.text();
        setResumeText(text);
      } catch (error) {
        console.error("Error reading resume file:", error);
        setResumeText("");
      }
    }
  };

  const handleStartInterview = async () => {
    if (!role) {
      setError("Please select or enter a role");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // First try to generate job-specific questions
      let result;

      try {
        // Use job-specific questions generator first
        result = generateJobSpecificQuestions(
          role,
          questionCount,
          questionCategories,
        );
      } catch (jobSpecificError) {
        console.error(
          "Error generating job-specific questions:",
          jobSpecificError,
        );

        // Fall back to DeepSeek API if job-specific generation fails
        result = await generateInterviewQuestions(
          role,
          difficulty[0],
          questionCount,
          questionCategories,
          resumeText || undefined,
          industry || undefined,
          interviewLanguage,
        );
      }

      // Save interview configuration to Supabase
      try {
        const { supabase, isSupabaseConfigured } = await import(
          "@/lib/supabase"
        );

        if (!isSupabaseConfigured()) {
          console.log("Supabase not configured, skipping save to database");
        } else {
          const { data: userData } = await supabase.auth.getUser();

          if (userData?.user) {
            await supabase.from("interview_sessions").insert([
              {
                user_id: userData.user.id,
                role: role,
                industry: industry || null,
                difficulty: difficulty[0],
                question_count: questionCount,
                categories: questionCategories,
                language: interviewLanguage,
                created_at: new Date().toISOString(),
                status: "created",
              },
            ]);
          }
        }
      } catch (dbError) {
        console.error("Error saving interview configuration:", dbError);
        // Continue even if saving to database fails
      }

      onQuestionsGenerated(result);
      onStart();
    } catch (err) {
      setError(
        "Failed to generate questions. Please check your API key and try again.",
      );
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Configure Your Interview</h1>
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Interview Settings</CardTitle>
            <CardDescription>
              Customize your practice interview experience
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Enter your industry (e.g., Technology, Healthcare)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter your target role (e.g., Software Engineer)"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <span className="text-sm text-muted-foreground">
                  {difficulty[0] === 1
                    ? "Easy"
                    : difficulty[0] === 2
                      ? "Medium-Easy"
                      : difficulty[0] === 3
                        ? "Medium"
                        : difficulty[0] === 4
                          ? "Medium-Hard"
                          : "Hard"}
                </span>
              </div>
              <Slider
                id="difficulty"
                min={1}
                max={5}
                step={1}
                value={difficulty}
                onValueChange={setDifficulty}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionCount">Number of Questions</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="questionCount"
                  min={3}
                  max={10}
                  step={1}
                  value={[questionCount]}
                  onValueChange={(value) => setQuestionCount(value[0])}
                  className="flex-1"
                />
                <span className="w-8 text-center">{questionCount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Question Categories</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "behavioral", label: "Behavioral" },
                  { id: "technical", label: "Technical" },
                  { id: "coding", label: "Coding" },
                  { id: "leadership", label: "Leadership" },
                  { id: "problemsolving", label: "Problem Solving" },
                  { id: "communication", label: "Communication" },
                  { id: "teamwork", label: "Teamwork" },
                  { id: "projectmanagement", label: "Project Management" },
                  { id: "systemdesign", label: "System Design" },
                  { id: "cultural", label: "Cultural Fit" },
                ].map((category) => (
                  <Button
                    key={category.id}
                    type="button"
                    variant={
                      questionCategories.includes(category.id)
                        ? "default"
                        : "outline"
                    }
                    className="text-sm"
                    onClick={() => {
                      if (questionCategories.includes(category.id)) {
                        if (questionCategories.length > 1) {
                          // Prevent removing all categories
                          setQuestionCategories(
                            questionCategories.filter((c) => c !== category.id),
                          );
                        }
                      } else {
                        setQuestionCategories([
                          ...questionCategories,
                          category.id,
                        ]);
                      }
                    }}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Select the types of questions you want to practice
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewLanguage">Interview Language</Label>
              <Select
                value={interviewLanguage}
                onValueChange={setInterviewLanguage}
              >
                <SelectTrigger id="interviewLanguage">
                  <SelectValue placeholder="Select interview language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                  <SelectItem value="ru">Russian</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Select the language for your interview questions and responses
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Upload Resume (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {resumeFile && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {resumeFile.name}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your resume for more personalized interview questions
              </p>
            </div>

            {resumeText && (
              <div className="mt-6">
                <ResumeAnalysis resumeText={resumeText} />
              </div>
            )}

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={handleStartInterview}
              disabled={isGenerating || !role.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                "Begin Interview"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default InterviewSetup;
