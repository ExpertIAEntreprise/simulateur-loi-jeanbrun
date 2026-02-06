/**
 * CarteVille.tsx
 * Carte avec pin sur la ville
 * Utilise un placeholder statique car Leaflet n'est pas installe
 * Pour une version complete, installer react-leaflet et leaflet
 */

"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CarteVilleProps {
  latitude: number | null;
  longitude: number | null;
  villeNom: string;
}

/**
 * Genere l'URL d'une carte statique OpenStreetMap
 * Utilise le service gratuit staticmap.openstreetmap.de
 */
function getStaticMapUrl(lat: number, lng: number): string {
  // Utilise OpenStreetMap Static Map API
  // Alternative: utiliser Google Static Maps avec API key
  const zoom = 12;
  const width = 600;
  const height = 300;

  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lng},red-pushpin`;
}

/**
 * Genere l'URL vers OpenStreetMap pour voir la carte interactive
 */
function getOpenStreetMapUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`;
}

/**
 * Affiche une carte statique de la ville avec un marker
 * Utilise OpenStreetMap pour eviter les dependances lourdes
 */
export function CarteVille({ latitude, longitude, villeNom }: CarteVilleProps) {
  const hasCoordinates = latitude !== null && longitude !== null;

  if (!hasCoordinates) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="size-5" />
            Localisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex h-48 items-center justify-center rounded-md bg-muted"
            role="img"
            aria-label={`Carte de ${villeNom} non disponible`}
          >
            <div className="text-center">
              <MapPin className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Coordonnees non disponibles pour {villeNom}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const staticMapUrl = getStaticMapUrl(latitude, longitude);
  const osmUrl = getOpenStreetMapUrl(latitude, longitude);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="size-5" />
          Localisation de {villeNom}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block"
          aria-label={`Voir ${villeNom} sur OpenStreetMap (nouvelle fenetre)`}
        >
          {/* Image de la carte statique */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={staticMapUrl}
            alt={`Carte de ${villeNom} - Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`}
            className="h-48 w-full object-cover transition-opacity group-hover:opacity-90"
            loading="lazy"
          />

          {/* Overlay au hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
            <span className="rounded-md bg-background/90 px-3 py-1.5 text-sm font-medium opacity-0 shadow transition-opacity group-hover:opacity-100">
              Voir sur OpenStreetMap
            </span>
          </div>
        </a>

        {/* Coordonnees */}
        <div className="border-t px-6 py-3">
          <p className="text-xs text-muted-foreground">
            Coordonnees: {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Version avec Leaflet (a utiliser si react-leaflet est installe)
 * Pour l'activer:
 * 1. pnpm add leaflet react-leaflet
 * 2. pnpm add -D @types/leaflet
 * 3. Remplacer le composant ci-dessus par celui-ci
 *
 * @example
 * "use client";
 *
 * import dynamic from "next/dynamic";
 * import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 * import { MapPin } from "lucide-react";
 *
 * // Dynamic import pour eviter les erreurs SSR avec Leaflet
 * const MapContainer = dynamic(
 *   () => import("react-leaflet").then((mod) => mod.MapContainer),
 *   { ssr: false }
 * );
 * const TileLayer = dynamic(
 *   () => import("react-leaflet").then((mod) => mod.TileLayer),
 *   { ssr: false }
 * );
 * const Marker = dynamic(
 *   () => import("react-leaflet").then((mod) => mod.Marker),
 *   { ssr: false }
 * );
 * const Popup = dynamic(
 *   () => import("react-leaflet").then((mod) => mod.Popup),
 *   { ssr: false }
 * );
 *
 * export function CarteVilleLeaflet({ latitude, longitude, villeNom }) {
 *   if (latitude === null || longitude === null) {
 *     return <PlaceholderCard villeNom={villeNom} />;
 *   }
 *
 *   return (
 *     <Card>
 *       <CardHeader>
 *         <CardTitle>Localisation</CardTitle>
 *       </CardHeader>
 *       <CardContent className="p-0">
 *         <div className="h-64">
 *           <MapContainer
 *             center={[latitude, longitude]}
 *             zoom={13}
 *             style={{ height: "100%", width: "100%" }}
 *           >
 *             <TileLayer
 *               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
 *               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
 *             />
 *             <Marker position={[latitude, longitude]}>
 *               <Popup>{villeNom}</Popup>
 *             </Marker>
 *           </MapContainer>
 *         </div>
 *       </CardContent>
 *     </Card>
 *   );
 * }
 */
