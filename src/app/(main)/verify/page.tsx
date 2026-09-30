"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email || !token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    fetch(`/api/verify?email=${encodeURIComponent(email)}&token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong");
      });
  }, [email, token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="relative w-full max-w-md px-4">
        <AnimatedSection animation="scale-up">
          <div className="p-8 rounded-3xl border border-border/30 bg-card/20 backdrop-blur-sm text-center">
            {status === "loading" && (
              <>
                <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
                <h1 className="font-display text-2xl font-bold mb-2">Verifying your email...</h1>
                <p className="text-muted-foreground">Please wait while we verify your email address.</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h1 className="font-display text-2xl font-bold mb-2">Email Verified!</h1>
                <p className="text-muted-foreground mb-6">{message}</p>
                <Link href="/login">
                  <Button className="rounded-xl px-8">Continue to Login</Button>
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 mx-auto mb-6">
                  <XCircle className="w-8 h-8 text-error" />
                </div>
                <h1 className="font-display text-2xl font-bold mb-2">Verification Failed</h1>
                <p className="text-muted-foreground mb-6">{message}</p>
                <Link href="/login">
                  <Button variant="outline" className="rounded-xl px-8">Go to Login</Button>
                </Link>
              </>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
