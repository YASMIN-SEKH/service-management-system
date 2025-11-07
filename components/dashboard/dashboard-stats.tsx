import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">📈</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,247</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+12.5%</span> from last period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">⏰</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2.4 hours</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">-8.2%</span> from last period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">✅</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">94.8%</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+2.1%</span> from last period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">👥</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4.6/5</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+0.3</span> from last period
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
