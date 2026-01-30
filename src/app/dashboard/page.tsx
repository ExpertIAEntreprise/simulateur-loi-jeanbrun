import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { requireAuth } from "@/lib/session";

/**
 * Dashboard page (Server Component).
 *
 * Uses Better Auth server-side session validation via requireAuth().
 * No client-side hooks (useSession) needed - server immediately redirects
 * unauthenticated users to "/" before any rendering happens.
 *
 * This prevents the "flash of protected content" issue.
 */
export default async function DashboardPage() {
  // requireAuth() checks session server-side and redirects if not authenticated
  const session = await requireAuth();

  // Pass session to Client Component for interactive features
  return <DashboardContent session={session} />;
}
