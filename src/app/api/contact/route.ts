import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Message must contain at least 5 characters." },
        { status: 400 }
      );
    }

    const result = await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      subject: subject || "general",
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
      simulated: (result as any)?.simulated || false,
    });
  } catch (error: any) {
    console.error("[API /api/contact Error]:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to send message at this moment. Please email flexstudio@kauxync.in directly.",
      },
      { status: 500 }
    );
  }
}
