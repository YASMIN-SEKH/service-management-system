import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ServiceCatalogHeader } from "@/components/catalog/service-catalog-header"
import { ServiceCatalogStats } from "@/components/catalog/service-catalog-stats"
import { ServiceCategories } from "@/components/catalog/service-categories"

export default async function ServiceCatalogPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get service categories with services
  const { data: categories } = await supabase
    .from("service_categories")
    .select(`
      *,
      department:departments(*),
      services(*)
    `)
    .eq("is_active", true)
    .order("name")

  // Calculate stats
  const totalServices = categories?.reduce((acc, cat) => acc + (cat.services?.length || 0), 0) || 0
  const activeServices =
    categories?.reduce((acc, cat) => acc + (cat.services?.filter((s) => s.is_active).length || 0), 0) || 0
  const serviceOwners = new Set(categories?.map((cat) => cat.department_id)).size
  const totalCategories = categories?.length || 0

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ServiceCatalogHeader />

      <ServiceCatalogStats
        totalServices={totalServices}
        activeServices={activeServices}
        serviceOwners={serviceOwners}
        categories={totalCategories}
      />

      <ServiceCategories categories={categories || []} />
    </div>
  )
}
