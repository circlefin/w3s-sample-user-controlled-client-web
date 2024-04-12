import { NextResponse } from "next/server";

/**
 * Health check endpoint.
 */
export async function GET() {
  return NextResponse.json("pong", { status: 200 });
}
