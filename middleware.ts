import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(req: NextRequest) {
  //hitting edge runtime error, putted the checking in the layout file (also as per the docs)
  //middleware from authjs docs also hits edge runtime error
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
