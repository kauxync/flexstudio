"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Ban, ArrowLeft, ShoppingBag } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const cancelRequested = useRef(false);

  // Cancel the order in DB + Cashfree and release the coupon usage
  useEffect(() => {
    if (!orderId || cancelRequested.current) return;
    cancelRequested.current = true;

    fetch(`/api/orders/${orderId}/cancel`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        // Payment actually succeeded after all — show the success flow instead
        if (data?.status === "paid") {
          window.location.replace(`/payment-success?order_id=${orderId}`);
        }
      })
      .catch(() => {});
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AnimatedSection animation="fade-up">
        <div className="max-w-md w-full text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-500/10 mx-auto mb-6">
            <Ban className="w-10 h-10 text-orange-500" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-2">
            Your payment was cancelled. You have not been charged.
          </p>
          {orderId && (
            <p className="text-xs text-muted-foreground/60 mb-8 font-mono">
              Order: {orderId.slice(0, 16)}...
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/cart">
              <Button className="rounded-xl px-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Return to Cart
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" className="rounded-xl px-6">
                <ShoppingBag className="w-4 h-4 mr-2" /> Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
