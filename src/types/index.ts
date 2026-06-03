export type Stage = "Lead" | "Called" | "Reached" | "Deposit";

export type Agent = {
  id: string;
  name: string;
  expertise: string[];
  languages: string[];
  created_at: string;
};

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  country: string | null;
  treatment_interest: string;
  timeline: string | null;
  message: string | null;
  stage: Stage;
  score: number | null;
  score_explanation: string | null;
  agent_id: string | null;
  assignment_reason: string | null;
};