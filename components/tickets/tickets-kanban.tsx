import type { Ticket } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface TicketsKanbanProps {
  tickets: Ticket[]
}

export function TicketsKanban({ tickets }: TicketsKanbanProps) {
  const columns = [
    { id: "open", title: "Open", tickets: tickets.filter((t) => t.status === "open") },
    { id: "in_progress", title: "In Progress", tickets: tickets.filter((t) => t.status === "in_progress") },
    { id: "resolved", title: "Resolved", tickets: tickets.filter((t) => t.status === "resolved") },
    { id: "closed", title: "Closed", tickets: tickets.filter((t) => t.status === "closed") },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "high":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{column.title}</h3>
            <Badge variant="secondary">{column.tickets.length}</Badge>
          </div>
          <div className="space-y-3">
            {column.tickets.map((ticket) => {
              const assigneeInitials = ticket.assignee
                ? `${ticket.assignee.first_name?.[0] || ""}${ticket.assignee.last_name?.[0] || ""}`
                : "U"

              return (
                <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <Link href={`/dashboard/tickets/${ticket.id}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium line-clamp-2">{ticket.title}</CardTitle>
                        <Badge variant="secondary" className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{ticket.ticket_number}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {ticket.assignee && (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={ticket.assignee?.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">{assigneeInitials}</AvatarFallback>
                            </Avatar>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {ticket.assignee
                              ? `${ticket.assignee.first_name || ""} ${ticket.assignee.last_name || ""}`.trim() ||
                                ticket.assignee.email
                              : "Unassigned"}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {ticket.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
