import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/messages", req.url));
  }

  const protectedRoutes = ["/messages", "/notifications", "/profiles"];

  if (!token && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
  if (token && ["/auth/signin", "/auth/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/messages", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/messages",
    "/notifications",
    "/profiles",
    "/auth/signin",
    "/auth/signup",
  ],
};
