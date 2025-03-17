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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Share2,
  ArrowRight,
  Brain,
  Mail,
  FileText,
} from "lucide-react";
import InterviewAnalysis from "./InterviewAnalysis";
import NavBar from "./NavBar";
import {
  analyzePersonality,
  PersonalityProfile,
} from "@/lib/personalityInsights";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  generateAnalysisReport,
  sendInterviewResults,
} from "@/lib/emailService";

interface InterviewResultsProps {
  onStartNew?: () => void;
  onViewDashboard?: () => void;
  answers?: string[];
  questions?: string[];
  questionTypes?: string[];
  codeAnswers?: string[];
  codingLanguages?: string[];
}

const InterviewResults = ({
  onStartNew = () => {},
  onViewDashboard = () => {},
  answers = [],
  questions = [],
  questionTypes = [],
  codeAnswers = [],
  codingLanguages = [],
}: InterviewResultsProps) => {
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [personalityProfile, setPersonalityProfile] =
    useState<PersonalityProfile | null>(null);
  const [activeTab, setActiveTab] = useState("summary");

  // Analyze personality based on answers
  useEffect(() => {
    if (answers && answers.length > 0) {
      const profile = analyzePersonality(answers);
      setPersonalityProfile(profile);

      // Save results to Supabase
      saveResultsToSupabase();
    }
  }, [answers]);

  // Handle downloading the analysis report
  const handleDownloadReport = async () => {
    try {
      // Generate a unique ID for this result if we don't have one
      const resultId = Math.random().toString(36).substring(2, 15);

      // In a real implementation, we would use the actual result ID from the database
      const reportBlob = await generateAnalysisReport(resultId);

      if (reportBlob) {
        // Create a download link
        const url = URL.createObjectURL(reportBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `interview-analysis-${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        console.error("Failed to generate report");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  // Handle emailing the results
  const handleEmailResults = async () => {
    try {
      if (!isSupabaseConfigured()) {
        alert(
          "Email functionality is not available in demo mode. In a real implementation, the results would be sent to your email.",
        );
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        alert("You must be logged in to email results");
        return;
      }

      // In a real implementation, we would use the actual result ID from the database
      const resultId = Math.random().toString(36).substring(2, 15);
      const success = await sendInterviewResults(userData.user.id, resultId);

      if (success) {
        alert("Results have been sent to your email");
      } else {
        alert("Failed to send results. Please try again later.");
      }
    } catch (error) {
      console.error("Error emailing results:", error);
      alert("An error occurred while sending the results");
    }
  };

  const saveResultsToSupabase = async () => {
    try {
      const { isSupabaseConfigured } = await import("@/lib/supabase");
      if (!isSupabaseConfigured()) {
        console.log("Supabase not configured, skipping save to database");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user && questions.length > 0) {
        // Generate detailed analysis for each answer
        const detailedAnalysis = answers.map((answer, index) => {
          if (!answer.trim() && questionTypes[index] !== "coding") return null;

          // For coding questions, use code answers
          const content =
            questionTypes[index] === "coding" ? codeAnswers[index] : answer;
          if (!content.trim()) return null;

          // Generate analysis based on question type and answer content
          return analyzeAnswer(content, questionTypes[index], questions[index]);
        });

        // Save interview results with detailed analysis
        await supabase.from("interview_results").insert([
          {
            user_id: userData.user.id,
            questions: questions,
            question_types: questionTypes,
            answers: answers,
            code_answers: codeAnswers,
            coding_languages: codingLanguages,
            completed_at: new Date().toISOString(),
            overall_score: mockResults.overallScore,
            metrics: mockResults.metrics,
            personality_traits: personalityProfile?.dominantTraits || [],
            detailed_analysis: detailedAnalysis.filter(Boolean),
          },
        ]);
      }
    } catch (error) {
      console.error("Error saving results to Supabase:", error);
    }
  };

  // Function to analyze individual answers
  const analyzeAnswer = (content: string, type: string, question: string) => {
    // This would ideally use AI, but for now we'll use a rule-based approach
    const wordCount = content.split(/\s+/).length;
    const sentenceCount = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const avgSentenceLength = wordCount / (sentenceCount || 1);

    let analysis = {
      question,
      type,
      metrics: {
        wordCount,
        sentenceCount,
        avgSentenceLength,
        clarity: 0,
        relevance: 0,
        structure: 0,
        depth: 0,
      },
      strengths: [] as string[],
      improvements: [] as string[],
      keywords: [] as string[],
    };

    // Analyze based on type
    if (type === "behavioral") {
      // Check for STAR method elements
      const hasContext = /situation|context|background/i.test(content);
      const hasAction = /action|approach|steps|implemented/i.test(content);
      const hasResult =
        /result|outcome|impact|improved|increased|decreased/i.test(content);

      analysis.metrics.structure =
        hasContext && hasAction && hasResult
          ? 85
          : (hasContext && hasAction) || (hasAction && hasResult)
            ? 65
            : hasAction
              ? 45
              : 30;

      // Check for specificity
      const hasSpecificDetails =
        /\d+%|\d+ percent|increased by|decreased by|improved|specific|exactly|precisely/i.test(
          content,
        );
      analysis.metrics.depth = hasSpecificDetails ? 75 : 50;

      // Strengths and improvements
      if (hasContext && hasAction && hasResult) {
        analysis.strengths.push(
          "Well-structured response using the STAR method",
        );
      } else {
        analysis.improvements.push(
          "Structure your answer using the STAR method (Situation, Task, Action, Result)",
        );
      }

      if (hasSpecificDetails) {
        analysis.strengths.push("Good use of specific details and metrics");
      } else {
        analysis.improvements.push(
          "Include specific numbers and metrics to quantify your impact",
        );
      }

      if (wordCount < 50) {
        analysis.improvements.push(
          "Expand your answer with more details about the situation and your actions",
        );
      } else if (wordCount > 300) {
        analysis.improvements.push(
          "Consider making your response more concise while maintaining key details",
        );
      } else {
        analysis.strengths.push("Good answer length - detailed but concise");
      }
    } else if (type === "technical") {
      // Check for technical depth
      const hasTechnicalTerms =
        /algorithm|framework|architecture|system|design|implementation|technology|concept|principle/i.test(
          content,
        );
      const hasExplanation =
        /because|therefore|this means|as a result|consequently|due to|explains|clarifies/i.test(
          content,
        );

      analysis.metrics.depth =
        hasTechnicalTerms && hasExplanation
          ? 80
          : hasTechnicalTerms
            ? 60
            : hasExplanation
              ? 50
              : 30;

      // Check for clarity
      analysis.metrics.clarity =
        avgSentenceLength < 25 ? 75 : avgSentenceLength < 35 ? 60 : 40;

      // Strengths and improvements
      if (hasTechnicalTerms) {
        analysis.strengths.push("Good use of technical terminology");
      } else {
        analysis.improvements.push(
          "Include more technical terms relevant to the question",
        );
      }

      if (hasExplanation) {
        analysis.strengths.push("Clear explanations of technical concepts");
      } else {
        analysis.improvements.push(
          "Explain why and how technical concepts work, not just what they are",
        );
      }

      if (avgSentenceLength > 30) {
        analysis.improvements.push(
          "Break down complex sentences for better clarity",
        );
      }
    } else if (type === "coding") {
      // Check for code quality
      const hasComments = /\/\/|\*\/|#|\*\*|--/i.test(content);
      const hasErrorHandling =
        /try|catch|if.*error|exception|throw|finally/i.test(content);
      const hasOptimization =
        /optimize|complexity|efficient|performance|O\(n\)|O\(log n\)/i.test(
          content,
        );

      analysis.metrics.depth =
        (hasComments ? 25 : 0) +
        (hasErrorHandling ? 25 : 0) +
        (hasOptimization ? 30 : 0) +
        20;

      // Strengths and improvements
      if (hasComments) {
        analysis.strengths.push("Good code documentation with comments");
      } else {
        analysis.improvements.push(
          "Add comments to explain your approach and key parts of the code",
        );
      }

      if (hasErrorHandling) {
        analysis.strengths.push("Includes error handling for robustness");
      } else {
        analysis.improvements.push(
          "Consider adding error handling for edge cases",
        );
      }

      if (hasOptimization) {
        analysis.strengths.push(
          "Shows awareness of code optimization and complexity",
        );
      } else {
        analysis.improvements.push(
          "Discuss the time and space complexity of your solution",
        );
      }
    }

    // Calculate relevance based on question keywords in answer
    const questionWords = question
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3);
    const answerWords = content.toLowerCase().split(/\W+/);
    const matchingWords = questionWords.filter((word) =>
      answerWords.includes(word),
    );
    analysis.metrics.relevance = Math.min(
      100,
      Math.round((matchingWords.length / questionWords.length) * 100) + 20,
    );

    // Extract keywords from answer
    const commonWords = new Set([
      "the",
      "and",
      "that",
      "this",
      "with",
      "for",
      "was",
      "were",
      "have",
      "had",
      "not",
      "are",
      "from",
    ]);
    const potentialKeywords = answerWords.filter(
      (word) => word.length > 4 && !commonWords.has(word),
    );

    // Count word frequency
    const wordFrequency: Record<string, number> = {};
    potentialKeywords.forEach((word) => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    // Get top keywords
    analysis.keywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    // Overall clarity score
    analysis.metrics.clarity = Math.round(
      (analysis.metrics.structure +
        analysis.metrics.depth +
        analysis.metrics.relevance) /
        3,
    );

    return analysis;
  };

  if (showDetailedAnalysis) {
    return (
      <div className="bg-background min-h-screen">
        <NavBar />
        <div className="container mx-auto py-8 px-4">
          <InterviewAnalysis
            answers={answers}
            questions={questions}
            questionTypes={questionTypes}
            codeAnswers={codeAnswers}
            codingLanguages={codingLanguages}
          />
          <div className="container mx-auto py-4 px-4">
            <Button
              variant="outline"
              onClick={() => setShowDetailedAnalysis(false)}
            >
              Back to Summary
            </Button>
          </div>
        </div>
      </div>
    );
  }
  // Mock data for the results
  const mockResults = {
    overallScore: 78,
    metrics: {
      confidence: 82,
      clarity: 75,
      content: 80,
      pacing: 68,
    },
    questionFeedback: [
      {
        question:
          "Tell me about a time when you had to deal with a difficult team member. How did you handle it?",
        strengths: [
          "Good conflict resolution approach",
          "Clear communication strategy",
        ],
        improvements: [
          "Could provide more specific outcomes",
          "Consider mentioning what you learned",
        ],
      },
      {
        question:
          "Describe a project where you had to learn a new technology quickly. What was your approach?",
        strengths: [
          "Excellent learning methodology",
          "Good prioritization of concepts",
        ],
        improvements: [
          "Spoke too quickly at times",
          "Could elaborate on specific challenges overcome",
        ],
      },
      {
        question: "What's your greatest professional achievement and why?",
        strengths: ["Compelling story structure", "Good emphasis on impact"],
        improvements: [
          "Quantify results more precisely",
          "Highlight your unique contribution",
        ],
      },
    ],
  };

  return (
    <div className="bg-background min-h-screen">
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Interview Results</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleDownloadReport}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleEmailResults}
            >
              <Mail className="h-4 w-4" />
              Email Results
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Performance Summary</TabsTrigger>
            <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
            <TabsTrigger
              value="personality"
              className="flex items-center gap-1"
            >
              <Brain className="h-4 w-4" />
              Personality Insights
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative h-32 w-32 flex items-center justify-center">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        className="text-muted-foreground stroke-current"
                        strokeWidth="10"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - mockResults.overallScore / 100)}`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">
                        {mockResults.overallScore}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Great performance!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Confidence</span>
                      <span className="text-sm font-medium">
                        {mockResults.metrics.confidence}%
                      </span>
                    </div>
                    <Progress
                      value={mockResults.metrics.confidence}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Speech Clarity
                      </span>
                      <span className="text-sm font-medium">
                        {mockResults.metrics.clarity}%
                      </span>
                    </div>
                    <Progress
                      value={mockResults.metrics.clarity}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Content Quality
                      </span>
                      <span className="text-sm font-medium">
                        {mockResults.metrics.content}%
                      </span>
                    </div>
                    <Progress
                      value={mockResults.metrics.content}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Speaking Pace</span>
                      <span className="text-sm font-medium">
                        {mockResults.metrics.pacing}%
                      </span>
                    </div>
                    <Progress
                      value={mockResults.metrics.pacing}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detailed Feedback</CardTitle>
              <CardDescription>
                Question-by-question analysis and improvement suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="q0" className="w-full">
                <TabsList className="mb-4 flex-wrap">
                  {mockResults.questionFeedback.map((_, index) => (
                    <TabsTrigger key={index} value={`q${index}`}>
                      Question {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {mockResults.questionFeedback.map((feedback, index) => {
                  // Generate detailed metrics for each answer
                  const answerText = answers[index] || "";
                  const codeText = codeAnswers[index] || "";
                  const content =
                    questionTypes[index] === "coding" ? codeText : answerText;
                  const detailedMetrics = analyzeAnswer(
                    content,
                    questionTypes[index] || "behavioral",
                    feedback.question,
                  );

                  return (
                    <TabsContent
                      key={index}
                      value={`q${index}`}
                      className="space-y-4"
                    >
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">Question:</h3>
                        <p>{feedback.question}</p>
                        <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                          <h4 className="text-sm font-medium mb-2">
                            Your Answer:
                          </h4>
                          <p className="text-sm">
                            {questionTypes[index] === "coding" ? (
                              <pre className="bg-muted-foreground/10 p-2 rounded overflow-auto text-xs">
                                {codeText || "No code submitted"}
                              </pre>
                            ) : (
                              answerText || "No answer recorded"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3 text-green-600">
                              Strengths:
                            </h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {detailedMetrics.strengths.length > 0
                                ? detailedMetrics.strengths.map(
                                    (strength, i) => (
                                      <li key={i}>{strength}</li>
                                    ),
                                  )
                                : feedback.strengths.map((strength, i) => (
                                    <li key={i}>{strength}</li>
                                  ))}
                            </ul>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3 text-blue-600">
                              Key Metrics:
                            </h3>
                            <div className="space-y-3">
                              {Object.entries(detailedMetrics.metrics)
                                .filter(
                                  ([key]) =>
                                    typeof detailedMetrics.metrics[key] ===
                                      "number" &&
                                    key !== "wordCount" &&
                                    key !== "sentenceCount",
                                )
                                .map(([key, value]) => (
                                  <div key={key}>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm capitalize">
                                        {key.replace(/([A-Z])/g, " $1")}
                                      </span>
                                      <span className="text-sm">{value}%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className={`h-full ${Number(value) >= 70 ? "bg-green-500" : Number(value) >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                                        style={{ width: `${value}%` }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>
                                  Words: {detailedMetrics.metrics.wordCount}
                                </span>
                                <span>
                                  Sentences:{" "}
                                  {detailedMetrics.metrics.sentenceCount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3 text-amber-600">
                              Areas for Improvement:
                            </h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {detailedMetrics.improvements.length > 0
                                ? detailedMetrics.improvements.map(
                                    (improvement, i) => (
                                      <li key={i}>{improvement}</li>
                                    ),
                                  )
                                : feedback.improvements.map(
                                    (improvement, i) => (
                                      <li key={i}>{improvement}</li>
                                    ),
                                  )}
                            </ul>
                          </div>

                          {detailedMetrics.keywords.length > 0 && (
                            <div className="p-4 border rounded-lg">
                              <h3 className="font-medium mb-3 text-purple-600">
                                Key Topics in Your Answer:
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {detailedMetrics.keywords.map((keyword, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="bg-purple-50"
                                  >
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3 text-indigo-600">
                              AI Recommendations:
                            </h3>
                            <p className="text-sm">
                              {detailedMetrics.metrics.clarity >= 75
                                ? "Your answer demonstrates strong communication skills. Continue to use specific examples and clear structure in your responses."
                                : detailedMetrics.metrics.clarity >= 50
                                  ? "Your answer is solid but could be improved with more specific details and a clearer structure. Consider using the STAR method for behavioral questions."
                                  : "Focus on improving the structure and clarity of your answer. Be more specific and directly address the question asked."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personality">
          {personalityProfile ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personality Insights</CardTitle>
                  <CardDescription>
                    Analysis of your communication style and personality traits
                    based on your interview responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/30 rounded-lg mb-6">
                    <h3 className="font-medium mb-2">Summary</h3>
                    <p>{personalityProfile.summary}</p>
                  </div>

                  <h3 className="font-medium mb-4">Dominant Traits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {personalityProfile.traits
                      .slice(0, 3)
                      .map((trait, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div
                            className="h-2"
                            style={{
                              background: `linear-gradient(90deg, 
                              ${trait.score > 70 ? "rgb(34, 197, 94)" : trait.score > 40 ? "rgb(234, 179, 8)" : "rgb(239, 68, 68)"} ${trait.score}%, 
                              rgb(229, 231, 235) ${trait.score}%)`,
                            }}
                          />
                          <CardContent className="pt-4">
                            <h4 className="font-semibold text-sm">
                              {trait.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {trait.score}% strength
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  <h3 className="font-medium mb-4">Interview Tips</h3>
                  <ul className="space-y-2">
                    {personalityProfile.interviewTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detailed Trait Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    defaultValue={personalityProfile.traits[0].name
                      .toLowerCase()
                      .replace(/ /g, "-")}
                  >
                    <TabsList className="mb-4 flex-wrap">
                      {personalityProfile.traits.map((trait, index) => (
                        <TabsTrigger
                          key={index}
                          value={trait.name.toLowerCase().replace(/ /g, "-")}
                        >
                          {trait.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {personalityProfile.traits.map((trait, index) => (
                      <TabsContent
                        key={index}
                        value={trait.name.toLowerCase().replace(/ /g, "-")}
                        className="space-y-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{trait.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {trait.score}%
                            </span>
                            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${trait.score}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <p className="text-sm">{trait.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2 text-green-600">
                              Strengths
                            </h4>
                            <ul className="space-y-1">
                              {trait.strengths.map((strength, i) => (
                                <li
                                  key={i}
                                  className="text-sm flex items-start"
                                >
                                  <span className="text-green-500 mr-2">✓</span>
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2 text-amber-600">
                              Areas for Development
                            </h4>
                            <ul className="space-y-1">
                              {trait.improvements.map((improvement, i) => (
                                <li
                                  key={i}
                                  className="text-sm flex items-start"
                                >
                                  <span className="text-amber-500 mr-2">→</span>
                                  <span>{improvement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p>Analyzing your personality profile...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mt-4"></div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>
              Personalized suggestions to improve your interview skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Practice Specific Areas</h3>
                <p>
                  Focus on improving your speaking pace by practicing with a
                  metronome app set to 120-140 BPM. This will help you maintain
                  a steady, engaging rhythm during interviews.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Structure Your Responses</h3>
                <p>
                  Use the STAR method (Situation, Task, Action, Result) more
                  consistently to give your answers a clear structure that
                  interviewers can easily follow.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Quantify Your Achievements</h3>
                <p>
                  When discussing accomplishments, include specific metrics and
                  numbers to make your impact more concrete and memorable.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onViewDashboard}>
              Return to Dashboard
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDetailedAnalysis(true)}
                className="flex items-center gap-1"
              >
                View Detailed Analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button onClick={onStartNew}>Practice Again</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default InterviewResults;
