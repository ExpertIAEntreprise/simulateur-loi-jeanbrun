/**
 * StickyNavigation.tsx
 * Barre d'onglets sticky pour la page programme
 *
 * Client Component - utilise IntersectionObserver pour
 * highlighter l'onglet actif selon la section visible
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Definition des onglets de navigation
 */
const TABS = [
  { id: "caracteristiques", label: "Caracteristiques" },
  { id: "lots", label: "Lots" },
  { id: "financement", label: "Financement" },
  { id: "fiscalite", label: "Fiscalite" },
  { id: "ville", label: "Ville" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function StickyNavigation() {
  const [activeTab, setActiveTab] = useState<TabId>("caracteristiques");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navRef = useRef<HTMLElement>(null);

  /**
   * Callback IntersectionObserver : met a jour l'onglet actif
   * quand une section entre dans le viewport
   */
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    // Trouver la section la plus visible (plus grand ratio d'intersection)
    let maxRatio = 0;
    let mostVisibleId: TabId | null = null;

    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
        maxRatio = entry.intersectionRatio;
        mostVisibleId = entry.target.id as TabId;
      }
    }

    if (mostVisibleId) {
      setActiveTab(mostVisibleId);
    }
  }, []);

  /**
   * Initialise l'IntersectionObserver au montage
   */
  useEffect(() => {
    // Hauteur du header sticky pour le rootMargin
    const rootMarginTop = -120;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: `${rootMarginTop}px 0px -60% 0px`,
      threshold: [0, 0.25, 0.5],
    });

    // Observer chaque section
    for (const tab of TABS) {
      const element = document.getElementById(tab.id);
      if (element) {
        observerRef.current.observe(element);
      }
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleIntersection]);

  /**
   * Scroll smooth vers la section cible
   */
  function handleTabClick(tabId: TabId) {
    const element = document.getElementById(tabId);
    if (!element) return;

    // Offset pour compenser le header sticky
    const navHeight = navRef.current?.offsetHeight ?? 56;
    const headerOffset = 80 + navHeight;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  return (
    <nav
      ref={navRef}
      className="sticky top-16 z-30 -mx-4 border-b bg-background/95 px-4 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80"
      aria-label="Navigation sections du programme"
    >
      <div className="flex gap-1 overflow-x-auto py-1 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              "hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === tab.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground"
            )}
            aria-current={activeTab === tab.id ? "true" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
