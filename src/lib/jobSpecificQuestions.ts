// Job-specific question generator

interface JobQuestionCategory {
  name: string;
  weight: number; // 1-10, higher means more questions from this category
  questions: string[];
}

interface JobProfile {
  categories: JobQuestionCategory[];
  technicalTopics?: string[];
  codingChallenges?: string[];
}

const jobProfiles: Record<string, JobProfile> = {
  "software engineer": {
    categories: [
      {
        name: "technical",
        weight: 8,
        questions: [
          "Explain the difference between a stack and a queue. When would you use one over the other?",
          "What is the time complexity of searching in a binary search tree? How does it compare to a linked list?",
          "Explain the concept of RESTful APIs and their key principles.",
          "What are the SOLID principles in object-oriented programming?",
          "Describe the difference between process and thread in operating systems.",
          "What is dependency injection and why is it useful?",
          "Explain the concept of database normalization and its benefits.",
          "What is the difference between HTTP and HTTPS?",
          "Describe the MVC architecture pattern and its components.",
          "What is the difference between synchronous and asynchronous programming?",
        ],
      },
      {
        name: "coding",
        weight: 7,
        questions: [
          "Implement a function to reverse a linked list.",
          "Write a function to check if a string is a palindrome.",
          "Implement a binary search algorithm.",
          "Write a function to find the maximum subarray sum in an array of integers.",
          "Implement a function to detect a cycle in a linked list.",
          "Write a function to validate a binary search tree.",
          "Implement a function to perform level-order traversal of a binary tree.",
          "Write a function to merge two sorted arrays into one sorted array.",
          "Implement a function to find the longest common subsequence of two strings.",
          "Write a function to implement a basic calculator that can perform addition, subtraction, multiplication, and division.",
        ],
      },
      {
        name: "behavioral",
        weight: 5,
        questions: [
          "Tell me about a time when you had to debug a complex issue. What was your approach?",
          "Describe a situation where you had to learn a new technology quickly for a project.",
          "Tell me about a time when you had to make a difficult technical decision. How did you approach it?",
          "Describe a project where you had to work with a difficult team member. How did you handle it?",
          "Tell me about a time when you had to optimize code for performance. What techniques did you use?",
          "Describe a situation where you had to explain a complex technical concept to a non-technical stakeholder.",
          "Tell me about a time when you received critical feedback on your code. How did you respond?",
          "Describe a project where you had to meet a tight deadline. How did you ensure quality while working under pressure?",
        ],
      },
      {
        name: "systemdesign",
        weight: 6,
        questions: [
          "How would you design a URL shortening service like bit.ly?",
          "Design a distributed cache system.",
          "How would you design a news feed system like Facebook or Twitter?",
          "Design a scalable web crawler.",
          "How would you design a ride-sharing service like Uber or Lyft?",
          "Design a key-value store with high availability and eventual consistency.",
          "How would you design a notification system that can handle millions of users?",
          "Design a system that can process and analyze large amounts of data in real-time.",
        ],
      },
    ],
    technicalTopics: [
      "Data Structures",
      "Algorithms",
      "System Design",
      "Database Design",
      "Web Technologies",
      "Object-Oriented Programming",
      "Design Patterns",
      "Networking",
      "Operating Systems",
      "Concurrency",
    ],
    codingChallenges: [
      "Implement a function to find all duplicate elements in an array.",
      "Write a function to determine if a string is a palindrome, considering only alphanumeric characters and ignoring case.",
      "Implement a function that merges two sorted arrays into a single sorted array.",
      "Create a function that returns the nth number in the Fibonacci sequence using an efficient approach.",
      "Write a function to find the longest substring without repeating characters.",
      "Implement a basic calculator that can perform addition, subtraction, multiplication, and division.",
      "Create a function that determines if a binary tree is balanced.",
      "Implement a function that performs a deep clone of a JavaScript object.",
    ],
  },
  "product manager": {
    categories: [
      {
        name: "behavioral",
        weight: 7,
        questions: [
          "Tell me about a time when you had to make a difficult product decision with limited data.",
          "Describe a situation where you had to prioritize features for a product. What was your approach?",
          "Tell me about a product you launched. What was your role and what challenges did you face?",
          "Describe a time when you had to say no to a feature request from an important stakeholder.",
          "Tell me about a time when you had to pivot a product strategy based on user feedback.",
          "Describe a situation where you had to work with a difficult team member. How did you handle it?",
          "Tell me about a time when you had to communicate a product vision to different teams.",
          "Describe a product failure you experienced. What did you learn from it?",
        ],
      },
      {
        name: "technical",
        weight: 5,
        questions: [
          "How do you measure the success of a product?",
          "Explain the difference between user stories, epics, and themes.",
          "What metrics would you use to evaluate the health of a subscription-based product?",
          "How do you approach A/B testing for a new feature?",
          "Explain the concept of MVP (Minimum Viable Product) and how you would determine what features to include.",
          "How do you prioritize technical debt versus new features?",
          "What tools and methodologies do you use for product roadmapping?",
          "How do you approach user research and incorporate findings into product development?",
        ],
      },
      {
        name: "productdesign",
        weight: 6,
        questions: [
          "How would you design a new feature for a ride-sharing app to improve driver retention?",
          "Design a solution to help users find and book fitness classes in their area.",
          "How would you redesign the checkout process for an e-commerce website to reduce cart abandonment?",
          "Design a new feature for a social media platform to increase user engagement.",
          "How would you design a product to help people manage their personal finances?",
          "Design a solution to help remote teams collaborate more effectively.",
          "How would you design a product to help people learn a new language?",
          "Design a solution to help people find and book appointments with healthcare providers.",
        ],
      },
      {
        name: "leadership",
        weight: 5,
        questions: [
          "Tell me about a time when you had to lead a cross-functional team to deliver a product.",
          "Describe a situation where you had to influence without authority.",
          "Tell me about a time when you had to resolve a conflict between team members.",
          "Describe a situation where you had to make a strategic decision that affected multiple teams.",
          "Tell me about a time when you had to motivate a team during a challenging project.",
          "Describe a situation where you had to provide difficult feedback to a team member.",
          "Tell me about a time when you had to advocate for user needs against business pressures.",
          "Describe a situation where you had to build consensus among stakeholders with different priorities.",
        ],
      },
    ],
  },
  "data scientist": {
    categories: [
      {
        name: "technical",
        weight: 8,
        questions: [
          "Explain the difference between supervised and unsupervised learning with examples.",
          "What is the curse of dimensionality and how does it affect machine learning models?",
          "Explain the bias-variance tradeoff in machine learning.",
          "What is the difference between L1 and L2 regularization?",
          "Explain the concept of cross-validation and why it's important.",
          "What is the difference between bagging and boosting in ensemble methods?",
          "Explain how a random forest algorithm works.",
          "What is the difference between precision and recall? When would you prioritize one over the other?",
          "Explain the concept of feature engineering and why it's important in machine learning.",
          "What is the difference between a parametric and non-parametric model?",
        ],
      },
      {
        name: "coding",
        weight: 6,
        questions: [
          "Write a function to clean and preprocess a dataset with missing values and outliers.",
          "Implement a simple linear regression algorithm from scratch.",
          "Write a function to perform k-means clustering on a dataset.",
          "Implement a function to calculate the precision, recall, and F1 score for a classification model.",
          "Write a function to perform feature selection using correlation analysis.",
          "Implement a simple neural network with one hidden layer using a deep learning framework.",
          "Write a function to perform time series forecasting using ARIMA.",
          "Implement a function to perform cross-validation for a machine learning model.",
        ],
      },
      {
        name: "behavioral",
        weight: 5,
        questions: [
          "Tell me about a data science project you worked on. What was your approach and what were the results?",
          "Describe a situation where you had to explain complex data findings to non-technical stakeholders.",
          "Tell me about a time when you had to work with incomplete or messy data. How did you handle it?",
          "Describe a situation where your data analysis led to a significant business decision.",
          "Tell me about a time when you had to optimize a model for performance or scalability.",
          "Describe a situation where you had to collaborate with engineers to deploy a model to production.",
          "Tell me about a time when your data analysis disproved a commonly held assumption.",
          "Describe a situation where you had to balance model complexity with interpretability.",
        ],
      },
      {
        name: "casestudy",
        weight: 7,
        questions: [
          "How would you design a recommendation system for an e-commerce website?",
          "Design a fraud detection system for a financial institution.",
          "How would you approach building a churn prediction model for a subscription service?",
          "Design a system to predict demand for a ride-sharing service.",
          "How would you build a sentiment analysis model for customer reviews?",
          "Design a system to optimize pricing for a hotel booking platform.",
          "How would you approach building a model to predict housing prices?",
          "Design a system to detect anomalies in network traffic for a cybersecurity company.",
        ],
      },
    ],
  },
  "ux designer": {
    categories: [
      {
        name: "behavioral",
        weight: 6,
        questions: [
          "Tell me about a UX project you're most proud of. What was your role and what challenges did you face?",
          "Describe a situation where you had to advocate for the user against business or technical constraints.",
          "Tell me about a time when you had to incorporate user feedback to improve a design.",
          "Describe a situation where you had to work with a difficult stakeholder. How did you handle it?",
          "Tell me about a time when you had to make design decisions with limited data.",
          "Describe a situation where you had to balance user needs with business goals.",
          "Tell me about a time when you had to simplify a complex user flow.",
          "Describe a situation where you had to collaborate with developers to implement a design.",
        ],
      },
      {
        name: "technical",
        weight: 7,
        questions: [
          "Explain your design process from research to implementation.",
          "How do you approach user research for a new product or feature?",
          "What methods do you use to test and validate your designs?",
          "How do you create and use personas in your design process?",
          "Explain the concept of information architecture and how you approach it.",
          "How do you ensure your designs are accessible to all users?",
          "What tools and methodologies do you use for prototyping?",
          "How do you approach responsive design for different screen sizes?",
          "Explain the concept of design systems and their benefits.",
          "How do you measure the success of a design?",
        ],
      },
      {
        name: "portfolio",
        weight: 8,
        questions: [
          "Walk me through a case study from your portfolio.",
          "Explain the problem you were trying to solve in this project.",
          "What research methods did you use and what insights did you gain?",
          "How did you iterate on your designs based on feedback?",
          "What were the key challenges in this project and how did you overcome them?",
          "How did you collaborate with other team members on this project?",
          "What metrics did you use to measure the success of this design?",
          "If you could go back, what would you do differently in this project?",
        ],
      },
      {
        name: "designchallenge",
        weight: 7,
        questions: [
          "Design a mobile app to help people track and reduce their carbon footprint.",
          "Redesign the checkout process for an e-commerce website to improve conversion rates.",
          "Design a dashboard for a healthcare provider to monitor patient data.",
          "Create a new feature for a social media platform to encourage meaningful connections.",
          "Design a solution to help elderly users navigate a complex government website.",
          "Create a user onboarding experience for a new financial app.",
          "Design a system to help users find and book appointments with service providers.",
          "Create a new interface for a smart home device that controls multiple appliances.",
        ],
      },
    ],
  },
  "marketing manager": {
    categories: [
      {
        name: "behavioral",
        weight: 6,
        questions: [
          "Tell me about a successful marketing campaign you led. What made it successful?",
          "Describe a situation where you had to pivot a marketing strategy based on data or feedback.",
          "Tell me about a time when you had to work with a limited budget. How did you maximize impact?",
          "Describe a situation where you had to target a new audience or enter a new market.",
          "Tell me about a time when you had to collaborate with other departments to achieve marketing goals.",
          "Describe a marketing failure you experienced. What did you learn from it?",
          "Tell me about a time when you had to balance short-term goals with long-term brand building.",
          "Describe a situation where you had to use data to inform a marketing decision.",
        ],
      },
      {
        name: "technical",
        weight: 7,
        questions: [
          "How do you approach market segmentation and targeting?",
          "What metrics do you use to measure the success of a marketing campaign?",
          "How do you calculate and optimize customer acquisition cost (CAC)?",
          "Explain your approach to A/B testing in marketing.",
          "How do you develop and maintain a content calendar?",
          "What tools and methodologies do you use for SEO?",
          "How do you approach marketing attribution in a multi-channel environment?",
          "Explain your process for developing a marketing budget and allocating resources.",
          "How do you approach competitive analysis?",
          "What is your methodology for pricing strategy?",
        ],
      },
      {
        name: "casestudy",
        weight: 8,
        questions: [
          "How would you launch a new product in a competitive market?",
          "Develop a marketing strategy to increase user engagement for a mobile app.",
          "How would you approach rebranding a company with a negative public perception?",
          "Design a customer retention strategy for a subscription-based service.",
          "How would you develop a marketing strategy for a B2B SaaS product?",
          "Create a social media strategy for a luxury fashion brand.",
          "How would you approach marketing a product to a global audience?",
          "Design a marketing campaign to increase brand awareness among millennials.",
        ],
      },
      {
        name: "leadership",
        weight: 5,
        questions: [
          "Tell me about a time when you had to lead a cross-functional team to achieve a marketing goal.",
          "Describe a situation where you had to mentor or develop a team member.",
          "Tell me about a time when you had to make a difficult decision that affected your team.",
          "Describe a situation where you had to resolve a conflict within your team.",
          "Tell me about a time when you had to influence without authority.",
          "Describe a situation where you had to motivate your team during a challenging project.",
          "Tell me about a time when you had to provide difficult feedback to a team member.",
          "Describe a situation where you had to build consensus among stakeholders with different priorities.",
        ],
      },
    ],
  },
};

// Helper function to normalize job title for matching
function normalizeJobTitle(title: string): string {
  return title.toLowerCase().trim();
}

// Function to find the closest matching job profile
function findMatchingJobProfile(jobTitle: string): JobProfile | null {
  const normalizedTitle = normalizeJobTitle(jobTitle);

  // Direct match
  if (jobProfiles[normalizedTitle]) {
    return jobProfiles[normalizedTitle];
  }

  // Partial match
  for (const [key, profile] of Object.entries(jobProfiles)) {
    if (normalizedTitle.includes(key) || key.includes(normalizedTitle)) {
      return profile;
    }
  }

  // Default to software engineer if no match found
  return jobProfiles["software engineer"];
}

// Main function to generate job-specific questions
export function generateJobSpecificQuestions(
  jobTitle: string,
  count: number = 5,
  preferredCategories: string[] = [],
): { questions: string[]; types: string[] } {
  const jobProfile = findMatchingJobProfile(jobTitle);

  if (!jobProfile) {
    // Fallback to generic questions if no profile found
    return {
      questions: [
        "Tell me about yourself and your background.",
        "What are your strengths and weaknesses?",
        "Why are you interested in this role?",
        "Where do you see yourself in 5 years?",
        "Describe a challenging situation you faced at work and how you handled it.",
      ],
      types: Array(5).fill("behavioral"),
    };
  }

  // Filter categories based on preferred categories if specified
  let availableCategories = jobProfile.categories;
  if (preferredCategories.length > 0) {
    availableCategories = jobProfile.categories.filter((category) =>
      preferredCategories.includes(category.name),
    );

    // If no categories match, fall back to all categories
    if (availableCategories.length === 0) {
      availableCategories = jobProfile.categories;
    }
  }

  // Calculate total weight for weighted random selection
  const totalWeight = availableCategories.reduce(
    (sum, category) => sum + category.weight,
    0,
  );

  const questions: string[] = [];
  const types: string[] = [];

  // Select questions based on category weights
  while (questions.length < count) {
    // Weighted random selection of category
    let randomWeight = Math.random() * totalWeight;
    let selectedCategory = availableCategories[0];

    for (const category of availableCategories) {
      randomWeight -= category.weight;
      if (randomWeight <= 0) {
        selectedCategory = category;
        break;
      }
    }

    // Get unused questions from this category
    const unusedQuestions = selectedCategory.questions.filter(
      (question) => !questions.includes(question),
    );

    if (unusedQuestions.length > 0) {
      // Select a random question from unused questions
      const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
      const selectedQuestion = unusedQuestions[randomIndex];

      questions.push(selectedQuestion);
      types.push(selectedCategory.name);
    } else if (questions.length === 0) {
      // If we can't find any unused questions and we haven't added any yet,
      // just add a used one to avoid infinite loop
      const randomIndex = Math.floor(
        Math.random() * selectedCategory.questions.length,
      );
      questions.push(selectedCategory.questions[randomIndex]);
      types.push(selectedCategory.name);
    } else {
      // If this category has no unused questions, try again with a different category
      continue;
    }
  }

  return { questions, types };
}

// Function to get technical topics for a specific job
export function getJobTechnicalTopics(jobTitle: string): string[] {
  const jobProfile = findMatchingJobProfile(jobTitle);
  return jobProfile?.technicalTopics || [];
}

// Function to get coding challenges for a specific job
export function getJobCodingChallenges(jobTitle: string): string[] {
  const jobProfile = findMatchingJobProfile(jobTitle);
  return jobProfile?.codingChallenges || [];
}
