export interface Event {
  id: string
  church_id: string
  title: string
  description: string | null
  date: string
  start_time: string
  end_time: string | null
  location: string | null
  image_url: string | null
  category: string | null
  max_capacity: number | null
  status: 'draft' | 'published' | 'canceled'
  created_at: string
  updated_at: string
}

export interface EventRegistration {
  id: string
  event_id: string
  user_id: string
  status: 'confirmed' | 'waitlist' | 'canceled'
  created_at: string
}
