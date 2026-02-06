import type { Metadata } from "next";

interface SeoMetadataOptions {
  title: string;
  description: string;
  url: string;
  siteName: string;
  locale?: string | undefined;
  keywords?: string[] | undefined;
  image?: string | undefined;
  noIndex?: boolean | undefined;
}

export function createMetadata(options: SeoMetadataOptions): Metadata {
  const {
    title,
    description,
    url,
    siteName,
    locale = "fr_FR",
    keywords,
    image,
    noIndex = false,
  } = options;

  return {
    title,
    description,
    keywords: keywords?.join(", "),
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale,
      type: "website",
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
