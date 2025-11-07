export type UserRole = "admin" | "agent" | "manager" | "user"
export type UserStatus = "active" | "inactive" | "pending"
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high" | "critical"
export type TicketType = "incident" | "request" | "change" | "problem"
export type SLAPriority = "P1" | "P2" | "P3" | "P4"
export type AccountStatus = "active" | "inactive" | "suspended"
export type SupportChannel = "email" | "slack" | "phone" | "chat"

export interface Profile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: UserRole
  status: UserStatus
  department_id?: string
  avatar_url?: string
  created_at: string
  updated_at: string
  department?: Department
}

export interface Department {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  name: string
  website?: string
  country?: string
  support_channel: SupportChannel
  status: AccountStatus
  owner_id?: string
  created_at: string
  updated_at: string
  owner?: Profile
}

export interface ServiceCategory {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  department_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
  department?: Department
  services?: Service[]
}

export interface Service {
  id: string
  name: string
  description?: string
  category_id?: string
  estimated_time_hours: number
  rating: number
  is_active: boolean
  created_at: string
  updated_at: string
  category?: ServiceCategory
}

export interface SLAPolicy {
  id: string
  name: string
  priority: SLAPriority
  response_time_minutes: number
  resolution_time_minutes: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  ticket_number: string
  title: string
  description?: string
  status: TicketStatus
  priority: TicketPriority
  type: TicketType
  reporter_id?: string
  assignee_id?: string
  account_id?: string
  service_id?: string
  sla_policy_id?: string
  due_date?: string
  resolved_at?: string
  closed_at?: string
  notes?: string
  created_at: string
  updated_at: string
  reporter?: Profile
  assignee?: Profile
  account?: Account
  service?: Service
  sla_policy?: SLAPolicy
}

export interface TicketComment {
  id: string
  ticket_id: string
  author_id?: string
  content: string
  is_internal: boolean
  created_at: string
  author?: Profile
}

export interface TicketAttachment {
  id: string
  ticket_id: string
  filename: string
  file_url: string
  file_size?: number
  mime_type?: string
  uploaded_by?: string
  created_at: string
  uploader?: Profile
}
