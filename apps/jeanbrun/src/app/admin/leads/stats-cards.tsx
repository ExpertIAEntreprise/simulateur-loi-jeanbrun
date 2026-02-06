import { db, count, avg, gte, sql } from "@repo/database";
import { leads } from "@repo/database/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatsData {
  readonly totalLeads: number;
  readonly leadsThisMonth: number;
  readonly averageScore: number;
  readonly totalRevenue: number;
}

async function getStats(): Promise<StatsData> {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalResult, monthResult, scoreResult, revenueResult] =
    await Promise.all([
      db.select({ value: count() }).from(leads),
      db
        .select({ value: count() })
        .from(leads)
        .where(gte(leads.createdAt, firstDayOfMonth)),
      db
        .select({ value: avg(leads.score) })
        .from(leads),
      db
        .select({
          value: sql<string>`COALESCE(SUM(COALESCE(${leads.revenuePromoter}, 0) + COALESCE(${leads.revenueBroker}, 0)), 0)`,
        })
        .from(leads),
    ]);

  return {
    totalLeads: totalResult[0]?.value ?? 0,
    leadsThisMonth: monthResult[0]?.value ?? 0,
    averageScore: Math.round(Number(scoreResult[0]?.value ?? 0)),
    totalRevenue: Number(revenueResult[0]?.value ?? 0),
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function StatsCards() {
  const stats = await getStats();

  const cards = [
    {
      title: "Total leads",
      value: stats.totalLeads.toString(),
      description: "Depuis le lancement",
    },
    {
      title: "Leads ce mois",
      value: stats.leadsThisMonth.toString(),
      description: new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric",
      }).format(new Date()),
    },
    {
      title: "Score moyen",
      value: stats.averageScore.toString(),
      description: "Sur 100 points",
    },
    {
      title: "CA total",
      value: formatCurrency(stats.totalRevenue),
      description: "Promoteurs + courtiers",
    },
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="py-4">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
