import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { AnalyticsStats } from "@/components/analytics/analytics-stats"
import { TicketsByDepartment } from "@/components/analytics/tickets-by-department"
import { TicketsByType } from "@/components/analytics/tickets-by-type"
import { TicketsByStatus } from "@/components/analytics/tickets-by-status"
import { TicketsByPriority } from "@/components/analytics/tickets-by-priority"
import { TicketsByAssignee } from "@/components/analytics/tickets-by-assignee"
import { TicketTrends } from "@/components/analytics/ticket-trends"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get tickets with related data for analytics
  const { data: tickets } = await supabase
    .from("tickets")
    .select(`
      *,
      reporter:profiles!tickets_reporter_id_fkey(id, first_name, last_name, department_id, department:departments(name)),
      assignee:profiles!tickets_assignee_id_fkey(id, first_name, last_name, department_id, department:departments(name))
    `)
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

  // Calculate analytics metrics
  const totalTickets = tickets?.length || 0
  const resolvedTickets = tickets?.filter((t) => t.status === "resolved").length || 0
  const closedTickets = tickets?.filter((t) => t.status === "closed").length || 0

  // Calculate average resolution time
  const resolvedTicketsWithTime = tickets?.filter((t) => t.resolved_at) || []
  const totalResolutionTime = resolvedTicketsWithTime.reduce((acc, ticket) => {
    const created = new Date(ticket.created_at)
    const resolved = new Date(ticket.resolved_at!)
    return acc + (resolved.getTime() - created.getTime())
  }, 0)
  const avgResolutionTime =
    resolvedTicketsWithTime.length > 0 ? totalResolutionTime / resolvedTicketsWithTime.length : 0
  const avgResolutionHours = avgResolutionTime / (1000 * 60 * 60)

  // Calculate SLA compliance
  const slaCompliantTickets =
    tickets?.filter((t) => {
      if (!t.due_date || !t.resolved_at) return false
      return new Date(t.resolved_at) <= new Date(t.due_date)
    }).length || 0
  const ticketsWithSLA = tickets?.filter((t) => t.due_date && t.resolved_at).length || 0
  const slaCompliance = ticketsWithSLA > 0 ? (slaCompliantTickets / ticketsWithSLA) * 100 : 0

  // Mock customer satisfaction (in real app this would come from surveys)
  const customerSatisfaction = 4.6

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AnalyticsHeader />

      <AnalyticsStats
        totalTickets={totalTickets}
        avgResolutionTime={avgResolutionHours}
        slaCompliance={slaCompliance}
        customerSatisfaction={customerSatisfaction}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TicketsByDepartment tickets={tickets || []} />
        <TicketsByType tickets={tickets || []} />
        <TicketsByStatus tickets={tickets || []} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TicketsByPriority tickets={tickets || []} />
        <TicketsByAssignee tickets={tickets || []} />
        <TicketTrends tickets={tickets || []} />
      </div>
    </div>
  )
}
