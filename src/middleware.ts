import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/category", "/supercategory"];
const accessCode = process.env.SECRET_ACCESS_CODE || "default-code"; // Load from environment variables

export function middleware(req: NextRequest) {
  console.log("Middleware triggered for:", req.nextUrl.pathname);

  const protectedPaths = ["/category", "/supercategory"];
  const accessCode = process.env.SECRET_ACCESS_CODE || "default-code";

  // Check if the route is protected
  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    const enteredCode = req.cookies.get("access_code")?.value;

    // Redirect to the access page if no valid code
    if (enteredCode !== accessCode) {
      const url = req.nextUrl.clone();
      url.pathname = "/access";
      url.searchParams.set("redirectTo", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/category/:path*",
    "/supercategory/:path*",
    "/api/categories/:path*",
    "/api/supercategories/:path*",
  ],
};
