"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ExportButton() {
  const searchParams = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      const platform = searchParams.get("platform");
      const status = searchParams.get("status");
      const dateFrom = searchParams.get("dateFrom");
      const dateTo = searchParams.get("dateTo");

      if (platform && platform !== "all") params.set("platform", platform);
      if (status && status !== "all") params.set("status", status);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const token = prompt("Token admin pour l'export :");
      if (!token) return;

      const response = await fetch(`/api/leads/export?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Export echoue");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = response.headers
        .get("content-disposition")
        ?.match(/filename="(.+)"/)?.[1] ?? "leads-export.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors de l'export CSV");
    } finally {
      setIsExporting(false);
    }
  }, [searchParams]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
    >
      <Download className="h-4 w-4 mr-1.5" />
      {isExporting ? "Export..." : "Export CSV"}
    </Button>
  );
}
