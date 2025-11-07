import type { ServiceCategory } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "./service-card"
import { Plus } from "lucide-react"

interface ServiceCategoriesProps {
  categories: ServiceCategory[]
}

export function ServiceCategories({ categories }: ServiceCategoriesProps) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white`}
                  style={{ backgroundColor: category.color || "#3b82f6" }}
                >
                  <span className="text-sm font-medium">
                    {category.icon === "laptop" ? "💻" : category.icon === "users" ? "👥" : "📦"}
                  </span>
                </div>
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{category.name}</span>
                    <Badge variant="secondary">Active</Badge>
                  </CardTitle>
                  <CardDescription>
                    {category.description} • Owner: {category.department?.name || "Unknown"}
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.services?.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
