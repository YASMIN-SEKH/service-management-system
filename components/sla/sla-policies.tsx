import type { SLAPolicy } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SLAPoliciesProps {
  policies: SLAPolicy[]
}

export function SLAPolicies({ policies }: SLAPoliciesProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    } else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)}h ${minutes % 60}min`
    } else {
      const days = Math.floor(minutes / 1440)
      const hours = Math.floor((minutes % 1440) / 60)
      return `${days}d ${hours}h`
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P1":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "P2":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "P3":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "P4":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Mock compliance data - in real app this would come from actual ticket data
  const getCompliancePercentage = (priority: string) => {
    switch (priority) {
      case "P1":
        return 98
      case "P2":
        return 95
      case "P3":
        return 92
      case "P4":
        return 89
      default:
        return 90
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SLA Policies</CardTitle>
        <CardDescription>Configure response and resolution time targets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {policies.map((policy) => (
            <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className={getPriorityColor(policy.priority)}>
                  {policy.priority}
                </Badge>
                <div>
                  <h4 className="font-medium">{policy.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Response: {formatTime(policy.response_time_minutes)} | Resolution:{" "}
                    {formatTime(policy.resolution_time_minutes)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{getCompliancePercentage(policy.priority)}% compliance</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Policy</DropdownMenuItem>
                    <DropdownMenuItem>View Reports</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      {policy.is_active ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
