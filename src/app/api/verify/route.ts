import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Email and token are required" }, { status: 400 });
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier: email, token } },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired verification link" }, { status: 400 });
    }

    // Check if token has expired
    if (new Date() > verificationToken.expires) {
      return NextResponse.json({ error: "Verification link has expired" }, { status: 400 });
    }

    // Verify the user
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    });

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      return NextResponse.json({ error: "Invalid verification link" }, { status: 400 });
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier: email, token } },
    });

    if (!verificationToken) {
      return NextResponse.json({ valid: false, error: "Invalid or expired verification link" });
    }

    // Check if token has expired
    if (new Date() > verificationToken.expires) {
      return NextResponse.json({ valid: false, error: "Verification link has expired" });
    }

    // Verify the user
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    });

    return NextResponse.json({ valid: true, message: "Email verified successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
