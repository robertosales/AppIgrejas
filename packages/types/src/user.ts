export type AppRole =
  | 'super_admin'
  | 'church_admin'
  | 'pastor'
  | 'leader'
  | 'care_team'
  | 'secretary'
  | 'finance'
  | 'member'
  | 'visitor'

export interface ChurchUser {
  id: string
  church_id: string
  user_id: string
  role: AppRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}
