"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Download, ShoppingBag } from "lucide-react";
import { useActivity } from "@/hooks/use-activity";

type OrderStatus = "loading" | "paid" | "pending" | "failed";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { log } = useActivity();
  const orderId = searchParams.get("order_id");
  const cfStatus = searchParams.get("cf_status");
  const [status, setStatus] = useState<OrderStatus>("loading");
  const [pollCount, setPollCount] = useState(0);

  const checkOrder = useCallback(async () => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    // Cashfree explicitly says payment was aborted
    if (cfStatus === "ABORTED" || cfStatus === "TERMINATED") {
      router.replace(`/payment-cancel?order_id=${orderId}`);
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();

      if (data.order) {
        if (data.order.status === "paid") {
          setStatus("paid");
          log("payment_success", { orderId, total: data.order.total });
          window.dispatchEvent(new Event("cart-updated"));
        } else if (data.order.status === "failed") {
          setStatus("failed");
          log("payment_failed", { orderId });
        } else {
          setStatus("pending");
        }
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("pending");
    }
  }, [orderId, cfStatus, router]);

  useEffect(() => {
    checkOrder();
  }, [checkOrder]);

  // Poll for pending (max 10 times, 3s apart = 30s total)
  useEffect(() => {
    if (status !== "pending" || pollCount >= 10) return;
    const timer = setTimeout(() => {
      setPollCount((p) => p + 1);
      checkOrder();
    }, 3000);
    return () => clearTimeout(timer);
  }, [status, pollCount, checkOrder]);

  // Only show failed after all polling exhausted
  useEffect(() => {
    if (status === "pending" && pollCount >= 10) {
      setStatus("failed");
    }
  }, [status, pollCount]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <div className="animate-fade-in-up">
            <Loader2 className="w-16 h-16 text-gold mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Verifying payment...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your order.</p>
          </div>
        )}

        {status === "paid" && (
          <div className="animate-fade-in-up">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-2">Your order has been confirmed.</p>
            {orderId && <p className="text-xs text-muted-foreground/60 mb-8 font-mono">Order: {orderId.slice(0, 16)}...</p>}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard/orders">
                <Button className="rounded-xl px-6"><Download className="w-4 h-4 mr-2" /> View Orders</Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" className="rounded-xl px-6"><ShoppingBag className="w-4 h-4 mr-2" /> Browse More</Button>
              </Link>
            </div>
          </div>
        )}

        {status === "pending" && (
          <div className="animate-fade-in-up">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10 mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
            <p className="text-muted-foreground mb-6">Checking payment status... ({pollCount + 1}/10)</p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={checkOrder} variant="outline" className="rounded-xl px-6">Check Now</Button>
              <Link href="/dashboard/orders"><Button className="rounded-xl px-6">View Orders</Button></Link>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="animate-fade-in-up">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Not Confirmed</h1>
            <p className="text-muted-foreground mb-8">We could not confirm your payment. Check your orders or try again.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard/orders"><Button className="rounded-xl px-6">View Orders</Button></Link>
              <Link href="/cart"><Button variant="outline" className="rounded-xl px-6">Back to Cart</Button></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
