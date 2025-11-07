import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { UserNav } from "./user-nav"

interface User {
  id: string
  email: string
  user_metadata?: { full_name?: string }
}

interface Profile {
  id: string
  full_name?: string
  role?: string
  department?: { name: string; id: string }
}

interface AppSidebarProps {
  user: User
  profile: Profile | null
}

const navigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "🏠",
  },
  {
    title: "Accounts",
    url: "/dashboard/accounts",
    icon: "🏢",
  },
  {
    title: "Tickets",
    url: "/dashboard/tickets",
    icon: "🎫",
  },
  {
    title: "Workflows",
    url: "/dashboard/workflows",
    icon: "⚡",
  },
  {
    title: "Asset Management",
    url: "/dashboard/assets",
    icon: "📦",
  },
  {
    title: "Services",
    url: "/dashboard/services",
    icon: "📋",
  },
  {
    title: "Knowledge Base",
    url: "/dashboard/knowledge",
    icon: "📚",
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: "📊",
  },
]

const adminNavigation = [
  {
    title: "Integrations",
    url: "/dashboard/integrations",
    icon: "⚙️",
  },
  {
    title: "Approval Workflows",
    url: "/dashboard/approvals",
    icon: "✅",
  },
  {
    title: "SLA Management",
    url: "/dashboard/sla",
    icon: "🛡️",
  },
  {
    title: "Service Catalog",
    url: "/dashboard/catalog",
    icon: "📋",
  },
  {
    title: "Users & Teams",
    url: "/dashboard/users",
    icon: "👥",
  },
  {
    title: "Security & Access",
    url: "/dashboard/security",
    icon: "🔒",
  },
]

export function AppSidebar({ user, profile }: AppSidebarProps) {
  const isAdmin = profile?.role === "admin" || profile?.role === "manager"

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span>🛡️</span>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">SERVICE MANAGEMENT</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>ADMINISTRATION</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <UserNav user={user} profile={profile} />
      </SidebarFooter>
    </Sidebar>
  )
}
