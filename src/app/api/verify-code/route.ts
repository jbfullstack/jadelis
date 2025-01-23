import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // Extract code from the request body
  const { code } = body;

  // Verify the code (replace "your-secret-code" with the actual code or environment variable)
  const validCode = process.env.SECRET_ACCESS_CODE || "your-secret-code";

  if (code === validCode) {
    return NextResponse.json({
      success: true,
      redirectTo: req.headers.get("referer") || "/",
    });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
