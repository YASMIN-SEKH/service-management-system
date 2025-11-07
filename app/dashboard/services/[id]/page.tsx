import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ServiceDetails } from "@/components/services/service-details"
import { ServiceRequestForm } from "@/components/services/service-request-form"

export default async function ServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const { id } = await params

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get service details
  const { data: service } = await supabase
    .from("services")
    .select(`
      *,
      category:service_categories(*, department:departments(*))
    `)
    .eq("id", id)
    .single()

  if (!service) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ServiceDetails service={service} />
        </div>
        <div>
          <ServiceRequestForm service={service} currentUserId={data.user.id} />
        </div>
      </div>
    </div>
  )
}
