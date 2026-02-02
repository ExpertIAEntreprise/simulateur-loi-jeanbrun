import type { MetadataRoute } from "next";

/**
 * Robots.txt configuration for SEO
 *
 * - Allows crawling of public pages (landing, blog, villes, barometre)
 * - Blocks private/auth pages (dashboard, profile, chat, API)
 * - References sitemap for search engines
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/loi-jeanbrun", "/a-propos", "/blog", "/villes", "/barometre"],
        disallow: [
          "/api/",
          "/dashboard/",
          "/profile/",
          "/chat/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
