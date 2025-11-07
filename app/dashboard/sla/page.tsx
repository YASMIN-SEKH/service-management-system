import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SLAStats } from "@/components/sla/sla-stats"
import { SLAPolicies } from "@/components/sla/sla-policies"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function SLAPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user has admin/manager role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (!profile || !["admin", "manager"].includes(profile.role)) {
    redirect("/dashboard")
  }

  // Get SLA policies
  const { data: slaPolicies } = await supabase.from("sla_policies").select("*").order("priority")

  // Calculate SLA stats
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*, sla_policy:sla_policies(*)")
    .not("sla_policy_id", "is", null)

  // Calculate compliance metrics
  const totalTickets = tickets?.length || 0
  const now = new Date()

  let breachedSLAs = 0
  let totalResponseTime = 0
  let responseTimeCount = 0

  tickets?.forEach((ticket) => {
    if (ticket.sla_policy) {
      const createdAt = new Date(ticket.created_at)
      const responseDeadline = new Date(createdAt.getTime() + ticket.sla_policy.response_time_minutes * 60000)

      // Check if response SLA was breached
      if (now > responseDeadline && ticket.status === "open") {
        breachedSLAs++
      }

      // Calculate response time for resolved tickets
      if (ticket.resolved_at) {
        const resolvedAt = new Date(ticket.resolved_at)
        const responseTime = (resolvedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60) // hours
        totalResponseTime += responseTime
        responseTimeCount++
      }
    }
  })

  const slaCompliance = totalTickets > 0 ? ((totalTickets - breachedSLAs) / totalTickets) * 100 : 0
  const avgResponseTime = responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0
  const activeSLAs = slaPolicies?.filter((p) => p.is_active).length || 0

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SLA Management</h2>
          <p className="text-muted-foreground">Configure and monitor Service Level Agreements</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create SLA
        </Button>
      </div>

      <SLAStats
        compliance={slaCompliance}
        avgResponseTime={avgResponseTime}
        breachedSLAs={breachedSLAs}
        activeSLAs={activeSLAs}
      />

      <SLAPolicies policies={slaPolicies || []} />
    </div>
  )
}
