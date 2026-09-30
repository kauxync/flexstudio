"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { CreditCard, Copy, CheckCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="ml-2 text-muted-foreground hover:text-foreground transition-colors">
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function CardRow({ number, expiry, cvv, name }: { number: string; expiry: string; cvv: string; name: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/20 text-sm">
      <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="font-mono text-foreground">{number}</span>
      <CopyButton text={number.replace(/\s/g, "")} />
      <span className="text-muted-foreground">{expiry}</span>
      <span className="text-muted-foreground">{cvv}</span>
      <span className="text-muted-foreground">{name}</span>
    </div>
  );
}

export default function TestCredentialsPage() {
  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <Link href="/checkout" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-3 h-3" /> Back to Checkout
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-3xl font-bold">Test Card Details</h1>
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">Sandbox</Badge>
            </div>
            <p className="text-muted-foreground text-sm">Use these test cards to simulate payments in the Cashfree sandbox environment.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* INR Test Cards */}
          <AnimatedSection animation="fade-up">
            <h2 className="text-lg font-semibold mb-4">INR Test Cards</h2>
            <div className="space-y-2">
              <CardRow number="4706 1312 1121 2123" expiry="03/2028" cvv="123" name="Test" />
              <CardRow number="4576 2389 1277 1450" expiry="03/2028" cvv="123" name="Test" />
              <CardRow number="5409 1626 6938 1034" expiry="03/2028" cvv="123" name="Test" />
              <CardRow number="5105 1051 0510 5100" expiry="03/2028" cvv="123" name="Test" />
            </div>
          </AnimatedSection>

          {/* Common Details */}
          <AnimatedSection animation="fade-up" delay={100}>
            <h2 className="text-lg font-semibold mb-4">Common Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                <p className="text-xs text-muted-foreground mb-1">Expiry</p>
                <p className="text-sm font-mono">03/2028</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                <p className="text-xs text-muted-foreground mb-1">CVV</p>
                <p className="text-sm font-mono">123</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                <p className="text-xs text-muted-foreground mb-1">Cardholder Name</p>
                <p className="text-sm font-mono">Test</p>
              </div>
            </div>
          </AnimatedSection>

          {/* OTP */}
          <AnimatedSection animation="fade-up" delay={200}>
            <h2 className="text-lg font-semibold mb-4">OTP</h2>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/20 inline-flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Enter OTP:</span>
              <span className="text-sm font-mono font-semibold">111000</span>
              <CopyButton text="111000" />
            </div>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection animation="fade-up" delay={300}>
            <Link href="/checkout">
              <Button className="rounded-xl px-6">Back to Checkout</Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
