"use client";

import { RefObject, useEffect } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QRPreviewProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  value: string;
  color: string;
  removeEmblem: boolean;
  isLoading: boolean;
  onLoadingChange: (value: boolean) => void;
}

function isInFinderArea(row: number, col: number, moduleCount: number) {
  const topLeft = row <= 7 && col <= 7;
  const topRight = row <= 7 && col >= moduleCount - 8;
  const bottomLeft = row >= moduleCount - 8 && col <= 7;
  return topLeft || topRight || bottomLeft;
}

function drawFinder(
  context: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  moduleSize: number,
  darkColor: string
) {
  const outerSize = moduleSize * 7;
  const innerInset = moduleSize;
  const innerSize = moduleSize * 5;
  const centerSize = moduleSize * 3;

  context.fillStyle = darkColor;
  context.beginPath();
  context.roundRect(startX, startY, outerSize, outerSize, moduleSize * 1.8);
  context.fill();

  context.fillStyle = "#f5f5f5";
  context.beginPath();
  context.roundRect(startX + innerInset, startY + innerInset, innerSize, innerSize, moduleSize * 1.3);
  context.fill();

  context.fillStyle = darkColor;
  context.beginPath();
  context.roundRect(
    startX + innerInset * 2,
    startY + innerInset * 2,
    centerSize,
    centerSize,
    moduleSize * 0.95
  );
  context.fill();
}

function getEmblemLayout(canvasSize: number) {
  const emblemSize = canvasSize * 0.22;
  const padding = Math.max(8, Math.round(canvasSize * 0.022));
  const badgeSize = emblemSize + padding * 2;
  const x = (canvasSize - badgeSize) / 2;
  const y = (canvasSize - badgeSize) / 2;

  return { emblemSize, padding, badgeSize, x, y };
}

async function drawCenterEmblem(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const emblem = new Image();
  emblem.src = "center-emblem.jpg";

  await new Promise<void>((resolve, reject) => {
    emblem.onload = () => resolve();
    emblem.onerror = () => reject(new Error("Unable to load center emblem."));
  });

  const { emblemSize, padding, badgeSize, x, y } = getEmblemLayout(canvas.width);
  const drawX = x + padding;
  const drawY = y + padding;

  context.fillStyle = "#f0f0f0";
  context.fillRect(x, y, badgeSize, badgeSize);
  context.drawImage(emblem, drawX, drawY, emblemSize, emblemSize);
}

export function QRPreview({
  canvasRef,
  value,
  color,
  removeEmblem,
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
        const context = canvas.getContext("2d");
        if (!context) {
          return;
        }

        const qr = QRCode.create(value, { errorCorrectionLevel: "H" });
        const moduleCount = qr.modules.size;
        const quietZone = 2;
        const moduleSize = canvas.width / (moduleCount + quietZone * 2);
        const dotRadius = moduleSize * 0.43;
        const lightColor = "#f5f5f5";
        const emblemLayout = getEmblemLayout(canvas.width);
        const emblemSafePadding = moduleSize * 0.7;
        const safeAreaLeft = emblemLayout.x - emblemSafePadding;
        const safeAreaTop = emblemLayout.y - emblemSafePadding;
        const safeAreaRight = emblemLayout.x + emblemLayout.badgeSize + emblemSafePadding;
        const safeAreaBottom = emblemLayout.y + emblemLayout.badgeSize + emblemSafePadding;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = lightColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = color;
        for (let row = 0; row < moduleCount; row += 1) {
          for (let col = 0; col < moduleCount; col += 1) {
            if (!qr.modules.get(row, col) || isInFinderArea(row, col, moduleCount)) {
              continue;
            }
            const centerX = (quietZone + col + 0.5) * moduleSize;
            const centerY = (quietZone + row + 0.5) * moduleSize;
            if (
              !removeEmblem &&
              centerX >= safeAreaLeft &&
              centerX <= safeAreaRight &&
              centerY >= safeAreaTop &&
              centerY <= safeAreaBottom
            ) {
              continue;
            }
            context.beginPath();
            context.arc(centerX, centerY, dotRadius, 0, Math.PI * 2);
            context.fill();
          }
        }

        const topLeft = quietZone * moduleSize;
        const topRight = (quietZone + moduleCount - 7) * moduleSize;
        const bottomLeft = (quietZone + moduleCount - 7) * moduleSize;
        drawFinder(context, topLeft, topLeft, moduleSize, color);
        drawFinder(context, topRight, topLeft, moduleSize, color);
        drawFinder(context, topLeft, bottomLeft, moduleSize, color);
        if (!removeEmblem) {
          await drawCenterEmblem(canvas);
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
  }, [canvasRef, color, onLoadingChange, removeEmblem, value]);

  return (
    <Card className="h-full">
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-lg text-slate-900 dark:text-white sm:text-xl">
          Live preview
        </CardTitle>
        <CardDescription>Changes are reflected instantly.</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
        <div className="relative flex min-h-[220px] items-center justify-center rounded-xl border border-sky-200 bg-[#eef2f7] p-2 sm:min-h-[300px] sm:p-4 md:min-h-[360px] md:p-5 dark:border-white/35 dark:bg-white/10">
          <canvas
            ref={canvasRef}
            width={360}
            height={360}
            className="aspect-square h-auto w-full max-w-[210px] rounded-lg bg-[#f1f4f8] shadow-lg min-[380px]:max-w-[250px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[360px]"
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
