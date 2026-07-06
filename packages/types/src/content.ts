export type ContentType = 'sermon' | 'article' | 'devotional' | 'video' | 'audio'
export type ContentStatus = 'draft' | 'published' | 'archived'

export interface MediaContent {
  id: string
  church_id: string
  title: string
  description: string | null
  content_type: ContentType
  url: string | null
  image_url: string | null
  author_id: string | null
  status: ContentStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  church_id: string
  user_id: string
  title: string
  body: string
  data: Record<string, unknown> | null
  read_at: string | null
  created_at: string
}
