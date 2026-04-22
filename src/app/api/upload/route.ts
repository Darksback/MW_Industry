import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PLACEHOLDER_TOKEN = "vercel_blob_token";

export async function POST(request: Request) {
  // Only allow authenticated admins to upload
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") ?? "upload";

  if (!request.body) {
    return NextResponse.json({ error: "No file body" }, { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const hasRealToken = token && token !== PLACEHOLDER_TOKEN;

  // ── Vercel Blob (production / real token) ──────────────────────────────
  if (hasRealToken) {
    try {
      const blob = await put(filename, request.body, {
        access: "public",
        addRandomSuffix: true,
      });
      return NextResponse.json(blob);
    } catch (err) {
      console.error("[upload] Vercel Blob error:", err);
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Blob upload failed" },
        { status: 500 }
      );
    }
  }

  // ── Base64 fallback (local dev without a real token) ───────────────────
  try {
    const buffer = await request.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Guess MIME type from file extension
    const ext = filename.split(".").pop()?.toLowerCase() ?? "jpeg";
    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg", jpeg: "image/jpeg",
      png: "image/png", gif: "image/gif",
      webp: "image/webp", svg: "image/svg+xml",
    };
    const mime = mimeMap[ext] ?? "image/jpeg";
    const dataUri = `data:${mime};base64,${base64}`;

    console.warn(
      "[upload] No BLOB_READ_WRITE_TOKEN set — using Base64 fallback. " +
      "Set a real token for production."
    );

    // Return a shape that matches the Vercel Blob response
    return NextResponse.json({ url: dataUri, pathname: filename });
  } catch (err) {
    console.error("[upload] Base64 fallback error:", err);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}

