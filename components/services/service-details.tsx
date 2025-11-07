import type { Service } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, Building2, Package } from "lucide-react"

interface ServiceDetailsProps {
  service: Service & {
    category?: {
      name: string
      department?: { name: string }
    }
  }
}

export function ServiceDetails({ service }: ServiceDetailsProps) {
  const formatTime = (hours: number) => {
    if (hours < 24) {
      return `${hours} hours`
    } else if (hours < 168) {
      return `${Math.floor(hours / 24)} days`
    } else {
      return `${Math.floor(hours / 168)} weeks`
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{service.name}</CardTitle>
            <CardDescription className="text-base mt-2">{service.description}</CardDescription>
          </div>
          <Badge variant={service.is_active ? "default" : "secondary"}>
            {service.is_active ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Rating</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">{renderStars(service.rating)}</div>
                  <span className="text-sm text-muted-foreground">{service.rating.toFixed(1)} out of 5</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Estimated Time</p>
                <p className="text-sm text-muted-foreground mt-1">{formatTime(service.estimated_time_hours)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {service.category && (
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground mt-1">{service.category.name}</p>
                </div>
              </div>
            )}

            {service.category?.department && (
              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-sm text-muted-foreground mt-1">{service.category.department.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Service Details</h4>
          <p className="text-muted-foreground">
            This service is provided by the {service.category?.department?.name || "Unknown"} department. The typical
            turnaround time is {formatTime(service.estimated_time_hours)}. Our team will review your request and get
            back to you as soon as possible.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
