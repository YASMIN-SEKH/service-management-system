"use client"

import type { Ticket } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface TicketTrendsProps {
  tickets: Ticket[]
}

export function TicketTrends({ tickets }: TicketTrendsProps) {
  // Group tickets by date (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split("T")[0]
  })

  const trendData = last30Days.map((date) => {
    const dayTickets = tickets.filter((ticket) => ticket.created_at.startsWith(date))
    const resolved = dayTickets.filter((ticket) => ticket.resolved_at?.startsWith(date)).length

    return {
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      created: dayTickets.length,
      resolved: resolved,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Trends</CardTitle>
        <CardDescription>Created vs resolved over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="created"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              name="Created"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="resolved"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="Resolved"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
