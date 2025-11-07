import type React from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "@/components/layout/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mock user data for testing
  const mockUser = {
    id: "test-user-id",
    email: "test@example.com",
    user_metadata: { full_name: "Test User" },
  }

  const mockProfile = {
    id: "test-user-id",
    full_name: "Test User",
    role: "admin",
    department: { name: "IT Support", id: "dept-1" },
  }

  return (
    <SidebarProvider>
      <AppSidebar user={mockUser} profile={mockProfile} />
      <SidebarInset>
        <Header user={mockUser} profile={mockProfile} />
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
