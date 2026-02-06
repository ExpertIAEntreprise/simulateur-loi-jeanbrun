interface OrganizationJsonLdOptions {
  name: string;
  url: string;
  logo?: string | undefined;
  description?: string | undefined;
}

interface WebPageJsonLdOptions {
  name: string;
  url: string;
  description: string;
  organizationName: string;
}

export function createOrganizationJsonLd(options: OrganizationJsonLdOptions): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: options.name,
    url: options.url,
    ...(options.logo ? { logo: options.logo } : {}),
    ...(options.description ? { description: options.description } : {}),
  };
}

export function createWebPageJsonLd(options: WebPageJsonLdOptions): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.name,
    url: options.url,
    description: options.description,
    isPartOf: {
      "@type": "WebSite",
      name: options.organizationName,
      url: options.url,
    },
  };
}
