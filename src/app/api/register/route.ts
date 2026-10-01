import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;
    const isAdminEmail =
      email.toLowerCase() === "flexstudio@kauxync.in" ||
      (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase());
    const role = (isFirstUser || isAdminEmail) ? "super_admin" : "user";

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    // Create verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // In production, send verification email here
    const verifyUrl = `/verify?email=${encodeURIComponent(email)}&token=${token}`;
    console.log(`Verification URL for ${email}: ${verifyUrl}`);

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
      verifyUrl, // For dev mode only
    }, { status: 201 });
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
