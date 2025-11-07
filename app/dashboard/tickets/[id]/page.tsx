import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TicketDetails } from "@/components/tickets/ticket-details"
import { TicketComments } from "@/components/tickets/ticket-comments"
import { TicketActions } from "@/components/tickets/ticket-actions"

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const { id } = await params

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get ticket with all related data
  const { data: ticket } = await supabase
    .from("tickets")
    .select(`
      *,
      reporter:profiles!tickets_reporter_id_fkey(id, first_name, last_name, email, avatar_url),
      assignee:profiles!tickets_assignee_id_fkey(id, first_name, last_name, email, avatar_url),
      account:accounts(id, name, support_channel),
      service:services(id, name, category:service_categories(name)),
      sla_policy:sla_policies(*)
    `)
    .eq("id", id)
    .single()

  if (!ticket) {
    notFound()
  }

  // Get user profile to check permissions
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  // Check if user has access to this ticket
  const hasAccess =
    ticket.reporter_id === data.user.id ||
    ticket.assignee_id === data.user.id ||
    (profile?.role && ["admin", "manager", "agent"].includes(profile.role))

  if (!hasAccess) {
    redirect("/dashboard/tickets")
  }

  // Get comments
  const { data: comments } = await supabase
    .from("ticket_comments")
    .select(`
      *,
      author:profiles(id, first_name, last_name, email, avatar_url)
    `)
    .eq("ticket_id", id)
    .order("created_at", { ascending: true })

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <TicketDetails ticket={ticket} />
          <TicketComments
            ticketId={id}
            comments={comments || []}
            currentUserId={data.user.id}
            userRole={profile?.role || "user"}
          />
        </div>
        <div className="space-y-6">
          <TicketActions ticket={ticket} currentUserId={data.user.id} userRole={profile?.role || "user"} />
        </div>
      </div>
    </div>
  )
}
