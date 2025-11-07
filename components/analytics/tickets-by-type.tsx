"use client"

import type { Ticket } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface TicketsByTypeProps {
  tickets: Ticket[]
}

export function TicketsByType({ tickets }: TicketsByTypeProps) {
  // Group tickets by type
  const typeData = tickets.reduce(
    (acc, ticket) => {
      const type = ticket.type
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(typeData).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    tickets: count,
  }))

  const getColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "incident":
        return "hsl(var(--destructive))"
      case "request":
        return "hsl(var(--chart-1))"
      case "change":
        return "hsl(var(--chart-3))"
      case "problem":
        return "hsl(var(--chart-4))"
      default:
        return "hsl(var(--chart-2))"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets by Type</CardTitle>
        <CardDescription>Breakdown by ticket categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="type" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip formatter={(value, name) => [value, "Tickets"]} />
            <Bar dataKey="tickets" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
