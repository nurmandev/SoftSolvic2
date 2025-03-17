import { useState } from "react";
import InterviewDashboard from "./InterviewDashboard";
import InterviewSetup from "./InterviewSetup";
import InterviewSession from "./InterviewSession";
import InterviewResults from "./InterviewResults";

enum InterviewStage {
  DASHBOARD = "dashboard",
  SETUP = "setup",
  SESSION = "session",
  RESULTS = "results",
}

const InterviewApp = () => {
  const [currentStage, setCurrentStage] = useState<InterviewStage>(
    InterviewStage.DASHBOARD,
  );
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionTypes, setQuestionTypes] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [codeAnswers, setCodeAnswers] = useState<string[]>([]);
  const [codingLanguages, setCodingLanguages] = useState<string[]>([]);

  const navigateToDashboard = () => setCurrentStage(InterviewStage.DASHBOARD);
  const navigateToSetup = () => setCurrentStage(InterviewStage.SETUP);
  const navigateToSession = () => setCurrentStage(InterviewStage.SESSION);
  const navigateToResults = () => setCurrentStage(InterviewStage.RESULTS);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleQuestionsGenerated = (data: {
    questions: string[];
    types: string[];
  }) => {
    setQuestions(data.questions);
    setQuestionTypes(data.types);
  };

  return (
    <div className="min-h-screen bg-background">
      {currentStage === InterviewStage.DASHBOARD && (
        <InterviewDashboard
          onSelectRole={handleRoleSelect}
          onConfigureInterview={navigateToSetup}
        />
      )}

      {currentStage === InterviewStage.SETUP && (
        <InterviewSetup
          onStart={navigateToSession}
          selectedRole={selectedRole}
          onQuestionsGenerated={handleQuestionsGenerated}
        />
      )}

      {currentStage === InterviewStage.SESSION && (
        <InterviewSession
          onComplete={(
            sessionAnswers,
            sessionCodeAnswers,
            sessionLanguages,
          ) => {
            setAnswers(sessionAnswers);
            setCodeAnswers(sessionCodeAnswers);
            setCodingLanguages(sessionLanguages);
            navigateToResults();
          }}
          questions={questions}
          questionTypes={questionTypes}
        />
      )}

      {currentStage === InterviewStage.RESULTS && (
        <InterviewResults
          onStartNew={navigateToSetup}
          onViewDashboard={navigateToDashboard}
          answers={answers}
          questions={questions}
          questionTypes={questionTypes}
          codeAnswers={codeAnswers}
          codingLanguages={codingLanguages}
        />
      )}
    </div>
  );
};

export default InterviewApp;
