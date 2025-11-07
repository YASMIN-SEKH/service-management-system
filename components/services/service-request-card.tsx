import type { Service } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Star } from "lucide-react"
import Link from "next/link"

interface ServiceRequestCardProps {
  service: Service
}

export function ServiceRequestCard({ service }: ServiceRequestCardProps) {
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
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {renderStars(service.rating)}
            <span className="text-sm text-muted-foreground ml-2">{service.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTime(service.estimated_time_hours)}</span>
          </div>
        </div>
        <Button className="w-full" asChild>
          <Link href={`/dashboard/tickets/create?service=${service.id}`}>Request</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
