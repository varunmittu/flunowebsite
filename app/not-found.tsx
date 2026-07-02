import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-fluno-light">
      <div className="text-center max-w-md">
        <p
          className="font-brand font-bold text-fluno-purple/20 leading-none select-none"
          style={{ fontSize: "clamp(6rem, 20vw, 10rem)" }}
        >
          404
        </p>
        <h1 className="font-display text-2xl text-fluno-ink font-semibold -mt-4 mb-3">
          This page has evaporated
        </h1>
        <p className="font-body text-sm text-fluno-ink/55 leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Let&apos;s get you back to something that does.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            <ArrowLeft size={15} /> Back to Home
          </Link>
          <Link href="/shop" className="btn-outline">
            <Search size={15} /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
