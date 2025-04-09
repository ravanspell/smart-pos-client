export type CandidateStatus = 'IDLE' | 'REVIEWING';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  status: CandidateStatus;
  resumeUrl: string;
  createdAt: string;
  updatedAt: string;
} 