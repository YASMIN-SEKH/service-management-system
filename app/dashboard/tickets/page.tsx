import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TicketsHeader } from "@/components/tickets/tickets-header"
import { TicketsTable } from "@/components/tickets/tickets-table"
import { TicketsKanban } from "@/components/tickets/tickets-kanban"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; status?: string; priority?: string }>
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const params = await searchParams

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile to determine access level
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  // Build query based on user role
  let ticketsQuery = supabase
    .from("tickets")
    .select(`
      *,
      reporter:profiles!tickets_reporter_id_fkey(id, first_name, last_name, email),
      assignee:profiles!tickets_assignee_id_fkey(id, first_name, last_name, email),
      account:accounts(id, name),
      service:services(id, name)
    `)
    .order("created_at", { ascending: false })

  // Apply role-based filtering
  if (profile?.role === "user") {
    ticketsQuery = ticketsQuery.or(`reporter_id.eq.${data.user.id},assignee_id.eq.${data.user.id}`)
  }

  // Apply filters from search params
  if (params.status) {
    ticketsQuery = ticketsQuery.eq("status", params.status)
  }
  if (params.priority) {
    ticketsQuery = ticketsQuery.eq("priority", params.priority)
  }

  const { data: tickets } = await ticketsQuery

  const view = params.view || "list"

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <TicketsHeader />

      <Tabs value={view} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <TicketsTable tickets={tickets || []} />
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <TicketsKanban tickets={tickets || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
