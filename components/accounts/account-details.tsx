import type { Account } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Mail, Phone, Calendar } from "lucide-react"
import { EditAccountDialog } from "./edit-account-dialog"

interface AccountDetailsProps {
  account: Account
}

export function AccountDetails({ account }: AccountDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case "suspended":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getSupportChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-5 w-5" />
      case "phone":
        return <Phone className="h-5 w-5" />
      default:
        return <Building2 className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{account.name}</CardTitle>
            {account.description && <CardDescription className="text-base mt-2">{account.description}</CardDescription>}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className={getStatusColor(account.status)}>
              {account.status}
            </Badge>
            <EditAccountDialog account={account} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {getSupportChannelIcon(account.support_channel)}
              <div>
                <p className="text-sm font-medium">Preferred Support Channel</p>
                <p className="text-sm text-muted-foreground mt-1 capitalize">{account.support_channel}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Account Created</p>
                <p className="text-sm text-muted-foreground mt-1">{formatDate(account.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Account Type</p>
                <p className="text-sm text-muted-foreground mt-1">Business Account</p>
              </div>
            </div>

            {account.updated_at && (
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground mt-1">{formatDate(account.updated_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Account Overview</h4>
          <p className="text-muted-foreground">
            This account was created on {formatDate(account.created_at)} and is currently {account.status}. The
            preferred support channel is {account.support_channel}. All tickets and communications for this account are
            tracked and managed through this system.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
