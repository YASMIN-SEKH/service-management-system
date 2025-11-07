"use client"

import type { Ticket } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface TicketsByDepartmentProps {
  tickets: Ticket[]
}

export function TicketsByDepartment({ tickets }: TicketsByDepartmentProps) {
  // Group tickets by department
  const departmentData = tickets.reduce(
    (acc, ticket) => {
      const department = ticket.reporter?.department?.name || "Unknown"
      acc[department] = (acc[department] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(departmentData).map(([department, count]) => ({
    department: department.length > 10 ? department.substring(0, 10) + "..." : department,
    fullName: department,
    tickets: count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets by Department</CardTitle>
        <CardDescription>Distribution across departments</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="department" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              formatter={(value, name) => [value, "Tickets"]}
              labelFormatter={(label) => {
                const item = chartData.find((d) => d.department === label)
                return item?.fullName || label
              }}
            />
            <Bar dataKey="tickets" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
