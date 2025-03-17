// Personality insights analyzer

export interface PersonalityTrait {
  name: string;
  score: number; // 0-100
  description: string;
  strengths: string[];
  improvements: string[];
}

export interface PersonalityProfile {
  dominantTraits: string[];
  traits: PersonalityTrait[];
  summary: string;
  interviewTips: string[];
}

// Mock personality analysis function
// In a real implementation, this would use NLP and ML to analyze responses
export function analyzePersonality(answers: string[]): PersonalityProfile {
  // Combine all answers for analysis
  const combinedText = answers.join(" ").toLowerCase();

  // Initialize trait scores
  const traitScores: Record<string, number> = {
    analytical: 50,
    creative: 50,
    detail_oriented: 50,
    leadership: 50,
    teamwork: 50,
    communication: 50,
    adaptability: 50,
    problem_solving: 50,
    confidence: 50,
    empathy: 50,
  };

  // Simple keyword-based analysis
  // This is a very simplified approach - a real implementation would use more sophisticated NLP
  const keywordPatterns = {
    analytical: [
      "analyze",
      "data",
      "logical",
      "research",
      "evaluate",
      "assessment",
      "metrics",
      "systematic",
      "objective",
      "rational",
    ],
    creative: [
      "creative",
      "innovative",
      "design",
      "new ideas",
      "imagination",
      "artistic",
      "unique",
      "original",
      "brainstorm",
      "vision",
    ],
    detail_oriented: [
      "detail",
      "thorough",
      "precise",
      "accurate",
      "meticulous",
      "organized",
      "careful",
      "methodical",
      "exact",
      "specific",
    ],
    leadership: [
      "lead",
      "manage",
      "direct",
      "guide",
      "influence",
      "motivate",
      "inspire",
      "vision",
      "strategy",
      "decision",
    ],
    teamwork: [
      "team",
      "collaborate",
      "together",
      "cooperation",
      "collective",
      "partnership",
      "joint",
      "group",
      "support",
      "assist",
    ],
    communication: [
      "communicate",
      "explain",
      "articulate",
      "present",
      "discuss",
      "convey",
      "express",
      "clarify",
      "dialogue",
      "conversation",
    ],
    adaptability: [
      "adapt",
      "flexible",
      "adjust",
      "change",
      "versatile",
      "resilient",
      "agile",
      "pivot",
      "responsive",
      "dynamic",
    ],
    problem_solving: [
      "solve",
      "solution",
      "resolve",
      "address",
      "fix",
      "troubleshoot",
      "overcome",
      "tackle",
      "approach",
      "strategy",
    ],
    confidence: [
      "confident",
      "certain",
      "assured",
      "self-assured",
      "conviction",
      "decisive",
      "assertive",
      "bold",
      "strong",
      "sure",
    ],
    empathy: [
      "understand",
      "perspective",
      "feelings",
      "compassion",
      "empathize",
      "listen",
      "care",
      "sensitive",
      "considerate",
      "supportive",
    ],
  };

  // Count keyword occurrences and adjust scores
  Object.entries(keywordPatterns).forEach(([trait, keywords]) => {
    let matchCount = 0;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = combinedText.match(regex);
      if (matches) {
        matchCount += matches.length;
      }
    });

    // Adjust score based on keyword matches
    if (matchCount > 0) {
      // Simple formula to adjust score - can be refined
      traitScores[trait] += Math.min(matchCount * 5, 40); // Cap the increase at 40 points
    }
  });

  // Analyze sentence structure and length for additional insights
  const sentences = combinedText
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0);
  const avgSentenceLength =
    sentences.reduce((sum, s) => sum + s.trim().length, 0) / sentences.length;

  // Longer sentences might indicate stronger communication skills
  if (avgSentenceLength > 20) {
    traitScores.communication += 10;
  }

  // Check for first-person pronouns as indicator of confidence
  const firstPersonCount = (
    combinedText.match(/\bi\b|\bme\b|\bmy\b|\bmyself\b/gi) || []
  ).length;
  const wordCount = combinedText.split(/\s+/).length;
  const firstPersonRatio = firstPersonCount / wordCount;

  if (firstPersonRatio > 0.05) {
    traitScores.confidence += 10;
  }

  // Ensure scores are within 0-100 range
  Object.keys(traitScores).forEach((trait) => {
    traitScores[trait] = Math.max(0, Math.min(100, traitScores[trait]));
  });

  // Create personality traits with descriptions
  const traits: PersonalityTrait[] = [
    {
      name: "Analytical Thinking",
      score: traitScores.analytical,
      description:
        "Your ability to examine information or situations methodically, breaking them down into components, and evaluating them logically.",
      strengths: [
        "Strong data-driven decision making",
        "Ability to identify patterns and insights",
        "Logical approach to problem-solving",
      ],
      improvements: [
        "Balance analysis with intuition when appropriate",
        "Communicate analytical findings in accessible ways",
        "Don't get lost in details at the expense of the big picture",
      ],
    },
    {
      name: "Creativity",
      score: traitScores.creative,
      description:
        "Your ability to generate original ideas, think outside conventional frameworks, and develop innovative solutions.",
      strengths: [
        "Innovative approach to challenges",
        "Ability to envision new possibilities",
        "Thinking beyond conventional solutions",
      ],
      improvements: [
        "Balance creativity with practicality",
        "Structure your creative process for better outcomes",
        "Communicate the value of creative solutions to stakeholders",
      ],
    },
    {
      name: "Detail Orientation",
      score: traitScores.detail_oriented,
      description:
        "Your capacity to pay close attention to small elements and ensure accuracy and thoroughness in your work.",
      strengths: [
        "Thorough and precise work output",
        "Ability to catch errors and inconsistencies",
        "Methodical approach to tasks",
      ],
      improvements: [
        "Balance attention to detail with efficiency",
        "Don't lose sight of the bigger picture",
        "Develop systems to manage details without becoming overwhelmed",
      ],
    },
    {
      name: "Leadership",
      score: traitScores.leadership,
      description:
        "Your ability to guide, influence, and inspire others toward achieving goals and objectives.",
      strengths: [
        "Ability to motivate and inspire teams",
        "Strategic vision and direction-setting",
        "Decision-making capabilities",
      ],
      improvements: [
        "Develop a more inclusive leadership style",
        "Balance directing with empowering others",
        "Improve delegation skills",
      ],
    },
    {
      name: "Teamwork",
      score: traitScores.teamwork,
      description:
        "Your ability to collaborate effectively with others, contribute to group efforts, and support collective goals.",
      strengths: [
        "Collaborative approach to projects",
        "Supportive of team members",
        "Ability to leverage diverse perspectives",
      ],
      improvements: [
        "Balance team consensus with timely decision-making",
        "Improve conflict resolution within teams",
        "Develop strategies for working with different personality types",
      ],
    },
    {
      name: "Communication",
      score: traitScores.communication,
      description:
        "Your ability to convey information clearly, listen effectively, and adapt your communication style to different audiences.",
      strengths: [
        "Clear and articulate expression of ideas",
        "Ability to tailor communication to the audience",
        "Active listening skills",
      ],
      improvements: [
        "Practice more concise communication",
        "Improve non-verbal communication awareness",
        "Develop storytelling techniques for more engaging communication",
      ],
    },
    {
      name: "Adaptability",
      score: traitScores.adaptability,
      description:
        "Your ability to adjust to new conditions, handle change effectively, and remain flexible in various situations.",
      strengths: [
        "Flexibility in changing circumstances",
        "Openness to new approaches and ideas",
        "Resilience in the face of challenges",
      ],
      improvements: [
        "Develop strategies for managing stress during change",
        "Balance adaptability with consistency where needed",
        "Improve anticipation of potential changes",
      ],
    },
    {
      name: "Problem Solving",
      score: traitScores.problem_solving,
      description:
        "Your ability to identify issues, develop solutions, and implement effective resolutions to challenges.",
      strengths: [
        "Methodical approach to addressing challenges",
        "Creative solution development",
        "Persistence in resolving complex issues",
      ],
      improvements: [
        "Consider a wider range of potential solutions",
        "Improve root cause analysis techniques",
        "Balance quick fixes with sustainable solutions",
      ],
    },
    {
      name: "Confidence",
      score: traitScores.confidence,
      description:
        "Your self-assurance, conviction in your abilities, and comfort in expressing your views and taking action.",
      strengths: [
        "Self-assured presentation style",
        "Willingness to take on challenges",
        "Ability to make decisions with conviction",
      ],
      improvements: [
        "Balance confidence with openness to feedback",
        "Develop strategies for situations that challenge your confidence",
        "Practice authentic confidence rather than overcompensation",
      ],
    },
    {
      name: "Empathy",
      score: traitScores.empathy,
      description:
        "Your ability to understand others' perspectives, recognize their feelings, and respond appropriately to their needs.",
      strengths: [
        "Strong understanding of others' perspectives",
        "Ability to build rapport and trust",
        "Sensitivity to team dynamics and individual needs",
      ],
      improvements: [
        "Balance empathy with necessary directness",
        "Develop boundaries to prevent emotional exhaustion",
        "Translate empathetic understanding into effective action",
      ],
    },
  ];

  // Sort traits by score to identify dominant traits
  const sortedTraits = [...traits].sort((a, b) => b.score - a.score);
  const dominantTraits = sortedTraits.slice(0, 3).map((t) => t.name);

  // Generate summary based on dominant traits
  let summary = `Your responses indicate that you have particularly strong ${dominantTraits[0]} and ${dominantTraits[1]} traits. `;
  summary += `You communicate in a way that demonstrates ${sortedTraits[0].name.toLowerCase()} and ${sortedTraits[1].name.toLowerCase()}. `;

  // Add insights about potential growth areas
  const lowestTraits = sortedTraits.slice(-2);
  summary += `You might benefit from developing your ${lowestTraits[0].name.toLowerCase()} and ${lowestTraits[1].name.toLowerCase()} skills further.`;

  // Generate interview tips based on the profile
  const interviewTips = [
    `Leverage your strong ${dominantTraits[0]} when answering questions about your work style and achievements.`,
    `Be prepared to discuss situations that required ${lowestTraits[0].name.toLowerCase()}, as interviewers may probe this area.`,
    `Use specific examples that highlight your ${dominantTraits[1]} when discussing past experiences.`,
    `Consider how your ${dominantTraits[0]} might be perceived - ensure you're presenting it as a balanced strength.`,
    `Prepare stories that demonstrate how you've worked to improve your ${lowestTraits[0].name.toLowerCase()} in professional settings.`,
  ];

  return {
    dominantTraits,
    traits,
    summary,
    interviewTips,
  };
}
