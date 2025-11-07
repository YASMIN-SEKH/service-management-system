import type { Ticket } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Clock, User, Building2, Package } from "lucide-react"

interface TicketDetailsProps {
  ticket: Ticket
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "closed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
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
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const reporterInitials = ticket.reporter
    ? `${ticket.reporter.first_name?.[0] || ""}${ticket.reporter.last_name?.[0] || ""}`
    : "U"
  const assigneeInitials = ticket.assignee
    ? `${ticket.assignee.first_name?.[0] || ""}${ticket.assignee.last_name?.[0] || ""}`
    : "U"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{ticket.title}</CardTitle>
            <CardDescription className="text-base mt-2">{ticket.ticket_number}</CardDescription>
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
      </CardHeader>
      <CardContent className="space-y-6">
        {ticket.description && (
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Reported by</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={ticket.reporter?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{reporterInitials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {ticket.reporter
                      ? `${ticket.reporter.first_name || ""} ${ticket.reporter.last_name || ""}`.trim() ||
                        ticket.reporter.email
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {ticket.assignee && (
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Assigned to</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={ticket.assignee?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{assigneeInitials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {`${ticket.assignee.first_name || ""} ${ticket.assignee.last_name || ""}`.trim() ||
                        ticket.assignee.email}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {ticket.account && (
              <div className="flex items-center space-x-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Account</p>
                  <p className="text-sm text-muted-foreground mt-1">{ticket.account.name}</p>
                </div>
              </div>
            )}

            {ticket.service && (
              <div className="flex items-center space-x-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Service</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ticket.service.name}
                    {ticket.service.category?.name && ` (${ticket.service.category.name})`}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground mt-1">{formatDate(ticket.created_at)}</p>
              </div>
            </div>

            {ticket.due_date && (
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className="text-sm text-muted-foreground mt-1">{formatDate(ticket.due_date)}</p>
                </div>
              </div>
            )}

            {ticket.resolved_at && (
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Resolved</p>
                  <p className="text-sm text-muted-foreground mt-1">{formatDate(ticket.resolved_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {ticket.notes && (
          <div>
            <h4 className="font-medium mb-2">Notes</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{ticket.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
