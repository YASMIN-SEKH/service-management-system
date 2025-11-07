import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ServiceCatalogBrowse } from "@/components/services/service-catalog-browse"

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get service categories with services for browsing
  const { data: categories } = await supabase
    .from("service_categories")
    .select(`
      *,
      department:departments(*),
      services(*)
    `)
    .eq("is_active", true)
    .order("name")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Service Catalog</h2>
          <p className="text-muted-foreground">Browse and request services from various departments</p>
        </div>
      </div>

      <ServiceCatalogBrowse categories={categories || []} />
    </div>
  )
}
