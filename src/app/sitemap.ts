import type { MetadataRoute } from "next";
import { getAllServices } from "@/lib/db/queries/services";
import { getBlogPosts, getPortfolioItems } from "@/lib/db/queries/content";

const DOMAIN = "https://dpkzn.ru";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const services = getAllServices().map((s) => ({
    url: `${DOMAIN}${s.url}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const blogPosts = getBlogPosts().map((p) => {
    const parsed = new Date(p.date);
    return {
      url: `${DOMAIN}/blog/${p.slug}`,
      lastModified: isNaN(parsed.getTime()) ? now : parsed,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

  const portfolio = getPortfolioItems().map((w) => ({
    url: `${DOMAIN}/portfolio/${w.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: DOMAIN,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...services,
    {
      url: `${DOMAIN}/portfolio`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...portfolio,
    {
      url: `${DOMAIN}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogPosts,
    {
      url: `${DOMAIN}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/contacts`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${DOMAIN}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
