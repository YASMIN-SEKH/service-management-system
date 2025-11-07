import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Temporarily disabled for testing
  return
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
