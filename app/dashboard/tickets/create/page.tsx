import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CreateTicketForm } from "@/components/tickets/create-ticket-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CreateTicketPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get services for the form
  const { data: services } = await supabase
    .from("services")
    .select("*, category:service_categories(*)")
    .eq("is_active", true)
    .order("name")

  // Get accounts (for agents/admins)
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  let accounts = []
  if (profile?.role && ["admin", "manager", "agent"].includes(profile.role)) {
    const { data: accountsData } = await supabase.from("accounts").select("*").eq("status", "active").order("name")
    accounts = accountsData || []
  }

  // Get assignees (agents/admins)
  const { data: assignees } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email")
    .in("role", ["admin", "manager", "agent"])
    .eq("status", "active")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Ticket</h2>
          <p className="text-muted-foreground">Submit a new support request or incident report</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>New Support Request</CardTitle>
            <CardDescription>
              Fill out the form below to create a new support ticket. Our team will respond according to the priority
              level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateTicketForm
              services={services || []}
              accounts={accounts}
              assignees={assignees || []}
              currentUserId={data.user.id}
              userRole={profile?.role || "user"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
