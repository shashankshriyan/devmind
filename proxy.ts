// proxy.ts
export { auth as proxy } from "@/lib/auth"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/code-review/:path*",
    "/compiler/:path*",
    "/interview-prep/:path*",
    "/practice/:path*",
  ]
}