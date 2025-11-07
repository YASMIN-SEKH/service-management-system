import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock } from "lucide-react"

interface SLABreachIndicatorProps {
  isBreached: boolean
  timeRemaining?: number
  type: "response" | "resolution"
}

export function SLABreachIndicator({ isBreached, timeRemaining, type }: SLABreachIndicatorProps) {
  if (isBreached) {
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
        <AlertTriangle className="h-3 w-3 mr-1" />
        {type === "response" ? "Response" : "Resolution"} Breached
      </Badge>
    )
  }

  if (timeRemaining !== undefined && timeRemaining > 0) {
    const hours = Math.floor(timeRemaining / 60)
    const minutes = timeRemaining % 60
    const isUrgent = timeRemaining < 60 // Less than 1 hour remaining

    return (
      <Badge
        variant="secondary"
        className={
          isUrgent
            ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
            : "bg-green-100 text-green-800 hover:bg-green-100"
        }
      >
        <Clock className="h-3 w-3 mr-1" />
        {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`} left
      </Badge>
    )
  }

  return null
}
