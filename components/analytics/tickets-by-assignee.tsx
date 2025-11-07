"use client"

import type { Ticket } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface TicketsByAssigneeProps {
  tickets: Ticket[]
}

export function TicketsByAssignee({ tickets }: TicketsByAssigneeProps) {
  // Group tickets by assignee
  const assigneeData = tickets.reduce(
    (acc, ticket) => {
      const assignee = ticket.assignee
        ? `${ticket.assignee.first_name || ""} ${ticket.assignee.last_name || ""}`.trim() || ticket.assignee.email
        : "Unassigned"
      acc[assignee] = (acc[assignee] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(assigneeData)
    .map(([assignee, count]) => ({
      assignee: assignee.length > 15 ? assignee.substring(0, 15) + "..." : assignee,
      fullName: assignee,
      tickets: count,
    }))
    .sort((a, b) => b.tickets - a.tickets)
    .slice(0, 10) // Top 10 assignees

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets by Assignee</CardTitle>
        <CardDescription>Workload distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="assignee" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              formatter={(value, name) => [value, "Tickets"]}
              labelFormatter={(label) => {
                const item = chartData.find((d) => d.assignee === label)
                return item?.fullName || label
              }}
            />
            <Bar dataKey="tickets" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
