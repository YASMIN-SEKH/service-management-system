import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AccountsHeader } from "@/components/accounts/accounts-header"
import { AccountsStats } from "@/components/accounts/accounts-stats"
import { AccountsTable } from "@/components/accounts/accounts-table"

interface AccountsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AccountsPage({ searchParams }: AccountsPageProps) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const params = await searchParams

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user has admin/manager role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (!profile || !["admin", "manager"].includes(profile.role)) {
    redirect("/dashboard")
  }

  let query = supabase.from("accounts").select(`
      *,
      tickets(id, status, priority, created_at)
    `)

  // Apply search filter
  if (params.search) {
    query = query.ilike("name", `%${params.search}%`)
  }

  // Apply status filter
  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status)
  }

  const { data: accounts } = await query.order("name")

  // Calculate stats
  const totalAccounts = accounts?.length || 0
  const activeAccounts = accounts?.filter((a) => a.status === "active").length || 0
  const totalTickets = accounts?.reduce((acc, account) => acc + (account.tickets?.length || 0), 0) || 0
  const openTickets =
    accounts?.reduce((acc, account) => acc + (account.tickets?.filter((t) => t.status === "open").length || 0), 0) || 0

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AccountsHeader />

      <AccountsStats
        totalAccounts={totalAccounts}
        activeAccounts={activeAccounts}
        totalTickets={totalTickets}
        openTickets={openTickets}
      />

      <AccountsTable accounts={accounts || []} />
    </div>
  )
}
