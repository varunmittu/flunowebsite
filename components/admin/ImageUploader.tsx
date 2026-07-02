"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageSlotProps {
  index: number;
  url: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

function ImageSlot({ index, url, onUpload, onRemove }: ImageSlotProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Images only"); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Max 10 MB"); return; }

    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        onUpload(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Network error — try again");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const label = index === 0 ? "Main Image" : `Image ${index + 1}`;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] text-white/35 uppercase tracking-wider">{label}</span>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />

      {url ? (
        <div className="relative group aspect-square rounded-2xl overflow-hidden border border-fluno-purple/40 hover:border-fluno-purple transition-colors">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={label}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/300x300?text=Image"; }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <X size={13} />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/85 text-gray-800 text-[10px] font-body px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow whitespace-nowrap"
          >
            Replace
          </button>
          {index === 0 && (
            <span className="absolute top-2 left-2 bg-fluno-purple text-white text-[9px] font-mono px-2 py-0.5 rounded-full">
              MAIN
            </span>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded-2xl border border-dashed border-white/[0.15] hover:border-fluno-purple/60 hover:bg-fluno-purple/[0.06] transition-all flex flex-col items-center justify-center gap-2 text-white/25 hover:text-fluno-purple/70 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin text-fluno-purple" />
              <span className="font-body text-[11px] text-white/50">Uploading…</span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-white/[0.07] flex items-center justify-center">
                {index === 0 ? <Upload size={18} /> : <ImageIcon size={18} />}
              </div>
              <span className="font-body text-[11px] text-center px-2">Click to upload</span>
              <span className="font-mono text-[9px] text-white/25">JPG · PNG · WebP</span>
            </>
          )}
        </button>
      )}

      {error && <p className="font-mono text-[10px] text-red-400">{error}</p>}
    </div>
  );
}

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  count?: number;
}

export default function ImageUploader({ images, onChange, count = 4 }: ImageUploaderProps) {
  function handleUpload(index: number, url: string) {
    const next = [...images];
    next[index] = url;
    onChange(next);
  }

  function handleRemove(index: number) {
    const next = [...images];
    next[index] = "";
    onChange(next.filter(Boolean));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <ImageSlot
            key={i}
            index={i}
            url={images[i] || ""}
            onUpload={(url) => handleUpload(i, url)}
            onRemove={() => handleRemove(i)}
          />
        ))}
      </div>
      <p className="font-mono text-[10px] text-white/25">
        First image is the main product image · Max 10 MB per image · Saved to Google Drive
      </p>
    </div>
  );
}
