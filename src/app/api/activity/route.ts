import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Log an activity
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, details } = await req.json();

    if (!action) {
      return NextResponse.json({ error: "Action required" }, { status: 400 });
    }

    const metadata = req.headers.get("user-agent") || "";

    await prisma.activity.create({
      data: {
        userId: (session.user as any).id,
        action,
        details: details ? JSON.stringify(details) : null,
        metadata,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ACTIVITY_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Get user activities
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activities = await prisma.activity.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ activities });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
