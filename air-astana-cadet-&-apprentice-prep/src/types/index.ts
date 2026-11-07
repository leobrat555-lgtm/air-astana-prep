export type ProgramTrack = 'ab-initio' | 'apprentice';

export type ActiveModule = 'examiner' | 'dashboard' | 'stages' | 'english' | 'psychometrics' | 'cognitive' | 'interview';

export type LanguageMode = 'en' | 'ru';

export interface AviationFact {
  id: string;
  track: ProgramTrack | 'both';
  badgeCategory: string;
  title: string;
  snippet: string;
  deepTheory: string;
  formulaOrRule?: string;
  blitzQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface SelectionStage {
  id: string;
  stepNumber: number;
  title: string;
  shortDescription: string;
  fullRequirements: string[];
  keyCompetencies: string[];
  documentsNeeded?: string[];
  airAstanaAdvice: string;
  actionModule?: ActiveModule;
  actionLabel?: string;
}

export interface Question {
  id: string;
  track: ProgramTrack | 'both';
  module: 'english' | 'psychometrics' | 'cognitive' | 'interview';
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  contextPassage?: string;
  diagramType?: 'chart' | 'gauge' | 'cube' | 'circuit' | 'gear' | 'hydraulic' | 'table' | 'audio-transcript' | 'amm';
  diagramData?: Record<string, any>;
  options: string[];
  correctAnswerIndex: number;
  explanationEn: string;
  explanationRu: string;
  formulaShortcut?: string;
  timeLimitSeconds?: number;
}

export interface UserAttempt {
  questionId: string;
  category: string;
  module: string;
  track: ProgramTrack;
  selectedOptionIndex: number;
  correctAnswerIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: number;
}

export interface InterviewScenario {
  id: string;
  track: ProgramTrack;
  title: string;
  competency: string;
  question: string;
  context: string;
  tips: string[];
  sampleStarBullets: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface GroupExerciseScenario {
  id: string;
  track: ProgramTrack;
  title: string;
  background: string;
  objective: string;
  constraints: string[];
  options: {
    id: string;
    title: string;
    risk: 'Low' | 'Medium' | 'High';
    pros: string[];
    cons: string[];
  }[];
}

export interface MedicalChecklistItem {
  id: string;
  category: string;
  title: string;
  requirement: string;
  status: 'pending' | 'cleared' | 'caution';
  notes: string;
}

export interface PracticalBenchTask {
  id: string;
  title: string;
  component: string;
  ataChapter: string;
  instruction: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  safetyCheck: string;
}
