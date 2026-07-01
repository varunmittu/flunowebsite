"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, HardDrive, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function DriveSetupContent() {
  const params = useSearchParams();
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
    <div className="flex-1 p-6 lg:p-10 bg-fluno-light min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard" className="p-2 rounded-xl text-fluno-muted hover:bg-fluno-lavender transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl text-fluno-ink">Google Drive Setup</h1>
          <p className="font-body text-sm text-fluno-muted mt-0.5">Connect your Google Drive for product image storage</p>
        </div>
      </div>

      <div className="max-w-lg space-y-4">
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="font-body text-sm font-medium text-green-800">Google Drive connected successfully!</p>
              <p className="font-mono text-xs text-green-600 mt-0.5">You can now upload product images directly from your local drive.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm font-medium text-red-700">Connection failed</p>
              <p className="font-mono text-xs text-red-500 mt-0.5">{decodeURIComponent(error)}</p>
              <p className="font-body text-xs text-red-600 mt-2">Try connecting again below.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-fluno-lavender p-8">
          <div className="w-14 h-14 bg-fluno-purple/10 rounded-2xl flex items-center justify-center mb-5">
            <HardDrive size={26} className="text-fluno-purple" />
          </div>

          <h2 className="font-display text-lg text-fluno-ink mb-2">
            {success ? "Drive Connected" : "Connect Google Drive"}
          </h2>
          <p className="font-body text-sm text-fluno-muted leading-relaxed mb-6">
            {success
              ? "Your Google Drive is linked. Product images you upload in the admin panel will be saved to your Drive folder automatically."
              : "Click below to authorize Fluno to upload product images to your Google Drive. You'll be redirected to Google to approve access — this is a one-time setup."}
          </p>

          <button
            onClick={connect}
            disabled={status === "loading"}
            className="btn-primary w-full justify-center py-3"
          >
            {status === "loading" ? (
              <><Loader2 size={16} className="animate-spin" /> Redirecting to Google…</>
            ) : success ? (
              "Re-connect Google Drive"
            ) : (
              "Connect Google Drive"
            )}
          </button>

          {!success && (
            <p className="font-mono text-[10px] text-fluno-muted text-center mt-4">
              Only grants access to files created by this app · Revocable anytime from myaccount.google.com
            </p>
          )}
        </div>

        {success && (
          <div className="bg-white rounded-2xl border border-fluno-lavender p-6">
            <h3 className="font-display text-sm text-fluno-ink mb-3">What&apos;s next?</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 font-body text-sm text-fluno-muted">
                <CheckCircle size={14} className="text-fluno-purple flex-shrink-0" />
                Go to <Link href="/admin/products/new" className="text-fluno-purple hover:underline">Add Product</Link> and upload up to 4 images per product
              </li>
              <li className="flex items-center gap-2 font-body text-sm text-fluno-muted">
                <CheckCircle size={14} className="text-fluno-purple flex-shrink-0" />
                Images are saved to your &ldquo;Fluno Product Images&rdquo; folder in Google Drive
              </li>
              <li className="flex items-center gap-2 font-body text-sm text-fluno-muted">
                <CheckCircle size={14} className="text-fluno-purple flex-shrink-0" />
                Images are made public automatically so they appear on the website
              </li>
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
      <div className="flex-1 p-6 lg:p-10 bg-fluno-light min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-fluno-purple" />
      </div>
    }>
      <DriveSetupContent />
    </Suspense>
  );
}
