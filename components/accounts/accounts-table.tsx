"use client"

import type { Account } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Building2, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { EditAccountDialog } from "./edit-account-dialog"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AccountsTableProps {
  accounts: (Account & { tickets?: any[] })[]
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  const handleStatusToggle = async (account: Account) => {
    try {
      const supabase = createClient()
      const newStatus = account.status === "active" ? "suspended" : "active"

      const { error } = await supabase.from("accounts").update({ status: newStatus }).eq("id", account.id)

      if (error) throw error

      toast.success(`Account ${newStatus === "active" ? "activated" : "suspended"} successfully`)
      router.refresh()
    } catch (error) {
      console.error("Error updating account status:", error)
      toast.error("Failed to update account status")
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Support Channel</TableHead>
              <TableHead>Total Tickets</TableHead>
              <TableHead>Open Tickets</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => {
              const totalTickets = account.tickets?.length || 0
              const openTickets = account.tickets?.filter((t) => t.status === "open").length || 0

              return (
                <TableRow key={account.id}>
                  <TableCell>
                    <Link href={`/dashboard/accounts/${account.id}`} className="hover:underline">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        {account.description && (
                          <div className="text-sm text-muted-foreground">{account.description}</div>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getSupportChannelIcon(account.support_channel)}
                      <span className="capitalize">{account.support_channel}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{totalTickets}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${openTickets > 0 ? "text-orange-600" : "text-green-600"}`}>
                      {openTickets}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{formatDate(account.created_at)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/accounts/${account.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <EditAccountDialog
                          account={account}
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Account</DropdownMenuItem>
                          }
                        />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/tickets?account=${account.id}`}>View Tickets</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Add Contact</DropdownMenuItem>
                        <DropdownMenuItem
                          className={account.status === "suspended" ? "text-green-600" : "text-red-600"}
                          onClick={() => handleStatusToggle(account)}
                        >
                          {account.status === "active" ? "Suspend" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
