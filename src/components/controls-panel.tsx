"use client";

import { ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ControlsPanelProps {
  url: string;
  color: string;
  error: string | null;
  onUrlChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onLogoUpload: (value: string | null) => void;
}

export function ControlsPanel({
  url,
  color,
  error,
  onUrlChange,
  onColorChange,
  onLogoUpload,
}: ControlsPanelProps) {
  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      onLogoUpload(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onLogoUpload(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-lg text-slate-900 dark:text-white sm:text-xl">
          Customize your QR code
        </CardTitle>
        <CardDescription>
          Update URL, color, and logo to generate a branded QR in real time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0 sm:space-y-5 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
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

        <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-end">
          <div className="space-y-2">
            <Label htmlFor="color">QR color</Label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(event) => onColorChange(event.target.value)}
              className="h-11 w-full cursor-pointer p-1 md:h-12 md:w-24"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Center logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleLogoChange}
              className="h-11 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-600 dark:text-white/70">
            Recommended transparent PNG for best results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
