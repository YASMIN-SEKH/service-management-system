import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default async function SLAReportsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user has admin/manager role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (!profile || !["admin", "manager"].includes(profile.role)) {
    redirect("/dashboard")
  }

  // Get SLA compliance data from the view
  const { data: complianceData } = await supabase.from("sla_compliance_report").select("*")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SLA Reports</h2>
          <p className="text-muted-foreground">Detailed compliance metrics and performance analysis</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>SLA Compliance Overview</CardTitle>
            <CardDescription>Performance metrics for each SLA policy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {complianceData?.map((sla) => (
                <div key={sla.sla_policy_name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">{sla.priority}</Badge>
                      <h4 className="font-medium">{sla.sla_policy_name}</h4>
                    </div>
                    <div className="text-sm text-muted-foreground">{sla.total_tickets} tickets</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Response Compliance</span>
                        <span>{sla.response_compliance_percentage || 0}%</span>
                      </div>
                      <Progress value={sla.response_compliance_percentage || 0} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {sla.response_met || 0} of {sla.total_tickets} tickets met response SLA
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Resolution Compliance</span>
                        <span>{sla.resolution_compliance_percentage || 0}%</span>
                      </div>
                      <Progress value={sla.resolution_compliance_percentage || 0} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {sla.resolution_met || 0} resolved tickets met resolution SLA
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
