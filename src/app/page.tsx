"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ControlsPanel } from "@/components/controls-panel";
import { DownloadButtons } from "@/components/download-buttons";
import { QRPreview } from "@/components/qr-preview";

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState("https://example.com");
  const [color, setColor] = useState("#0f766e");
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const urlError = useMemo(() => {
    if (!url.trim()) {
      return "URL is required.";
    }
    if (!isValidUrl(url)) {
      return "Please enter a valid URL (including http:// or https://).";
    }
    return null;
  }, [url]);

  return (
    <main className="theme-bg min-h-screen px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8 xl:px-10">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-4 sm:gap-5 md:gap-6">
        <div className="space-y-3 text-left">
          <div className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 sm:text-xs">
            Professional QR Studio
          </div>
          <div className="flex items-center">
            <Image
              src="/select-logo.png"
              alt="Select logo"
              width={220}
              height={60}
              priority
              className="h-auto w-[150px] brightness-0 invert sm:w-[180px] md:w-[220px]"
            />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl md:text-3xl">
              QR Generator
            </h1>
            <p className="max-w-2xl text-xs text-slate-700 dark:text-white/80 sm:text-sm md:text-base">
              Create branded QR codes with instant preview and high-quality exports.
            </p>
          </div>
        </div>

        <div className="grid items-start gap-4 md:gap-5 lg:grid-cols-[minmax(420px,1fr)_minmax(420px,1fr)] lg:gap-6">
          <motion.section
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full self-stretch lg:sticky lg:top-4"
          >
            <ControlsPanel
              url={url}
              color={color}
              error={urlError}
              onUrlChange={setUrl}
              onColorChange={setColor}
              onLogoUpload={setLogoSrc}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full space-y-3 self-stretch sm:space-y-4"
          >
            <QRPreview
              canvasRef={canvasRef}
              value={urlError ? "" : url}
              color={color}
              logoSrc={logoSrc}
              isLoading={isGenerating}
              onLoadingChange={setIsGenerating}
            />
            <DownloadButtons canvasRef={canvasRef} disabled={Boolean(urlError || isGenerating)} />
          </motion.section>
        </div>
      </div>
    </main>
  );
}
