export interface CodeSection {
  title: string;
  lines: string;
  codeBlock: string;
  explanation: string;
  details: string[];
}

export interface DataFlowStep {
  source: string;
  operation: string;
  destination: string;
  description: string;
}

export interface ComplexityData {
  timeComplexity: string;
  timeExplanation: string;
  spaceComplexity: string;
  spaceExplanation: string;
  worstCaseTime?: string;
  worstCaseTimeExplanation?: string;
}

export interface CodeIssue {
  severity: "critical" | "warning" | "info";
  type: string;
  location: string;
  description: string;
  suggestion: string;
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface MentorAnalysis {
  language: string;
  purpose: string;
  isIncomplete: boolean;
  missingElements: string[];
  sections: CodeSection[];
  dataFlow: DataFlowStep[];
  complexity: ComplexityData;
  issues: CodeIssue[];
  bestPractices: string[];
  improvedCode: string;
  improvedCodeExplanation: string;
  interviewQuestions?: InterviewQuestion[];
  finalSummary: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  message: string;
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  code: string;
  language: string;
  style: string;
  mode: string;
  timestamp: string;
  analysis: MentorAnalysis;
}
