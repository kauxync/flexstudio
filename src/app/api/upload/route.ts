import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateTemplateCode, isValidTemplateCode } from "@/lib/template-code";

// Max sizes: 15MB for images, 500MB for ZIP archives
const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const MAX_ZIP_SIZE = 500 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any)?.role;
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const hostingerUrl = process.env.HOSTINGER_UPLOAD_URL;
    const hostingerKey = process.env.HOSTINGER_UPLOAD_KEY;

    if (!hostingerUrl || !hostingerKey) {
      return NextResponse.json(
        {
          error:
            "Hostinger storage is not configured yet. Please add HOSTINGER_UPLOAD_URL and HOSTINGER_UPLOAD_KEY to your .env file.",
          configured: false,
        },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "gallery";
    let templateCode = (formData.get("template_code") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Ensure valid 8-character template code
    if (!templateCode || !isValidTemplateCode(templateCode)) {
      templateCode = generateTemplateCode();
    }

    // Validate size based on file type
    const maxSize = type === "zip" ? MAX_ZIP_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      const maxMb = maxSize / (1024 * 1024);
      return NextResponse.json(
        { error: `File exceeds maximum allowed size of ${maxMb} MB` },
        { status: 400 }
      );
    }

    // Prepare payload to forward to Hostinger PHP backend
    const uploadPayload = new FormData();
    uploadPayload.append("file", file, file.name);
    uploadPayload.append("type", type);
    uploadPayload.append("template_code", templateCode);

    const hostingerRes = await fetch(hostingerUrl, {
      method: "POST",
      headers: {
        "X-Api-Key": hostingerKey,
      },
      body: uploadPayload,
    });

    const data = await hostingerRes.json().catch(() => null);

    if (!hostingerRes.ok || !data?.success) {
      const errMsg = data?.error || `Hostinger upload failed with status ${hostingerRes.status}`;
      return NextResponse.json({ error: errMsg }, { status: hostingerRes.status || 500 });
    }

    return NextResponse.json({
      success: true,
      url: data.url,
      filename: data.filename,
      size: data.size,
      type: data.type,
      template_code: data.template_code,
    });
  } catch (error: any) {
    console.error("[UPLOAD_API_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during upload" },
      { status: 500 }
    );
  }
}
