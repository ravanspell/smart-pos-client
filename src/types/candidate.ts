export type CandidateStatus = 'REVIEWING' | 'PROCESSING' | 'HIRED' | 'REJECTED' | 'INTERVIEWING' | 'IDLE';

export interface Project {
  description: string;
  project_title: string;
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
}

export interface WorkExperience {
  company: string;
  duration: string;
  jobTitle: string;
  responsibilities: string[];
}

export interface ResumeRecommendations {
  jobRecommendations: string[];
  resumeOptimization: string;
}

export interface ResumeStructuredData {
  skills: string[];
  projects: Project[];
  education: Education[];
  certifications: string[];
  workExperience: WorkExperience[];
}

export interface Resume {
  structuredData: ResumeStructuredData;
  recommendations: ResumeRecommendations;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentPosition: string;
  resume: Resume;
  status: CandidateStatus;
  createdAt: string;
  updatedAt: string;
} 