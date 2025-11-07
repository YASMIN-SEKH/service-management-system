export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Service Management System - Test</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
            <p className="text-muted-foreground">View system overview and metrics</p>
            <a
              href="/dashboard"
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Go to Dashboard
            </a>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Tickets</h2>
            <p className="text-muted-foreground">Manage support tickets</p>
            <a
              href="/dashboard/tickets"
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              View Tickets
            </a>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-muted-foreground">Manage system users</p>
            <a
              href="/dashboard/users"
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Manage Users
            </a>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">SLA Tracking</h2>
            <p className="text-muted-foreground">Monitor service level agreements</p>
            <a
              href="/dashboard/sla"
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              View SLA
            </a>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-muted-foreground">View performance analytics</p>
            <a
              href="/dashboard/analytics"
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              View Analytics
            </a>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Accounts</h2>
            <p className="text-muted-foreground">Manage customer accounts</p>
            <a
              href="/dashboard/accounts"
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Manage Accounts
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
