"use client";

import { useState, useCallback } from "react";
import { LotsTable } from "@/components/programmes/LotsTable";
import { SimulateurLotDrawer } from "@/components/programmes/SimulateurLotDrawer";
import type { ZoneFiscale } from "@/lib/calculs/types/common";
import type { Lot } from "@/lib/espocrm";

interface LotsSectionProps {
  lots: Lot[];
  programmeName: string;
  villeName: string | null;
  zoneFiscale: ZoneFiscale;
}

/**
 * Section Lots (client wrapper)
 *
 * Encapsule LotsTable + SimulateurLotDrawer.
 * Gere l'etat d'ouverture du drawer et le lot selectionne.
 */
export function LotsSection({
  lots,
  programmeName,
  villeName,
  zoneFiscale,
}: LotsSectionProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

  const handleSimuler = useCallback((lot: Lot) => {
    setSelectedLot(lot);
    setDrawerOpen(true);
  }, []);

  const handleContact = useCallback((_lot: Lot) => {
    // Phase 5 : ouverture du ContactProgrammeModal
  }, []);

  return (
    <>
      <LotsTable
        lots={lots}
        onSimuler={handleSimuler}
        onContact={handleContact}
      />

      <SimulateurLotDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        lot={selectedLot}
        programmeName={programmeName}
        villeName={villeName}
        zoneFiscale={zoneFiscale}
        onContact={handleContact}
      />
    </>
  );
}
