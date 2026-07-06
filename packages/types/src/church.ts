export type SubscriptionPlanTier = 'starter' | 'growth' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'inactive' | 'past_due' | 'canceled' | 'trial'
export type ChurchStatus = 'active' | 'blocked' | 'trial'

export interface Church {
  id: string
  name: string
  slug: string
  document: string | null
  email: string | null
  phone: string | null
  status: ChurchStatus
  subscription_plan_tier: SubscriptionPlanTier | null
  max_members: number
  created_at: string
  updated_at: string
}

export interface ChurchBranding {
  id: string
  church_id: string
  logo_url: string | null
  banner_url: string | null
  primary_color: string
  secondary_color: string
  accent_color: string
  font_family: string | null
  created_at: string
  updated_at: string
}

export interface ChurchBranch {
  id: string
  church_id: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  phone: string | null
  email: string | null
  is_main: boolean
  created_at: string
  updated_at: string
}
