"use client";

import { useState, useTransition, useCallback } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LeadDetailClientProps {
  readonly leadId: string;
  readonly initialStatus: string;
  readonly initialRevenuePromoter: string | null;
  readonly initialRevenueBroker: string | null;
}

interface PatchResponse {
  readonly success: boolean;
  readonly error?: string;
}

const STATUS_OPTIONS = [
  { value: "new", label: "Nouveau" },
  { value: "dispatched", label: "Dispatche" },
  { value: "contacted", label: "Contacte" },
  { value: "converted", label: "Converti" },
  { value: "lost", label: "Perdu" },
] as const;

// ---------------------------------------------------------------------------
// API helper
// ---------------------------------------------------------------------------

async function patchLead(
  leadId: string,
  data: Record<string, unknown>
): Promise<PatchResponse> {
  try {
    const response = await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      return {
        success: false,
        error: errorData.error ?? `Erreur ${response.status}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur de connexion au serveur",
    };
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LeadDetailClient({
  leadId,
  initialStatus,
  initialRevenuePromoter,
  initialRevenueBroker,
}: LeadDetailClientProps) {
  const [status, setStatus] = useState(initialStatus);
  const [revenuePromoter, setRevenuePromoter] = useState(
    initialRevenuePromoter ?? ""
  );
  const [revenueBroker, setRevenueBroker] = useState(
    initialRevenueBroker ?? ""
  );
  const [isStatusPending, startStatusTransition] = useTransition();
  const [isRevenuePending, startRevenueTransition] = useTransition();

  const handleStatusChange = useCallback(
    (newStatus: string) => {
      const previousStatus = status;
      setStatus(newStatus);

      startStatusTransition(async () => {
        const result = await patchLead(leadId, { status: newStatus });

        if (result.success) {
          toast.success("Statut mis a jour");
        } else {
          // Rollback on failure
          setStatus(previousStatus);
          toast.error(`Echec de la mise a jour : ${result.error}`);
        }
      });
    },
    [leadId, status]
  );

  const handleRevenueSave = useCallback(() => {
    startRevenueTransition(async () => {
      const payload: Record<string, string> = {};

      if (revenuePromoter !== "") {
        payload.revenuePromoter = revenuePromoter;
      }
      if (revenueBroker !== "") {
        payload.revenueBroker = revenueBroker;
      }

      if (Object.keys(payload).length === 0) {
        toast.info("Aucune valeur a enregistrer");
        return;
      }

      const result = await patchLead(leadId, payload);

      if (result.success) {
        toast.success("Revenus mis a jour");
      } else {
        toast.error(`Echec de la mise a jour : ${result.error}`);
      }
    });
  }, [leadId, revenuePromoter, revenueBroker]);

  return (
    <div className="flex flex-col gap-6">
      {/* Status card */}
      <Card>
        <CardHeader>
          <CardTitle>Statut du lead</CardTitle>
          <CardDescription>
            Modifier le statut de traitement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Select
              value={status}
              onValueChange={handleStatusChange}
              disabled={isStatusPending}
            >
              <SelectTrigger className="w-[200px]" aria-label="Changer le statut">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isStatusPending && (
              <span className="text-xs text-muted-foreground animate-pulse">
                Enregistrement...
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revenue card */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi du chiffre d&apos;affaires</CardTitle>
          <CardDescription>
            Revenus generes par ce lead (en euros)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="revenue-promoter">Revenu promoteur</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="revenue-promoter"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={revenuePromoter}
                  onChange={(e) => setRevenuePromoter(e.target.value)}
                  className="w-[180px]"
                />
                <span className="text-sm text-muted-foreground">EUR</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="revenue-broker">Revenu courtier</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="revenue-broker"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={revenueBroker}
                  onChange={(e) => setRevenueBroker(e.target.value)}
                  className="w-[180px]"
                />
                <span className="text-sm text-muted-foreground">EUR</span>
              </div>
            </div>

            <Button
              onClick={handleRevenueSave}
              disabled={isRevenuePending}
              className="w-fit bg-emerald-600 hover:bg-emerald-700"
            >
              {isRevenuePending ? "Enregistrement..." : "Enregistrer les revenus"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
