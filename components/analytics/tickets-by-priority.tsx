"use client"

import type { Ticket } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface TicketsByPriorityProps {
  tickets: Ticket[]
}

export function TicketsByPriority({ tickets }: TicketsByPriorityProps) {
  // Group tickets by priority
  const priorityData = tickets.reduce(
    (acc, ticket) => {
      const priority = ticket.priority
      acc[priority] = (acc[priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(priorityData).map(([priority, count]) => ({
    priority: priority.charAt(0).toUpperCase() + priority.slice(1),
    tickets: count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets by Priority</CardTitle>
        <CardDescription>Priority level breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="priority" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip formatter={(value, name) => [value, "Tickets"]} />
            <Bar dataKey="tickets" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
