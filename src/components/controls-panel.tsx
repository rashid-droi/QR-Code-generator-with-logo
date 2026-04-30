"use client";

import { RefObject } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadButtons } from "@/components/download-buttons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ControlsPanelProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  downloadDisabled: boolean;
  url: string;
  color: string;
  removeEmblem: boolean;
  error: string | null;
  onUrlChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onRemoveEmblemChange: (value: boolean) => void;
}

export function ControlsPanel({
  canvasRef,
  downloadDisabled,
  url,
  color,
  removeEmblem,
  error,
  onUrlChange,
  onColorChange,
  onRemoveEmblemChange,
}: ControlsPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-lg text-slate-900 dark:text-white sm:text-xl">
          Customize your QR code
        </CardTitle>
        <CardDescription>
          Update URL and color to generate a branded QR in real time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0 sm:space-y-5 sm:p-5 sm:pt-0 md:space-y-6 md:p-6 md:pt-0">
        <div className="space-y-2">
          <Label htmlFor="url">Target URL</Label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(event) => onUrlChange(event.target.value)}
            placeholder="https://your-site.com"
            className="h-11"
          />
          {error ? <p className="text-sm text-rose-600 dark:text-amber-200">{error}</p> : null}
        </div>

        <div className="space-y-2 sm:max-w-xs">
          <Label htmlFor="color">QR color</Label>
          <Input
            id="color"
            type="color"
            value={color}
            onChange={(event) => onColorChange(event.target.value)}
            className="h-11 w-full cursor-pointer p-1 md:h-12"
          />
        </div>

        <div className="space-y-3 rounded-md border border-sky-200/70 bg-white/50 p-3 dark:border-white/25 dark:bg-white/5">
          <div className="flex items-start gap-2">
            <input
              id="remove-emblem"
              type="checkbox"
              checked={removeEmblem}
              onChange={(event) => onRemoveEmblemChange(event.target.checked)}
              className="mt-0.5 h-4 w-4 cursor-pointer accent-[#de5b27]"
            />
            <Label htmlFor="remove-emblem" className="cursor-pointer">
              Remove SELECT logo
            </Label>
          </div>
          <DownloadButtons canvasRef={canvasRef} disabled={downloadDisabled} />
        </div>
      </CardContent>
    </Card>
  );
}
