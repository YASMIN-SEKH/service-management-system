import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AccountDetails } from "@/components/accounts/account-details"
import { AccountTickets } from "@/components/accounts/account-tickets"
import { AccountContacts } from "@/components/accounts/account-contacts"

export default async function AccountPage({
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

  // Check if user has admin/manager role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (!profile || !["admin", "manager"].includes(profile.role)) {
    redirect("/dashboard")
  }

  // Get account details
  const { data: account } = await supabase.from("accounts").select("*").eq("id", id).single()

  if (!account) {
    notFound()
  }

  // Get account tickets
  const { data: tickets } = await supabase
    .from("tickets")
    .select(`
      *,
      reporter:profiles!tickets_reporter_id_fkey(id, first_name, last_name, email),
      assignee:profiles!tickets_assignee_id_fkey(id, first_name, last_name, email)
    `)
    .eq("account_id", id)
    .order("created_at", { ascending: false })

  // Get account contacts (users associated with this account)
  const { data: contacts } = await supabase.from("profiles").select("*").eq("account_id", id).order("first_name")

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AccountDetails account={account} />
          <AccountTickets tickets={tickets || []} />
        </div>
        <div>
          <AccountContacts contacts={contacts || []} accountId={id} />
        </div>
      </div>
    </div>
  )
}
