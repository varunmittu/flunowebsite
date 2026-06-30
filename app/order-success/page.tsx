"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle size={56} className="text-fluno-teal mx-auto mb-5" />
      <h1 className="font-display text-4xl text-fluno-ink mb-3">Order Confirmed!</h1>
      {orderId && (
        <p className="font-mono text-sm text-fluno-teal mb-2">Order ID: {orderId}</p>
      )}
      <p className="font-body text-fluno-ink/60 mt-3 leading-relaxed">
        Thank you for your order. You'll receive a confirmation email shortly.
        We'll notify you when it's dispatched.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
        <Link href="/account" className="btn-primary">Track My Order</Link>
        <Link href="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-body text-fluno-ink/50">Loading…</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
