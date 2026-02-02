"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "./AnimatedCounter";

/**
 * HeroSection - Landing page hero with anchor amount (50 000)
 *
 * Design tokens used:
 * - --hero-gradient: Subtle radial gold gradient background
 * - --anchor-amount: Bright gold color for key financial figures
 * - --anchor-glow: Glow effect for anchor amounts
 * - --font-serif: DM Serif Display for headings
 */
export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        "relative overflow-hidden",
        "py-20 md:py-32",
        "px-4 sm:px-6 lg:px-8"
      )}
      style={{
        background: "var(--hero-gradient)",
      }}
    >
      {/* Background decorative grid */}
      <div
        className="absolute inset-0 bg-grid opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Content container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <h1
          id="hero-title"
          className={cn(
            "font-serif",
            "text-4xl sm:text-5xl lg:text-6xl",
            "font-normal leading-tight tracking-tight",
            "text-foreground",
            "mb-6"
          )}
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Jusqu&apos;à{" "}
          <AnimatedCounter
            targetValue={50000}
            duration={2500}
            suffix=" €"
            className="font-semibold"
          />{" "}
          d&apos;économie d&apos;impôt avec la Loi Jeanbrun
        </h1>

        {/* Subtitle */}
        <p
          className={cn(
            "text-lg sm:text-xl lg:text-2xl",
            "text-muted-foreground",
            "max-w-2xl mx-auto",
            "mb-10"
          )}
        >
          Le produit d&apos;excellence pour préparer votre retraite - Simulez en
          60 secondes
        </p>

        {/* CTA buttons */}
        <div
          className={cn(
            "flex flex-col sm:flex-row",
            "items-center justify-center",
            "gap-4"
          )}
        >
          {/* Primary CTA */}
          <Button
            asChild
            size="lg"
            className={cn(
              "shadow-glow animate-glow",
              "text-base font-medium",
              "px-8 py-6",
              "min-w-[280px] sm:min-w-0"
            )}
          >
            <Link href="/simulateur">Je calcule mon économie d&apos;impôt</Link>
          </Button>

          {/* Secondary CTA */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className={cn("text-base font-medium", "px-8 py-6")}
          >
            <Link href="#avantages">Découvrir les avantages retraite</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
