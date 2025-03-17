// DeepSeek API integration

interface DeepSeekResponse {
  questions: string[];
  feedback?: string;
}

export async function generateInterviewQuestions(
  role: string,
  difficulty: number = 3,
  count: number = 5,
  categories: string[] = ["behavioral", "technical", "coding"],
  resumeText?: string,
  industry?: string,
  language: string = "en",
): Promise<{ questions: string[]; types: string[] }> {
  try {
    const apiKey =
      import.meta.env.VITE_DEEPSEEK_API_KEY ||
      localStorage.getItem("deepseekApiKey");

    if (!apiKey) {
      throw new Error("DeepSeek API key not found");
    }

    // Add randomization seed and timestamp to ensure different questions each time
    const randomSeed = Math.floor(Math.random() * 10000);
    const timestamp = new Date().getTime();

    // Language instructions
    const languageInstructions =
      language !== "en"
        ? `Generate all questions in ${getLanguageName(language)} language. `
        : ``;

    let prompt = `[Seed: ${randomSeed}-${timestamp}] ${languageInstructions}Generate ${count} COMPLETELY UNIQUE and DIVERSE interview questions for a ${role} role${industry ? ` in the ${industry} industry` : ""}. The difficulty level is ${difficulty}/5. Include questions from the following categories: ${categories.join(", ")}.

IMPORTANT: Each question MUST be different from standard interview questions. Be creative and specific to the ${role} role. DO NOT use generic questions that appear in typical interview guides.

If coding questions are included, provide clear Data Structures and Algorithms problems with specific requirements. For technical questions, make them relevant to the ${role} role.

Ensure questions are varied, randomized, and not repetitive. Each time this prompt is run, generate completely different questions than before. For each question, specify the type as one of: ${categories.join(", ")}. Return exactly ${count} questions total.`;

    // If resume is provided, add it to the prompt for personalized questions
    if (resumeText) {
      prompt += `\n\nHere is the candidate's resume:\n${resumeText}\n\nGenerate questions that are specifically tailored to the candidate's experience, skills, and background. Ask about specific projects, technologies, and achievements mentioned in the resume.`;
    }

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are an expert interviewer who creates high-quality interview questions for job candidates.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return {
      questions: content.questions || [],
      types:
        content.types ||
        Array(content.questions?.length || 0).fill("behavioral"),
    };
  } catch (error) {
    console.error("Error generating interview questions:", error);
    // Generate more varied fallback questions based on role and categories
    const fallbackQuestions = generateFallbackQuestions(role, categories);
    return {
      questions: fallbackQuestions.questions,
      types: fallbackQuestions.types,
    };
  }
}

// Generate diverse fallback questions if API fails
function generateFallbackQuestions(
  role: string,
  categories: string[],
): { questions: string[]; types: string[] } {
  const behavioralQuestions = [
    `Tell me about a challenging situation you faced as a ${role} and how you resolved it.`,
    `Describe a time when you had to make a difficult decision in your role as a ${role}.`,
    `Share an example of when you had to adapt quickly to changes in a project as a ${role}.`,
    `How have you handled disagreements with team members or stakeholders in your ${role} position?`,
    `What's the most innovative solution you've implemented as a ${role}?`,
    `Describe a situation where you had to work under pressure to meet a deadline in your ${role} work.`,
    `Tell me about a time you received critical feedback as a ${role} and how you responded to it.`,
    `How have you prioritized competing tasks and responsibilities in your ${role} position?`,
  ];

  const technicalQuestions = [
    `What technical skills do you consider most important for a ${role} and why?`,
    `How do you stay updated with the latest technologies and methodologies relevant to the ${role} position?`,
    `Describe a technical challenge you encountered as a ${role} and how you solved it.`,
    `What tools or frameworks do you find most effective in your work as a ${role}?`,
    `How would you explain a complex technical concept to a non-technical stakeholder?`,
    `What's your approach to debugging a complex issue in a ${role} context?`,
    `How do you ensure code quality and maintainability in your projects as a ${role}?`,
    `Describe your experience with [technology relevant to ${role}] and how you've applied it.`,
  ];

  const codingQuestions = [
    `Implement a function that finds all duplicate elements in an array.`,
    `Write a function to determine if a string is a palindrome, considering only alphanumeric characters and ignoring case.`,
    `Implement a function that merges two sorted arrays into a single sorted array.`,
    `Create a function that returns the nth number in the Fibonacci sequence using an efficient approach.`,
    `Write a function to find the longest substring without repeating characters.`,
    `Implement a basic calculator that can perform addition, subtraction, multiplication, and division.`,
    `Create a function that determines if a binary tree is balanced.`,
    `Implement a function that performs a deep clone of a JavaScript object.`,
  ];

  const leadershipQuestions = [
    `Describe your leadership style and how it has evolved in your role as a ${role}.`,
    `Tell me about a time when you had to lead a team through a difficult situation.`,
    `How do you motivate team members who are struggling with their tasks?`,
    `Describe a situation where you had to provide constructive feedback to a team member.`,
    `How have you handled conflicts within your team?`,
    `Tell me about a time when you had to make an unpopular decision as a leader.`,
    `How do you delegate responsibilities effectively?`,
    `Describe how you've mentored or developed someone on your team.`,
  ];

  // Shuffle arrays to get random questions
  const shuffle = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const questionMap: Record<string, string[]> = {
    behavioral: shuffle(behavioralQuestions),
    technical: shuffle(technicalQuestions),
    coding: shuffle(codingQuestions),
    leadership: shuffle(leadershipQuestions),
    problemsolving: shuffle([
      `Describe a complex problem you solved as a ${role}.`,
      `How do you approach breaking down large problems into manageable tasks?`,
      `Tell me about a time when you had to think outside the box to solve an issue.`,
      `How do you validate your solutions to problems?`,
    ]),
    communication: shuffle([
      `How do you ensure effective communication across different teams?`,
      `Describe a situation where your communication skills helped resolve a conflict.`,
      `How do you tailor your communication style for different audiences?`,
      `Tell me about a time when miscommunication led to a problem and how you fixed it.`,
    ]),
    teamwork: shuffle([
      `Describe your role in a successful team project.`,
      `How do you contribute to creating a positive team environment?`,
      `Tell me about a time when you had to work with someone difficult.`,
      `How do you ensure everyone's voice is heard in a team setting?`,
    ]),
    projectmanagement: shuffle([
      `How do you track progress on projects you manage?`,
      `Describe how you handle scope changes in the middle of a project.`,
      `How do you prioritize tasks when managing multiple projects?`,
      `Tell me about a project that didn't go as planned and how you handled it.`,
    ]),
    systemdesign: shuffle([
      `Describe how you would design a scalable system for [relevant to role].`,
      `How do you approach making architectural decisions?`,
      `Describe a system you designed and the trade-offs you considered.`,
      `How do you ensure reliability and performance in your system designs?`,
    ]),
    cultural: shuffle([
      `How do you contribute to a positive work culture?`,
      `Describe how you've adapted to different company cultures in your career.`,
      `What type of work environment brings out your best performance?`,
      `How do you handle situations that conflict with your values?`,
    ]),
  };

  // Select questions based on categories
  const questions: string[] = [];
  const types: string[] = [];

  // Ensure we have at least one question from each requested category
  for (const category of categories) {
    if (questionMap[category] && questionMap[category].length > 0) {
      questions.push(questionMap[category][0]);
      types.push(category);
      // Remove the used question
      questionMap[category] = questionMap[category].slice(1);
    }
  }

  // Fill remaining slots with random questions from the categories
  const remainingSlots = 5 - questions.length;
  if (remainingSlots > 0) {
    const availableCategories = categories.filter(
      (c) => questionMap[c] && questionMap[c].length > 0,
    );

    for (let i = 0; i < remainingSlots && availableCategories.length > 0; i++) {
      const randomCategoryIndex = Math.floor(
        Math.random() * availableCategories.length,
      );
      const category = availableCategories[randomCategoryIndex];

      if (questionMap[category] && questionMap[category].length > 0) {
        questions.push(questionMap[category][0]);
        types.push(category);
        questionMap[category] = questionMap[category].slice(1);

        // Remove category if no more questions available
        if (questionMap[category].length === 0) {
          availableCategories.splice(randomCategoryIndex, 1);
        }
      }
    }
  }

  // If we still don't have enough questions, add some behavioral ones
  while (questions.length < 5) {
    if (behavioralQuestions.length > 0) {
      questions.push(behavioralQuestions[0]);
      types.push("behavioral");
      behavioralQuestions.shift();
    } else {
      // Fallback if we've used all behavioral questions
      questions.push(`Tell me about your experience as a ${role}.`);
      types.push("behavioral");
    }
  }

  return { questions, types };
}

function getLanguageName(langCode: string): string {
  const languages: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    zh: "Chinese",
    ja: "Japanese",
    hi: "Hindi",
    ar: "Arabic",
    pt: "Portuguese",
    ru: "Russian",
  };
  return languages[langCode] || "English";
}

export async function generateFeedback(
  question: string,
  answer: string,
  language: string = "en",
): Promise<string> {
  try {
    const apiKey =
      import.meta.env.VITE_DEEPSEEK_API_KEY ||
      localStorage.getItem("deepseekApiKey");

    if (!apiKey) {
      throw new Error("DeepSeek API key not found");
    }

    // Language instructions for feedback
    const languageInstructions =
      language !== "en"
        ? `Provide feedback in ${getLanguageName(language)} language. `
        : ``;

    // Add randomization to ensure different feedback analysis each time
    const randomSeed = Math.floor(Math.random() * 10000);
    const timestamp = new Date().getTime();

    const prompt = `[Analysis ID: ${randomSeed}-${timestamp}]\n\nQuestion: ${question}\n\nAnswer: ${answer}\n\n${languageInstructions}Analyze this specific answer in detail and provide personalized constructive feedback. Your analysis should include:\n\n1. Specific strengths of this particular answer (with examples from their response)\n2. Areas for improvement unique to this answer (with specific suggestions)\n3. Content relevance assessment (how well did they address the specific question)\n4. Structure and clarity evaluation\n5. Delivery suggestions\n\nAvoid generic feedback. Focus on what makes THIS answer unique and provide tailored recommendations.`;

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are an expert interview coach who provides helpful, constructive feedback on interview responses.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "text" },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating feedback:", error);
    // Generate more personalized fallback feedback
    const feedbackOptions = [
      "Your answer addressed the question, but could benefit from more specific examples. Consider using the STAR method (Situation, Task, Action, Result) to structure your response more effectively.",
      "You made some good points in your answer. To strengthen it further, try quantifying your achievements with specific metrics or results where possible.",
      "Your response shows your experience, but could be more concise. Try focusing on the most relevant aspects of your experience that directly answer the question.",
      "You demonstrated good technical knowledge. To improve, consider explaining how your technical skills translated to business impact or team success.",
      "Your answer was thoughtful, but could benefit from better structure. Start with a brief overview, then provide details, and end with a concise summary of your main point.",
    ];

    // Return a random feedback option
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }
}
