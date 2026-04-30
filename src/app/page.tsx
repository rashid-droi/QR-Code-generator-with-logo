"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ControlsPanel } from "@/components/controls-panel";
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
  const [color, setColor] = useState("#012f56");
  const [removeEmblem, setRemoveEmblem] = useState(false);
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
    <main className="theme-bg min-h-screen px-3 py-3 sm:px-4 sm:py-5 md:px-6 md:py-7 xl:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-5 md:gap-6">
        <header className="p-1 sm:p-2">
          <img
            src="select-logo-clean.png?v=1"
            alt="Select company logo"
            width={280}
            height={70}
            className="h-auto w-[170px] drop-shadow-[0_2px_10px_rgba(255,255,255,0.35)] sm:w-[220px] md:w-[260px] lg:w-[300px]"
          />
        </header>
        <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-6">
          <section className="order-2 w-full self-stretch lg:order-1">
            <QRPreview
              canvasRef={canvasRef}
              value={urlError ? "" : url}
              color={color}
              removeEmblem={removeEmblem}
              isLoading={isGenerating}
              onLoadingChange={setIsGenerating}
            />
          </section>

          <section className="order-1 w-full space-y-3 self-stretch sm:space-y-4 lg:order-2 lg:sticky lg:top-4">
            <ControlsPanel
              canvasRef={canvasRef}
              downloadDisabled={Boolean(urlError || isGenerating)}
              url={url}
              color={color}
              removeEmblem={removeEmblem}
              error={urlError}
              onUrlChange={setUrl}
              onColorChange={setColor}
              onRemoveEmblemChange={setRemoveEmblem}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
