export type TriageColor = 'green' | 'yellow' | 'red'
export type CareCaseStatus = 'open' | 'in_progress' | 'resolved' | 'escalated'

export interface TriageAssessment {
  id: string
  care_case_id: string
  classification: TriageColor
  summary: string
  risk_indicators: string[]
  ai_confidence: number
  reviewed_by_human: boolean
  created_at: string
}

export interface CareCase {
  id: string
  church_id: string
  user_id: string
  assigned_to: string | null
  status: CareCaseStatus
  priority: TriageColor
  subject: string
  description: string
  created_at: string
  updated_at: string
}

export interface CareCaseMessage {
  id: string
  care_case_id: string
  sender_id: string
  content: string
  is_from_ai: boolean
  created_at: string
}

export interface CareAssignment {
  id: string
  care_case_id: string
  assigned_to: string
  assigned_by: string
  reason: string | null
  created_at: string
}
