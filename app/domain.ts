export type AppView = 'dashboard' | 'new-session' | 'workspace' | 'profile' | 'integrations' | 'guide';
export type WorkspaceTab = 'sources' | 'synthesis' | 'discover' | 'connect' | 'compose';
export type SessionMode = 'material_led' | 'assignment_led';
export type SourceRole = 'Anchor' | 'Foundation' | 'Supporting' | 'Alternative' | 'Contradictory' | 'Context';
export type VerificationStatus = 'verified' | 'partial' | 'warning' | 'unverified';
export type CandidateStatus = 'candidate' | 'use' | 'reject' | 'later';

export interface ResearchSource {
  id: string;
  short: string;
  title: string;
  authors: string;
  year: number;
  type: 'article' | 'book' | 'book_chapter' | 'review' | 'report';
  origin: 'upload' | 'zotero' | 'discovery';
  role: SourceRole;
  importance: number;
  verification: VerificationStatus;
  verificationLabel: string;
  locked: boolean;
  pages?: number;
  selectedChapters?: string[];
  insight: {
    question: string;
    argument: string;
    framework: string;
    method: string;
    contribution: string;
    limitation: string;
  };
}

export interface Relation {
  id: string;
  from: string;
  to: string;
  type: string;
  basis: 'DIRECT_TEXTUAL_ENGAGEMENT' | 'DIRECT_CITATION' | 'STRUCTURED_COMPARISON' | 'SEMANTIC_SIMILARITY';
  evidence: string;
  confidence: 'High' | 'Medium' | 'Low';
  locked: boolean;
}

export interface Candidate {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  match: number;
  anchor: number;
  verification: VerificationStatus;
  reason: string[];
  relation: string;
  status: CandidateStatus;
  zotero: boolean;
  relevanceRating: number;
  importanceRating: number;
}

export interface ConnectionBlock {
  id: string;
  label: string;
  helper: string;
  value: string;
  locked: boolean;
}

export interface WorkspaceState {
  sessionTitle: string;
  researchQuestion: string;
  assignmentConfirmed: boolean;
  sources: ResearchSource[];
  relations: Relation[];
  candidates: Candidate[];
  connections: ConnectionBlock[];
  activeTracks: string[];
  argumentApproved: boolean;
  argumentThesis: string;
  generatedQuick: boolean;
  generatedFull: boolean;
  zoteroConnected: boolean;
}
