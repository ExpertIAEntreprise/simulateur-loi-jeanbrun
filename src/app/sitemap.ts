import { getAllSlugs } from "@/lib/blog";
import { getEspoCRMClient, isEspoCRMAvailable } from "@/lib/espocrm";
import type { MetadataRoute } from "next";

/**
 * Dynamic sitemap generator for SEO
 *
 * Includes:
 * - Static pages (homepage, loi-jeanbrun, a-propos, etc.)
 * - Blog articles (from MDX files)
 * - Ville pages (382 pages from EspoCRM)
 * - Barometre index page
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/loi-jeanbrun`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/barometre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic blog articles from MDX files
  const blogSlugs = getAllSlugs();
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic ville pages from EspoCRM
  let villePages: MetadataRoute.Sitemap = [];

  if (isEspoCRMAvailable()) {
    try {
      const espoClient = getEspoCRMClient();
      const villeSlugs = await espoClient.getAllVilleSlugs();

      villePages = villeSlugs.map((slug) => ({
        url: `${baseUrl}/villes/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    } catch (error) {
      // Log error but continue with static sitemap
      console.error(
        "[Sitemap] Failed to fetch ville slugs from EspoCRM:",
        error instanceof Error ? error.message : String(error)
      );
      // Fallback: continue without ville pages
    }
  }

  return [...staticPages, ...blogPages, ...villePages];
}
