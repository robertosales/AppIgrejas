export type PrayerRequestStatus = 'active' | 'answered' | 'archived'
export type PrayerPrivacy = 'public' | 'private'

export interface PrayerRequest {
  id: string
  church_id: string
  user_id: string
  title: string
  content: string
  status: PrayerRequestStatus
  privacy: PrayerPrivacy
  is_anonymous: boolean
  created_at: string
  updated_at: string
}
