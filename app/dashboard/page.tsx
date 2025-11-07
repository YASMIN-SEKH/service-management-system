import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentTickets } from "@/components/dashboard/recent-tickets"
import { SLAOverview } from "@/components/dashboard/sla-overview"

export default async function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <DashboardStats />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <RecentTickets />
          </div>
          <div className="col-span-3">
            <SLAOverview />
          </div>
        </div>
      </div>
    </div>
  )
}
