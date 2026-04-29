"use client";

import { RefObject, useEffect } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QRPreviewProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  value: string;
  color: string;
  logoSrc: string | null;
  isLoading: boolean;
  onLoadingChange: (value: boolean) => void;
}

async function drawLogo(canvas: HTMLCanvasElement, logoSrc: string) {
  const logo = new Image();
  logo.src = logoSrc;

  await new Promise<void>((resolve, reject) => {
    logo.onload = () => resolve();
    logo.onerror = () => reject(new Error("Unable to load logo."));
  });

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const logoSize = canvas.width * 0.2;
  const x = (canvas.width - logoSize) / 2;
  const y = (canvas.height - logoSize) / 2;

  context.fillStyle = "#ffffff";
  context.fillRect(x - 8, y - 8, logoSize + 16, logoSize + 16);
  context.drawImage(logo, x, y, logoSize, logoSize);
}

export function QRPreview({
  canvasRef,
  value,
  color,
  logoSrc,
  isLoading,
  onLoadingChange,
}: QRPreviewProps) {
  useEffect(() => {
    let active = true;

    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      if (!value) {
        const context = canvas.getContext("2d");
        context?.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      onLoadingChange(true);

      try {
        await QRCode.toCanvas(canvas, value, {
          width: 360,
          margin: 1,
          color: { dark: color, light: "#ffffff" },
        });

        if (logoSrc) {
          await drawLogo(canvas, logoSrc);
        }
      } catch {
        const context = canvas.getContext("2d");
        context?.clearRect(0, 0, canvas.width, canvas.height);
      } finally {
        if (active) {
          onLoadingChange(false);
        }
      }
    };

    void render();

    return () => {
      active = false;
    };
  }, [canvasRef, color, logoSrc, onLoadingChange, value]);

  return (
    <Card className="h-full">
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-lg text-slate-900 dark:text-white sm:text-xl">
          Live preview
        </CardTitle>
        <CardDescription>Changes are reflected instantly.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
        <div className="relative flex min-h-[250px] items-center justify-center rounded-xl border border-sky-200 bg-white/65 p-3 sm:min-h-[320px] sm:p-5 md:min-h-[360px] dark:border-white/35 dark:bg-white/10">
          <canvas
            ref={canvasRef}
            width={360}
            height={360}
            className="aspect-square h-auto w-full max-w-[230px] rounded-md bg-white shadow-lg min-[380px]:max-w-[250px] min-[420px]:max-w-[280px] sm:max-w-[320px] md:max-w-[360px]"
          />
          {!value ? (
            <p className="absolute px-4 text-center text-sm text-slate-600 dark:text-white/75">
              Enter a valid URL to render your QR code.
            </p>
          ) : null}
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-sm dark:bg-[#041b3f]/50">
              <p className="text-sm font-medium text-slate-800 dark:text-white">
                Generating...
              </p>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
