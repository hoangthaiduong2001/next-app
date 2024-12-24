import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "./config/utils";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants/auth";
import { Role } from "./constants/type";

const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const publicPaths = ["/login"];
const privatePaths = [...managePaths, ...guestPaths];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value;
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }
  if (refreshToken) {
    if (publicPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set(REFRESH_TOKEN, refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    const role = decodeToken(refreshToken).role;
    if (
      (role === Role.Guest &&
        managePaths.some((path) => pathname.startsWith(path))) ||
      (role !== Role.Guest &&
        guestPaths.some((path) => pathname.startsWith(path)))
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/guest/:paths*", "/login"],
};
