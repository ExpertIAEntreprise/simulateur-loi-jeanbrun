import { Suspense } from "react";
import Link from "next/link";
import { db, desc, eq, and, gte, lte, count } from "@repo/database";
import { leads } from "@repo/database/schema";
import type { Lead, Promoter, Broker } from "@repo/database/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCards } from "./stats-cards";
import { LeadsFilters } from "./filters";
import { Pagination } from "./pagination";

export const metadata = {
  title: "Gestion des Leads",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SearchParams {
  readonly platform?: string;
  readonly status?: string;
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly scoreMin?: string;
  readonly page?: string;
  readonly limit?: string;
}

interface LeadWithRelations extends Lead {
  readonly promoter: Pick<Promoter, "id" | "name"> | null;
  readonly broker: Pick<Broker, "id" | "name"> | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 20;

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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getLeadDisplayName(lead: Lead): string {
  const parts: string[] = [];
  if (lead.prenom) parts.push(lead.prenom);
  if (lead.nom) parts.push(lead.nom);
  return parts.length > 0 ? parts.join(" ") : "-";
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

type PlatformValue = "jeanbrun" | "stop-loyer";
type StatusValue = "new" | "dispatched" | "contacted" | "converted" | "lost";

const VALID_PLATFORMS: readonly string[] = ["jeanbrun", "stop-loyer"];
const VALID_STATUSES: readonly string[] = [
  "new",
  "dispatched",
  "contacted",
  "converted",
  "lost",
];

function isPlatform(value: string): value is PlatformValue {
  return VALID_PLATFORMS.includes(value);
}

function isStatus(value: string): value is StatusValue {
  return VALID_STATUSES.includes(value);
}

async function getLeads(searchParams: SearchParams): Promise<{
  readonly leads: readonly LeadWithRelations[];
  readonly total: number;
  readonly page: number;
  readonly totalPages: number;
}> {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.limit) || ITEMS_PER_PAGE));
  const offset = (page - 1) * limit;

  // Build where conditions
  const conditions = [];

  if (searchParams.platform && isPlatform(searchParams.platform)) {
    conditions.push(eq(leads.platform, searchParams.platform));
  }

  if (searchParams.status && isStatus(searchParams.status)) {
    conditions.push(eq(leads.status, searchParams.status));
  }

  if (searchParams.dateFrom) {
    const dateFrom = new Date(searchParams.dateFrom);
    if (!isNaN(dateFrom.getTime())) {
      conditions.push(gte(leads.createdAt, dateFrom));
    }
  }

  if (searchParams.dateTo) {
    const dateTo = new Date(searchParams.dateTo);
    if (!isNaN(dateTo.getTime())) {
      // Include the entire day
      dateTo.setHours(23, 59, 59, 999);
      conditions.push(lte(leads.createdAt, dateTo));
    }
  }

  if (searchParams.scoreMin) {
    const scoreMin = Number(searchParams.scoreMin);
    if (!isNaN(scoreMin) && scoreMin > 0) {
      conditions.push(gte(leads.score, scoreMin));
    }
  }

  const whereClause =
    conditions.length > 0 ? and(...conditions) : undefined;

  // Run count and data queries in parallel
  const [countResult, leadsResult] = await Promise.all([
    db
      .select({ value: count() })
      .from(leads)
      .where(whereClause),
    db.query.leads.findMany({
      where: whereClause,
      with: {
        promoter: {
          columns: { id: true, name: true },
        },
        broker: {
          columns: { id: true, name: true },
        },
      },
      orderBy: [desc(leads.createdAt)],
      limit,
      offset,
    }),
  ]);

  const total = countResult[0]?.value ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    leads: leadsResult as unknown as readonly LeadWithRelations[],
    total,
    page,
    totalPages,
  };
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="py-4">
          <CardContent>
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="mb-1 h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function AdminLeadsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const { leads: leadsData, total, page, totalPages } = await getLeads(searchParams);

  return (
    <div className="flex flex-col gap-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Gestion des Leads
        </h1>
        <p className="text-sm text-muted-foreground">
          Visualisez et gerez les prospects generes par les simulateurs.
        </p>
      </div>

      {/* Stats cards */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      {/* Filters */}
      <Card className="py-4">
        <CardContent>
          <Suspense>
            <LeadsFilters />
          </Suspense>
        </CardContent>
      </Card>

      {/* Leads table */}
      <Card className="py-0">
        <CardContent className="p-0">
          {leadsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm text-muted-foreground">
                Aucun lead trouve avec ces filtres.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Plateforme</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Promoteur</TableHead>
                  <TableHead>Courtier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadsData.map((lead) => {
                  const statusConfig = STATUS_CONFIG[lead.status] ?? {
                    label: lead.status,
                    className: "bg-gray-100 text-gray-600",
                  };

                  return (
                    <TableRow key={lead.id}>
                      <TableCell className="text-muted-foreground">
                        {formatDate(lead.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {PLATFORM_LABELS[lead.platform] ?? lead.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {getLeadDisplayName(lead)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lead.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getScoreClassName(lead.score)}
                        >
                          {lead.score !== null ? lead.score : "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={statusConfig.className}
                        >
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lead.promoter?.name ?? "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lead.broker?.name ?? "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/admin/leads/${lead.id}`}>
                            Voir
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <Suspense>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
        />
      </Suspense>
    </div>
  );
}
