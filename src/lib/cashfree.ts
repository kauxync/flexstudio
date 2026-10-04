const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || "2023-08-01";
const CASHFREE_ENV = process.env.CASHFREE_ENV || "sandbox";

const BASE_URL =
  CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

function headers() {
  return {
    "x-client-id": CASHFREE_APP_ID,
    "x-client-secret": CASHFREE_SECRET_KEY,
    "x-api-version": CASHFREE_API_VERSION,
    "Content-Type": "application/json",
  };
}

export interface CashfreeOrderRequest {
  orderId: string;
  orderAmount: number;
  orderCurrency?: string;
  customerDetails: {
    customerId: string;
    customerName?: string;
    customerEmail: string;
    customerPhone: string;
  };
  returnUrl: string;
}

// Payment methods — exclude paylater
// cc=Credit Card, dc=Debit Card, upi, nb=Net Banking, paypal, app=Wallets, ccc=Corporate Card
const PAYMENT_METHODS = "cc,dc,upi,nb,paypal,app,ccc";

export interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  order_status: string;
  order_amount: number;
  payment_session_id: string;
}

export async function createCashfreeOrder(
  req: CashfreeOrderRequest
): Promise<CashfreeOrderResponse> {
  const body = {
    order_id: req.orderId,
    order_amount: req.orderAmount,
    order_currency: req.orderCurrency || "INR",
    customer_details: {
      customer_id: req.customerDetails.customerId,
      customer_name: req.customerDetails.customerName || "",
      customer_email: req.customerDetails.customerEmail,
      customer_phone: req.customerDetails.customerPhone,
    },
    order_meta: {
      return_url: req.returnUrl,
      payment_methods: PAYMENT_METHODS,
    },
  };

  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create Cashfree order");
  }

  return data;
}

export async function fetchCashfreeOrder(orderId: string) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers: headers(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch Cashfree order");
  }

  return data;
}

export async function cancelCashfreeOrder(orderId: string): Promise<boolean> {
  try {
    // Terminate Order API — stops any further payment against this order
    const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ order_status: "TERMINATED" }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error(
        "[CASHFREE_CANCEL]",
        orderId,
        res.status,
        data?.message || "Failed to terminate Cashfree order"
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("[CASHFREE_CANCEL]", orderId, error);
    return false;
  }
}

export function verifyWebhookSignature(
  signature: string,
  timestamp: string,
  rawBody: string
): boolean {
  const crypto = require("crypto");
  const signatureData = timestamp + rawBody;
  const generatedSignature = crypto
    .createHmac("sha256", CASHFREE_SECRET_KEY)
    .update(signatureData)
    .digest("base64");
  return generatedSignature === signature;
}
