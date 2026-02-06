"use client";

import { useState, useCallback, useEffect } from "react";
import { LotsTable } from "@/components/programmes/LotsTable";
import { SimulateurLotDrawer } from "@/components/programmes/SimulateurLotDrawer";
import { ContactProgrammeModal } from "@/components/programmes/ContactProgrammeModal";
import type { ZoneFiscale } from "@/lib/calculs/types/common";
import type { Lot } from "@/lib/espocrm";

interface LotsSectionProps {
  lots: Lot[];
  programmeName: string;
  programmeSlug: string;
  villeName: string | null;
  zoneFiscale: ZoneFiscale;
}

/**
 * Section Lots (client wrapper)
 *
 * Encapsule LotsTable + SimulateurLotDrawer + ContactProgrammeModal.
 * Gere l'etat d'ouverture du drawer, du modal contact et du lot selectionne.
 */
export function LotsSection({
  lots,
  programmeName,
  programmeSlug,
  villeName,
  zoneFiscale,
}: LotsSectionProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [contactLot, setContactLot] = useState<Lot | null>(null);

  const handleSimuler = useCallback((lot: Lot) => {
    setSelectedLot(lot);
    setDrawerOpen(true);
  }, []);

  const handleContact = useCallback((lot: Lot) => {
    setContactLot(lot);
    setContactOpen(true);
  }, []);

  // Ouvrir le modal contact via hash #contact (CTA hero)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#contact") {
        setContactLot(null);
        setContactOpen(true);
        // Retirer le hash pour permettre de re-cliquer
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
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

      <ContactProgrammeModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        lot={contactLot}
        programmeName={programmeName}
        programmeSlug={programmeSlug}
        villeName={villeName}
      />
    </>
  );
}
