import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const protectedRoutes = [
  "/dashboard",
  "/students",
  "/student",
  "/create-batch",
  "/add-student-to-batch",
  "/batches",
];

const paidRoutes = [
  "/create-batch",
  "/add-student-to-batch",
  "/batches",
];

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  // Only check routes in protectedRoutes
  if (!protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Block free users from paid routes
    if (paidRoutes.some(route => pathname.startsWith(route)) && decoded.plan !== "Paid") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // You can attach user info to headers if needed
    req.headers.set("x-user-id", decoded.userId);
    req.headers.set("x-user-plan", decoded.plan);

    return NextResponse.next();
  } catch (err) {
    console.log("JWT error:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Which paths middleware runs on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/students/:path*",
    "/student/:path*",
    "/create-batch/:path*",
    "/add-student-to-batch/:path*",
    "/batches/:path*",
  ],
};
