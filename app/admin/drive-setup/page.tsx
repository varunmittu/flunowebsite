"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, HardDrive, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const PANEL = { background: "rgba(255,255,255,0.04)" };

function DriveSetupContent() {
  const params  = useSearchParams();
  const success = params.get("success");
  const error   = params.get("error");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  useEffect(() => {
    if (success || error) setStatus("idle");
  }, [success, error]);

  function connect() {
    setStatus("loading");
    window.location.href = "/api/admin/drive/auth";
  }

  return (
    <div className="flex-1 p-6 lg:p-8 min-h-screen">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/dashboard"
          className="p-2 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="font-mono text-[9px] text-fig-terracotta/45 tracking-[0.22em] uppercase mb-1">System</p>
          <h1 className="font-fig font-bold text-2xl text-white">Google Drive Setup</h1>
          <p className="font-fig-body text-sm text-white/35 mt-0.5">
            Connect your Drive for product image storage
          </p>
        </div>
      </div>

      <div className="max-w-lg space-y-4">

        {/* Success banner */}
        {success && (
          <div
            className="flex items-start gap-3 rounded-2xl px-5 py-4 border border-green-500/20"
            style={{ background: "rgba(34,197,94,0.08)" }}
          >
            <CheckCircle size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-fig-body text-sm font-medium text-green-300">
                Google Drive connected successfully!
              </p>
              <p className="font-mono text-xs text-green-400/70 mt-0.5">
                You can now upload product images directly from your local drive.
              </p>
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div
            className="flex items-start gap-3 rounded-2xl px-5 py-4 border border-red-500/20"
            style={{ background: "rgba(239,68,68,0.08)" }}
          >
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-fig-body text-sm font-medium text-red-300">Connection failed</p>
              <p className="font-mono text-xs text-red-400/70 mt-0.5">
                {decodeURIComponent(error)}
              </p>
              <p className="font-fig-body text-xs text-red-400/60 mt-2">Try connecting again below.</p>
            </div>
          </div>
        )}

        {/* Main card */}
        <div className="rounded-2xl border border-white/[0.07] p-8" style={PANEL}>
          <div className="w-12 h-12 bg-fig-terracotta/15 border border-fig-terracotta/20 rounded-2xl flex items-center justify-center mb-5">
            <HardDrive size={22} className="text-fig-terracotta" />
          </div>

          <h2 className="font-fig font-bold text-base font-semibold text-white mb-2">
            {success ? "Drive Connected" : "Connect Google Drive"}
          </h2>
          <p className="font-fig-body text-sm text-white/45 leading-relaxed mb-6">
            {success
              ? "Your Google Drive is linked. Product images you upload will be saved to your Drive folder automatically."
              : "Click below to authorize Fluno to upload product images to your Google Drive. You'll be redirected to Google to approve access — this is a one-time setup."}
          </p>

          <button
            onClick={connect}
            disabled={status === "loading"}
            className="btn-primary w-full justify-center py-3"
          >
            {status === "loading" ? (
              <><Loader2 size={15} className="animate-spin" /> Redirecting to Google…</>
            ) : success ? (
              "Re-connect Google Drive"
            ) : (
              "Connect Google Drive"
            )}
          </button>

          {!success && (
            <p className="font-mono text-[10px] text-white/20 text-center mt-4">
              Only grants access to files created by this app · Revocable anytime from myaccount.google.com
            </p>
          )}
        </div>

        {/* What's next card */}
        {success && (
          <div className="rounded-2xl border border-white/[0.07] p-6" style={PANEL}>
            <h3 className="font-fig font-bold text-sm font-semibold text-white mb-3">What&apos;s next?</h3>
            <ul className="space-y-2.5">
              {[
                <>Go to <Link href="/admin/products/new" className="text-fig-terracotta hover:underline">Add Product</Link> and upload up to 4 images per product</>,
                <>Images are saved to your &ldquo;Fluno Product Images&rdquo; folder in Google Drive</>,
                <>Images are made public automatically so they appear on the website</>,
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2.5 font-fig-body text-sm text-white/45">
                  <CheckCircle size={13} className="text-fig-terracotta/70 flex-shrink-0 mt-0.5" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DriveSetupPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <Loader2 size={26} className="animate-spin text-fig-terracotta/60" />
      </div>
    }>
      <DriveSetupContent />
    </Suspense>
  );
}
