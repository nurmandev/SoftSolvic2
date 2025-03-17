import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Share2,
  BarChart2,
  MessageSquare,
  Clock,
  Brain,
} from "lucide-react";
import NavBar from "./NavBar";

interface InterviewAnalysisProps {
  answers?: string[];
  questions?: string[];
  questionTypes?: string[];
  codeAnswers?: string[];
  codingLanguages?: string[];
}

const InterviewAnalysis = ({
  answers = [],
  questions = [],
  questionTypes = [],
  codeAnswers = [],
  codingLanguages = [],
}: InterviewAnalysisProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for the detailed analysis
  const mockAnalysis = {
    overallScore: 78,
    metrics: {
      confidence: 82,
      clarity: 75,
      content: 80,
      pacing: 68,
      technicalAccuracy: 76,
      problemSolving: 72,
      communication: 85,
    },
    strengths: [
      "Strong communication skills with clear articulation of ideas",
      "Good problem-solving approach in technical questions",
      "Effective use of examples to illustrate points",
      "Structured responses using the STAR method for behavioral questions",
    ],
    improvements: [
      "Could provide more quantifiable results in achievement examples",
      "Technical explanations sometimes lack depth - consider adding more details",
      "Speaking pace varies - try to maintain a consistent, measured pace",
      "Some algorithm solutions could be optimized for better time complexity",
    ],
    detailedFeedback: {
      behavioral: {
        strengths:
          "Your behavioral responses demonstrate good self-awareness and reflection. You effectively use the STAR method in most answers, providing context, actions, and results.",
        improvements:
          "Consider quantifying your achievements more precisely. For example, instead of saying 'significantly improved,' specify 'improved by 35%'.",
        tips: "When discussing challenges, balance the problem description with more emphasis on your solution and learnings.",
      },
      technical: {
        strengths:
          "You demonstrate solid understanding of core technical concepts relevant to the role. Your explanations are generally clear and logical.",
        improvements:
          "Some technical explanations could benefit from more depth. Consider preparing more detailed examples of how you've applied these concepts.",
        tips: "Practice explaining technical concepts to non-technical audiences to improve clarity and communication.",
      },
      coding: {
        strengths:
          "Your code solutions work correctly for the provided test cases. You demonstrate understanding of basic algorithms and data structures.",
        improvements:
          "Some solutions could be optimized for better time or space complexity. Consider edge cases more thoroughly.",
        tips: "Practice articulating your thought process while coding. This 'thinking aloud' approach is valuable in technical interviews.",
      },
    },
    communicationAnalysis: {
      fillerWords: {
        count: 24,
        examples: ["um", "like", "you know", "sort of"],
        impact: "Moderate - occasionally disrupts flow",
      },
      paceAnalysis: {
        averageWordsPerMinute: 145,
        recommendation: "Slightly fast - consider slowing down by about 10-15%",
      },
      clarityScore: 78,
      engagementScore: 82,
    },
    technicalAssessment: {
      algorithmicThinking: 75,
      codeQuality: 72,
      problemSolvingApproach: 80,
      technicalCommunication: 78,
      optimizationAwareness: 65,
    },
    improvementPlan: [
      {
        area: "Technical Communication",
        action:
          "Practice explaining complex concepts in simple terms. Record yourself explaining a technical concept in under 2 minutes.",
        resources: [
          "Technical Communication Workshop",
          "Explaining Technical Concepts Clearly",
        ],
      },
      {
        area: "Quantifying Achievements",
        action:
          "Revise your responses to include specific metrics and numbers. Create a list of 5-7 achievements with measurable results.",
        resources: [
          "STAR Method Workshop",
          "Metrics That Matter in Interviews",
        ],
      },
      {
        area: "Algorithm Optimization",
        action:
          "Practice optimizing solutions for time and space complexity. Solve 2-3 algorithm problems weekly with focus on optimization.",
        resources: ["Advanced Algorithms Course", "Time Complexity Analysis"],
      },
    ],
  };

  return (
    <div className="bg-background min-h-screen">
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Comprehensive Interview Analysis
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Share Analysis
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-8"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Response Analysis
            </TabsTrigger>
            <TabsTrigger
              value="communication"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Communication Skills
            </TabsTrigger>
            <TabsTrigger
              value="improvement"
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              Improvement Plan
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Overall Performance</CardTitle>
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
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - mockAnalysis.overallScore / 100)}`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">
                          {mockAnalysis.overallScore}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Strong performance with room for improvement
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
                    {Object.entries(mockAnalysis.metrics).map(
                      ([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                            <span className="text-sm font-medium">
                              {value}%
                            </span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockAnalysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-amber-500 mr-2">→</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Detailed Response Analysis Tab */}
          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Question-by-Question Analysis</CardTitle>
                <CardDescription>
                  Detailed feedback on each of your responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="behavioral" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="coding">Coding</TabsTrigger>
                  </TabsList>

                  {Object.entries(mockAnalysis.detailedFeedback).map(
                    ([category, feedback]) => (
                      <TabsContent
                        key={category}
                        value={category}
                        className="space-y-4"
                      >
                        <div className="p-4 bg-muted rounded-lg">
                          <h3 className="font-medium mb-2 text-green-600">
                            Strengths:
                          </h3>
                          <p>{feedback.strengths}</p>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                          <h3 className="font-medium mb-2 text-amber-600">
                            Areas for Improvement:
                          </h3>
                          <p>{feedback.improvements}</p>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                          <h3 className="font-medium mb-2 text-blue-600">
                            Actionable Tips:
                          </h3>
                          <p>{feedback.tips}</p>
                        </div>
                      </TabsContent>
                    ),
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Skills Tab */}
          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verbal Communication Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Filler Words</h3>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span>Frequency:</span>
                          <span>
                            {
                              mockAnalysis.communicationAnalysis.fillerWords
                                .count
                            }{" "}
                            instances
                          </span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Examples:</span>
                          <span>
                            {mockAnalysis.communicationAnalysis.fillerWords.examples.join(
                              ", ",
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impact:</span>
                          <span>
                            {
                              mockAnalysis.communicationAnalysis.fillerWords
                                .impact
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Speaking Pace
                      </h3>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span>Average Pace:</span>
                          <span>
                            {
                              mockAnalysis.communicationAnalysis.paceAnalysis
                                .averageWordsPerMinute
                            }{" "}
                            words per minute
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Recommendation:</span>
                          <span>
                            {
                              mockAnalysis.communicationAnalysis.paceAnalysis
                                .recommendation
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement & Clarity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Clarity Score
                        </span>
                        <span className="text-sm font-medium">
                          {mockAnalysis.communicationAnalysis.clarityScore}%
                        </span>
                      </div>
                      <Progress
                        value={mockAnalysis.communicationAnalysis.clarityScore}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        How clearly you articulated complex ideas and concepts
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Engagement Score
                        </span>
                        <span className="text-sm font-medium">
                          {mockAnalysis.communicationAnalysis.engagementScore}%
                        </span>
                      </div>
                      <Progress
                        value={
                          mockAnalysis.communicationAnalysis.engagementScore
                        }
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        How engaging and compelling your responses were
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Technical Communication Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(mockAnalysis.technicalAssessment).map(
                    ([key, value]) => (
                      <div key={key} className="flex flex-col items-center">
                        <div className="relative h-24 w-24 flex items-center justify-center mb-2">
                          <svg className="h-full w-full" viewBox="0 0 100 100">
                            <circle
                              className="text-muted-foreground stroke-current"
                              strokeWidth="8"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                            />
                            <circle
                              className="text-blue-500 stroke-current"
                              strokeWidth="8"
                              strokeLinecap="round"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - value / 100)}`}
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">{value}</span>
                          </div>
                        </div>
                        <span className="text-sm text-center">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Improvement Plan Tab */}
          <TabsContent value="improvement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Improvement Plan</CardTitle>
                <CardDescription>
                  Actionable steps to enhance your interview performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockAnalysis.improvementPlan.map((plan, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2 text-lg">{plan.area}</h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">
                            Recommended Action:
                          </h4>
                          <p>{plan.action}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">
                            Helpful Resources:
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {plan.resources.map((resource, i) => (
                              <li key={i}>{resource}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Coach Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="italic">
                    "Based on your performance, I recommend focusing on
                    technical communication and quantifying achievements. Your
                    behavioral responses are strong, but could benefit from more
                    specific metrics. For technical questions, practice
                    explaining complex concepts in simpler terms. Consider
                    recording yourself during practice sessions to identify
                    filler words and pace issues. With targeted practice in
                    these areas, you'll likely see significant improvement in
                    your next interview."
                  </p>
                  <p className="text-right mt-2 text-sm text-muted-foreground">
                    — AI Interview Coach
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InterviewAnalysis;
