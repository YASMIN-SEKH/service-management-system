import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const slaData = [
  { name: "Critical Issues", compliance: 98, color: "bg-red-500" },
  { name: "High Priority", compliance: 95, color: "bg-orange-500" },
  { name: "Medium Priority", compliance: 92, color: "bg-yellow-500" },
  { name: "Low Priority", compliance: 89, color: "bg-green-500" },
]

export function SLAOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SLA Compliance</CardTitle>
        <CardDescription>Service level agreement performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {slaData.map((sla) => (
            <div key={sla.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{sla.name}</span>
                <span className="text-sm text-muted-foreground">{sla.compliance}% compliance</span>
              </div>
              <Progress value={sla.compliance} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
