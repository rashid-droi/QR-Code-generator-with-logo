"use client";

import { RefObject } from "react";
import { jsPDF } from "jspdf";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonsProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  disabled?: boolean;
}

function triggerDownload(fileName: string, href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = fileName;
  anchor.click();
}

export function DownloadButtons({ canvasRef, disabled = false }: DownloadButtonsProps) {
  const downloadJpg = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const jpgData = canvas.toDataURL("image/jpeg", 1);
    triggerDownload("qr-code.jpg", jpgData);
  };

  const downloadPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const jpgData = canvas.toDataURL("image/jpeg", 1);
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(jpgData, "JPEG", 0, 0, canvas.width, canvas.height);
    pdf.save("qr-code.pdf");
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Button onClick={downloadJpg} disabled={disabled} className="w-full gap-2">
        <Download size={16} />
        Download JPG
      </Button>
      <Button
        variant="outline"
        onClick={downloadPdf}
        disabled={disabled}
        className="w-full gap-2"
      >
        <Download size={16} />
        Download PDF
      </Button>
    </div>
  );
}
