import { notFound } from "next/navigation";
import Link from "next/link";
import { db, eq } from "@repo/database";
import { leads } from "@repo/database/schema";
import type { Lead, Promoter, Broker } from "@repo/database/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LeadDetailClient } from "./lead-detail-client";
import { SimulationDataViewer } from "./simulation-data-viewer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LeadWithRelations extends Lead {
  readonly promoter: Pick<Promoter, "id" | "name" | "contactEmail"> | null;
  readonly broker: Pick<Broker, "id" | "name" | "contactEmail"> | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  string,
  { readonly label: string; readonly className: string }
> = {
  new: {
    label: "Nouveau",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  dispatched: {
    label: "Dispatche",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  contacted: {
    label: "Contacte",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  converted: {
    label: "Converti",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  lost: {
    label: "Perdu",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const PLATFORM_LABELS: Record<string, string> = {
  jeanbrun: "Jeanbrun",
  "stop-loyer": "Stop Loyer",
};

function getScoreClassName(score: number | null): string {
  if (score === null) return "bg-gray-100 text-gray-600";
  if (score > 70) return "bg-emerald-100 text-emerald-700";
  if (score >= 40) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function formatDateTime(date: Date | null): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getLeadDisplayName(lead: Lead): string {
  const parts: string[] = [];
  if (lead.prenom) parts.push(lead.prenom);
  if (lead.nom) parts.push(lead.nom);
  return parts.length > 0 ? parts.join(" ") : "Lead sans nom";
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function getLeadById(
  id: string
): Promise<LeadWithRelations | undefined> {
  const result = await db.query.leads.findFirst({
    where: eq(leads.id, id),
    with: {
      promoter: {
        columns: { id: true, name: true, contactEmail: true },
      },
      broker: {
        columns: { id: true, name: true, contactEmail: true },
      },
    },
  });

  return result as LeadWithRelations | undefined;
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function AdminLeadDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  const statusConfig = STATUS_CONFIG[lead.status] ?? {
    label: lead.status,
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back button + title */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/leads">Retour</Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {getLeadDisplayName(lead)}
          </h1>
          <p className="text-sm text-muted-foreground">{lead.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {PLATFORM_LABELS[lead.platform] ?? lead.platform}
          </Badge>
          <Badge variant="secondary" className={statusConfig.className}>
            {statusConfig.label}
          </Badge>
          <Badge variant="secondary" className={getScoreClassName(lead.score)}>
            Score : {lead.score !== null ? lead.score : "-"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column - Lead info */}
        <div className="flex flex-col gap-6">
          {/* Contact information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
              <CardDescription>
                Donnees du prospect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">Prenom</dt>
                  <dd>{lead.prenom ?? "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Nom</dt>
                  <dd>{lead.nom ?? "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Email</dt>
                  <dd>{lead.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">
                    Telephone
                  </dt>
                  <dd>{lead.telephone ?? "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">
                    Plateforme
                  </dt>
                  <dd>
                    {PLATFORM_LABELS[lead.platform] ?? lead.platform}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">
                    Date creation
                  </dt>
                  <dd>{formatDateTime(lead.createdAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Source / UTM */}
          <Card>
            <CardHeader>
              <CardTitle>Source et tracking</CardTitle>
              <CardDescription>
                Origine du lead et parametres UTM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">
                    Page source
                  </dt>
                  <dd className="truncate max-w-[250px]">
                    {lead.sourcePage ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">
                    UTM Source
                  </dt>
                  <dd>{lead.utmSource ?? "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">
                    UTM Medium
                  </dt>
                  <dd>{lead.utmMedium ?? "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">
                    UTM Campaign
                  </dt>
                  <dd>{lead.utmCampaign ?? "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Consents */}
          <Card>
            <CardHeader>
              <CardTitle>Consentements RGPD</CardTitle>
              <CardDescription>
                {lead.consentDate
                  ? `Consenti le ${formatDateTime(lead.consentDate)}`
                  : "Aucune date de consentement enregistree"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <ConsentRow
                  label="Contact promoteur"
                  granted={lead.consentPromoter}
                />
                <ConsentRow
                  label="Contact courtier"
                  granted={lead.consentBroker}
                />
                <ConsentRow
                  label="Newsletter"
                  granted={lead.consentNewsletter}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Dispatch, Revenue, Actions */}
        <div className="flex flex-col gap-6">
          {/* Status & Revenue - interactive (client component) */}
          <LeadDetailClient
            leadId={lead.id}
            initialStatus={lead.status}
            initialRevenuePromoter={lead.revenuePromoter}
            initialRevenueBroker={lead.revenueBroker}
          />

          {/* Dispatch information */}
          <Card>
            <CardHeader>
              <CardTitle>Dispatch partenaires</CardTitle>
              <CardDescription>
                Informations de transmission aux partenaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Promoteur</h4>
                  {lead.promoter ? (
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Nom</dt>
                        <dd className="font-medium">{lead.promoter.name}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Email</dt>
                        <dd>{lead.promoter.contactEmail}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-muted-foreground">
                          Dispatche le
                        </dt>
                        <dd>
                          {formatDateTime(lead.dispatchedPromoterAt)}
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Aucun promoteur assigne
                    </p>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 text-sm font-medium">Courtier</h4>
                  {lead.broker ? (
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Nom</dt>
                        <dd className="font-medium">{lead.broker.name}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Email</dt>
                        <dd>{lead.broker.contactEmail}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-muted-foreground">
                          Dispatche le
                        </dt>
                        <dd>
                          {formatDateTime(lead.dispatchedBrokerAt)}
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Aucun courtier assigne
                    </p>
                  )}
                </div>

                {lead.convertedAt && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="mb-1 text-sm font-medium">
                        Date de conversion
                      </h4>
                      <p className="text-sm">
                        {formatDateTime(lead.convertedAt)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Simulation data */}
          {lead.simulationData != null ? (
            <SimulationDataViewer data={lead.simulationData} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small sub-components
// ---------------------------------------------------------------------------

function ConsentRow({
  label,
  granted,
}: {
  readonly label: string;
  readonly granted: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <Badge
        variant="secondary"
        className={
          granted
            ? "bg-emerald-100 text-emerald-700"
            : "bg-gray-100 text-gray-500"
        }
      >
        {granted ? "Oui" : "Non"}
      </Badge>
    </div>
  );
}
