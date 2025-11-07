import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const recentTickets = [
  {
    id: "#5061",
    title: "Inability to Save Changes in Profile Settings",
    status: "open",
    priority: "high",
    assignee: { name: "JS", avatar: "" },
    reporter: { name: "RM", avatar: "" },
    created: "Aug 28, 2025",
  },
  {
    id: "#5079",
    title: "Upcoming subscription renewal discussion",
    status: "in_progress",
    priority: "medium",
    assignee: { name: "SW", avatar: "" },
    reporter: { name: "RE", avatar: "" },
    created: "Aug 28, 2025",
  },
  {
    id: "#5083",
    title: "Dark Mode for the Dashboard",
    status: "in_progress",
    priority: "low",
    assignee: { name: "MC", avatar: "" },
    reporter: { name: "LI", avatar: "" },
    created: "Aug 29, 2025",
  },
]

export function RecentTickets() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "high":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      default:
        return "bg-green-100 text-green-800 hover:bg-green-100"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
        <CardDescription>Latest support tickets and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTickets.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{ticket.reporter.name}</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{ticket.assignee.name}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.id} • {ticket.created}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                  {ticket.status.replace("_", " ")}
                </Badge>
                <Badge variant="secondary" className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
