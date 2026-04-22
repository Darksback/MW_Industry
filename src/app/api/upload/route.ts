import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  // Only allow authenticated admins to upload
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: "No file body" }, { status: 400 });
  }

  const blob = await put(filename, request.body, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json(blob);
}
