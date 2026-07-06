export interface SubscriptionPlan {
  id: string
  tier: string
  name: string
  description: string | null
  max_members: number
  monthly_price_cents: number
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  church_id: string
  plan_id: string
  status: string
  current_period_start: string
  current_period_end: string
  canceled_at: string | null
  created_at: string
  updated_at: string
}

export interface BillingInvoice {
  id: string
  church_id: string
  subscription_id: string
  amount_cents: number
  currency: string
  status: 'pending' | 'paid' | 'overdue' | 'canceled'
  due_date: string
  paid_at: string | null
  created_at: string
}
