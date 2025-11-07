import type { Profile } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, Phone } from "lucide-react"

interface AccountContactsProps {
  contacts: Profile[]
  accountId: string
}

export function AccountContacts({ contacts, accountId }: AccountContactsProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "manager":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "agent":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "user":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Account Contacts</CardTitle>
            <CardDescription>Users associated with this account</CardDescription>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact) => {
              const initials = `${contact.first_name?.[0] || ""}${contact.last_name?.[0] || ""}`

              return (
                <div key={contact.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">
                        {`${contact.first_name || ""} ${contact.last_name || ""}`.trim() || contact.email}
                      </p>
                      <Badge variant="secondary" className={getRoleColor(contact.role)}>
                        {contact.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                    {contact.phone && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{contact.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    {contact.phone && (
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No contacts found for this account.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
