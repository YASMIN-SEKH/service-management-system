"use client"

import type React from "react"
import type { Service, Account, Profile } from "@/lib/types"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface CreateTicketFormProps {
  services: Service[]
  accounts: Account[]
  assignees: Profile[]
  currentUserId: string
  userRole: string
}

export function CreateTicketForm({ services, accounts, assignees, currentUserId, userRole }: CreateTicketFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    type: "request",
    service_id: "",
    account_id: "",
    assignee_id: "",
  })

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const ticketData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        type: formData.type,
        reporter_id: currentUserId,
        service_id: formData.service_id || null,
        account_id: formData.account_id || null,
        assignee_id: formData.assignee_id || null,
        status: "open",
      }

      const { data, error } = await supabase.from("tickets").insert([ticketData]).select().single()

      if (error) throw error

      toast({
        title: "Ticket created successfully",
        description: `Ticket ${data.ticket_number} has been created and assigned.`,
      })

      router.push(`/dashboard/tickets/${data.id}`)
    } catch (error) {
      console.error("Error creating ticket:", error)
      toast({
        title: "Error creating ticket",
        description: "There was an error creating your ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const canAssignTickets = ["admin", "manager", "agent"].includes(userRole)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="Brief description of the issue or request"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Provide detailed information about the issue or request"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="incident">Incident</SelectItem>
              <SelectItem value="request">Request</SelectItem>
              <SelectItem value="change">Change</SelectItem>
              <SelectItem value="problem">Problem</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {services.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="service">Related Service</Label>
          <Select
            value={formData.service_id}
            onValueChange={(value) => setFormData({ ...formData, service_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a service (optional)" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} {service.category?.name && `(${service.category.name})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {canAssignTickets && accounts.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="account">Account</Label>
          <Select
            value={formData.account_id}
            onValueChange={(value) => setFormData({ ...formData, account_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an account (optional)" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {canAssignTickets && assignees.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="assignee">Assign To</Label>
          <Select
            value={formData.assignee_id}
            onValueChange={(value) => setFormData({ ...formData, assignee_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an assignee (optional)" />
            </SelectTrigger>
            <SelectContent>
              {assignees.map((assignee) => (
                <SelectItem key={assignee.id} value={assignee.id}>
                  {`${assignee.first_name || ""} ${assignee.last_name || ""}`.trim() || assignee.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Ticket"}
        </Button>
      </div>
    </form>
  )
}
