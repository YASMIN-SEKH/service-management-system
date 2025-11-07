import type { Ticket } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface TicketsTableProps {
  tickets: Ticket[]
}

export function TicketsTable({ tickets }: TicketsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "incident":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "request":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "change":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "problem":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Reported Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => {
              const reporterInitials = ticket.reporter
                ? `${ticket.reporter.first_name?.[0] || ""}${ticket.reporter.last_name?.[0] || ""}`
                : "U"
              const assigneeInitials = ticket.assignee
                ? `${ticket.assignee.first_name?.[0] || ""}${ticket.assignee.last_name?.[0] || ""}`
                : "U"

              return (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <Link href={`/dashboard/tickets/${ticket.id}`} className="hover:underline">
                      <div>
                        <div className="font-medium">{ticket.title}</div>
                        <div className="text-sm text-muted-foreground">{ticket.ticket_number}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
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
                  </TableCell>
                  <TableCell>
                    {ticket.assignee ? (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={ticket.assignee?.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{assigneeInitials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {`${ticket.assignee.first_name || ""} ${ticket.assignee.last_name || ""}`.trim() ||
                            ticket.assignee.email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{formatDate(ticket.created_at)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {ticket.due_date ? formatDate(ticket.due_date) : "No due date"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getTypeColor(ticket.type)}>
                      {ticket.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {ticket.notes ? ticket.notes.substring(0, 50) + "..." : "No notes"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/tickets/${ticket.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Ticket</DropdownMenuItem>
                        <DropdownMenuItem>Assign to Me</DropdownMenuItem>
                        <DropdownMenuItem>Change Priority</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Close Ticket</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
