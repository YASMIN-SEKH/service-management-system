"use client"
import type { Ticket } from "@/lib/types"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Clock, CheckCircle, XCircle, AlertTriangle, User } from "lucide-react"

interface TicketActionsProps {
  ticket: Ticket
  currentUserId: string
  userRole: string
}

export function TicketActions({ ticket, currentUserId, userRole }: TicketActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const canModifyTicket = ticket.assignee_id === currentUserId || ["admin", "manager", "agent"].includes(userRole)

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)
    try {
      const updateData: any = { status: newStatus }

      if (newStatus === "resolved") {
        updateData.resolved_at = new Date().toISOString()
      } else if (newStatus === "closed") {
        updateData.closed_at = new Date().toISOString()
      }

      const { error } = await supabase.from("tickets").update(updateData).eq("id", ticket.id)

      if (error) throw error

      toast({
        title: "Status updated",
        description: `Ticket status changed to ${newStatus.replace("_", " ")}.`,
      })

      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error updating status",
        description: "There was an error updating the ticket status.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePriorityChange = async (newPriority: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("tickets").update({ priority: newPriority }).eq("id", ticket.id)

      if (error) throw error

      toast({
        title: "Priority updated",
        description: `Ticket priority changed to ${newPriority}.`,
      })

      // Refresh the page to show updated priority
      window.location.reload()
    } catch (error) {
      console.error("Error updating priority:", error)
      toast({
        title: "Error updating priority",
        description: "There was an error updating the ticket priority.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignToMe = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("tickets").update({ assignee_id: currentUserId }).eq("id", ticket.id)

      if (error) throw error

      toast({
        title: "Ticket assigned",
        description: "The ticket has been assigned to you.",
      })

      // Refresh the page to show updated assignment
      window.location.reload()
    } catch (error) {
      console.error("Error assigning ticket:", error)
      toast({
        title: "Error assigning ticket",
        description: "There was an error assigning the ticket to you.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common ticket operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {canModifyTicket && (
            <>
              {ticket.status === "open" && (
                <Button
                  onClick={() => handleStatusChange("in_progress")}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Start Working
                </Button>
              )}

              {ticket.status === "in_progress" && (
                <Button
                  onClick={() => handleStatusChange("resolved")}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Resolved
                </Button>
              )}

              {ticket.status === "resolved" && (
                <Button
                  onClick={() => handleStatusChange("closed")}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Close Ticket
                </Button>
              )}
            </>
          )}

          {!ticket.assignee_id && canModifyTicket && (
            <Button onClick={handleAssignToMe} disabled={isLoading} className="w-full bg-transparent" variant="outline">
              <User className="h-4 w-4 mr-2" />
              Assign to Me
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Status & Priority */}
      {canModifyTicket && (
        <Card>
          <CardHeader>
            <CardTitle>Status & Priority</CardTitle>
            <CardDescription>Update ticket status and priority</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={ticket.status} onValueChange={handleStatusChange} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(ticket.status)}
                      <span>{ticket.status.replace("_", " ")}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Open</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="in_progress">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>In Progress</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="resolved">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Resolved</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="closed">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4" />
                      <span>Closed</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={ticket.priority} onValueChange={handlePriorityChange} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ticket Info */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Type</span>
            <Badge variant="outline">{ticket.type}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Priority</span>
            <Badge variant="secondary">{ticket.priority}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="secondary">{ticket.status.replace("_", " ")}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
