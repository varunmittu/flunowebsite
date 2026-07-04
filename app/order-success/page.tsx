"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen bg-fig-cream">
      <div className="reveal max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-fig-sage/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-fig-sage" />
        </div>
        <h1 className="font-fig font-bold text-4xl text-fig-navy mb-3">Order Confirmed!</h1>
        {orderId && (
          <p className="font-fig-body text-sm text-fig-terracotta mb-2">Order ID: {orderId}</p>
        )}
        <p className="font-fig-body text-fig-ink-soft mt-3 leading-relaxed">
          Thank you for your order. You&apos;ll receive a confirmation email shortly.
          We&apos;ll notify you when it&apos;s dispatched.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <Link href="/account" className="fig-btn">Track My Order</Link>
          <Link href="/shop" className="fig-btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-fig-cream py-20 text-center font-fig-body text-fig-ink-soft">Loading…</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
