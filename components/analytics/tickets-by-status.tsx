"use client"

import type { Ticket } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface TicketsByStatusProps {
  tickets: Ticket[]
}

export function TicketsByStatus({ tickets }: TicketsByStatusProps) {
  // Group tickets by status
  const statusData = tickets.reduce(
    (acc, ticket) => {
      const status = ticket.status.replace("_", " ")
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(statusData).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    tickets: count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets by Status</CardTitle>
        <CardDescription>Current status distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="status" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip formatter={(value, name) => [value, "Tickets"]} />
            <Bar dataKey="tickets" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
