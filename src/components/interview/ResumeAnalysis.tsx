import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResumeAnalysisProps {
  resumeText: string;
}

const ResumeAnalysis = ({ resumeText }: ResumeAnalysisProps) => {
  const [activeTab, setActiveTab] = useState("skills");

  // Mock analysis data - in a real app, this would come from AI analysis
  const mockAnalysis = {
    skills: [
      { name: "JavaScript", level: "Expert", relevance: "high" },
      { name: "React", level: "Advanced", relevance: "high" },
      { name: "TypeScript", level: "Intermediate", relevance: "medium" },
      { name: "Node.js", level: "Advanced", relevance: "high" },
      { name: "Python", level: "Beginner", relevance: "low" },
      { name: "SQL", level: "Intermediate", relevance: "medium" },
      { name: "AWS", level: "Intermediate", relevance: "medium" },
      { name: "Docker", level: "Beginner", relevance: "low" },
    ],
    experience: [
      {
        company: "Tech Solutions Inc.",
        role: "Senior Frontend Developer",
        duration: "2 years",
        highlights: [
          "Led a team of 5 developers",
          "Improved application performance by 40%",
          "Implemented CI/CD pipeline",
        ],
      },
      {
        company: "Digital Innovations",
        role: "Full Stack Developer",
        duration: "3 years",
        highlights: [
          "Developed RESTful APIs",
          "Migrated legacy system to React",
          "Reduced server costs by 30%",
        ],
      },
    ],
    projects: [
      {
        name: "E-commerce Platform",
        technologies: ["React", "Node.js", "MongoDB"],
        description:
          "Built a scalable e-commerce platform with payment integration",
      },
      {
        name: "Analytics Dashboard",
        technologies: ["TypeScript", "D3.js", "Firebase"],
        description:
          "Created a real-time analytics dashboard for marketing teams",
      },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Technology",
        year: "2018",
      },
    ],
    gaps: [
      "Limited experience with mobile development",
      "No formal project management certification",
      "Gap in employment between 2019-2020",
    ],
  };

  const getBadgeColor = (relevance: string) => {
    switch (relevance) {
      case "high":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "low":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume Analysis</CardTitle>
          <CardDescription>
            AI-powered insights from your uploaded resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="skills"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="gaps">Gaps</TabsTrigger>
            </TabsList>

            <TabsContent value="skills" className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {mockAnalysis.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={getBadgeColor(skill.relevance)}
                  >
                    {skill.name} - {skill.level}
                  </Badge>
                ))}
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Legend:</h4>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800"
                  >
                    High Relevance
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    Medium Relevance
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-800"
                  >
                    Low Relevance
                  </Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              {mockAnalysis.experience.map((exp, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{exp.role}</CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {exp.duration}
                      </span>
                    </div>
                    <CardDescription>{exp.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              {mockAnalysis.projects.map((project, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, i) => (
                        <Badge key={i} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              {mockAnalysis.education.map((edu, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{edu.degree}</CardTitle>
                    <CardDescription>
                      {edu.institution}, {edu.year}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="gaps" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Areas for Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {mockAnalysis.gaps.map((gap, index) => (
                      <li key={index}>{gap}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeAnalysis;
