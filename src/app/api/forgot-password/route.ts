import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: "If an account exists with that email, a reset link has been sent." });
    }

    // Delete any existing tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save the token
    await prisma.verificationToken.create({
      data: {
        identifier: `reset:${email}`,
        token,
        expires,
      },
    });

    // In production, send email here with the reset link:
    // const resetUrl = `${process.env.NEXTAPP_URL}/reset-password?token=${token}&email=${email}`;
    // await sendEmail({ to: email, subject: "Reset your password", ... });

    console.log(`Reset token for ${email}: ${token}`);

    return NextResponse.json({
      message: "If an account exists with that email, a reset link has been sent.",
      // For development only - remove in production
      resetToken: token,
      resetUrl: `/reset-password?token=${token}&email=${encodeURIComponent(email)}`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
