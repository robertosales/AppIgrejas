export interface Ministry {
  id: string
  church_id: string
  name: string
  description: string | null
  leader_id: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Group {
  id: string
  church_id: string
  ministry_id: string | null
  name: string
  description: string | null
  meeting_schedule: string | null
  location: string | null
  max_capacity: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: 'leader' | 'member'
  joined_at: string
}
