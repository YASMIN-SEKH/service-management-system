import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UsersTable } from "@/components/users/users-table"
import { UsersStats } from "@/components/users/users-stats"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"

export default async function UsersPage() {
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

  // Get users and stats
  const { data: users } = await supabase
    .from("profiles")
    .select("*, department:departments(*)")
    .order("created_at", { ascending: false })

  const { data: stats } = await supabase.from("profiles").select("status, role")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users & Teams</h2>
          <p className="text-muted-foreground">
            Manage user accounts, teams, and access permissions across your organization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage Departments
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <UsersStats stats={stats || []} />
      <UsersTable users={users || []} />
    </div>
  )
}
