"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  user_metadata?: { full_name?: string }
}

interface Profile {
  id: string
  full_name?: string
  first_name?: string
  last_name?: string
  role?: string
  avatar_url?: string
  department?: { name: string; id: string }
}

interface UserNavProps {
  user: User
  profile: Profile | null
}

export function UserNav({ user, profile }: UserNavProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    // For testing, just redirect to login
    router.push("/auth/login")
  }

  const initials =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`
      : user.email?.[0]?.toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-full justify-start">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={user.email} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <p className="text-sm font-medium leading-none">
              {profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{profile?.role || "user"}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span className="mr-2">👤</span>
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="mr-2">⚙️</span>
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <span className="mr-2">🚪</span>
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
