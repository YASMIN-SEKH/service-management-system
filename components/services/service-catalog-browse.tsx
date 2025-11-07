import type { ServiceCategory } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ServiceRequestCard } from "./service-request-card"
import { Search } from "lucide-react"

interface ServiceCatalogBrowseProps {
  categories: ServiceCategory[]
}

export function ServiceCatalogBrowse({ categories }: ServiceCatalogBrowseProps) {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Browse Services</CardTitle>
          <CardDescription>Find and request services from various departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search services..." className="pl-8" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="popularity">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="time">Est. Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Service Categories */}
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white`}
                style={{ backgroundColor: category.color || "#3b82f6" }}
              >
                <span className="text-lg">
                  {category.icon === "laptop" ? "💻" : category.icon === "users" ? "👥" : "📦"}
                </span>
              </div>
              <div>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.services
                ?.filter((service) => service.is_active)
                .map((service) => (
                  <ServiceRequestCard key={service.id} service={service} />
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
