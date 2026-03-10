import { eq, asc, desc, isNotNull } from "drizzle-orm";
import { db } from "../index";
import {
  blogPosts,
  works,
  workTags,
  reviews,
  teamMembers,
} from "../schema";
import type {
  BlogPost,
  PortfolioItem,
  Review,
  TeamMember,
} from "../../types";

// ── Blog Posts ──

export function getBlogPosts(): BlogPost[] {
  const rows = db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.date))
    .all();

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    ...(row.content != null ? { content: row.content } : {}),
    image: row.image,
    category: row.category,
    date: row.date,
    isFeatured: row.isFeatured,
  }));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  const row = db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .get();

  if (!row) return undefined;

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    ...(row.content != null ? { content: row.content } : {}),
    image: row.image,
    category: row.category,
    date: row.date,
    isFeatured: row.isFeatured,
  };
}

export function getBlogCategories(): string[] {
  const rows = db
    .selectDistinct({ category: blogPosts.category })
    .from(blogPosts)
    .all();

  return rows.map((r) => r.category);
}

// ── Portfolio Items ──

export function getPortfolioItems(): PortfolioItem[] {
  const rows = db
    .select()
    .from(works)
    .where(isNotNull(works.slug))
    .orderBy(asc(works.sortOrder))
    .all();

  return rows.map((row) => {
    const tags = db
      .select({ tag: workTags.tag })
      .from(workTags)
      .where(eq(workTags.workId, row.id))
      .all()
      .map((t) => t.tag);

    return {
      slug: row.slug!,
      car: row.car,
      ...(row.serviceName != null ? { serviceName: row.serviceName } : {}),
      image: row.image,
      tags,
    };
  });
}

export function getPortfolioTags(): string[] {
  const rows = db
    .selectDistinct({ tag: workTags.tag })
    .from(workTags)
    .all();

  return rows.map((r) => r.tag);
}

// ── Reviews ──

export function getVisibleReviews(): Review[] {
  const rows = db
    .select()
    .from(reviews)
    .where(eq(reviews.isVisible, true))
    .orderBy(asc(reviews.sortOrder))
    .all();

  return rows.map((row) => ({
    author: row.author,
    rating: row.rating,
    text: row.text,
    ...(row.car != null ? { car: row.car } : {}),
    ...(row.date != null ? { date: row.date } : {}),
  }));
}

// ── Team Members ──

export function getTeamMembers(): TeamMember[] {
  const rows = db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder))
    .all();

  return rows.map((row) => ({
    name: row.name,
    role: row.role,
    image: row.image,
  }));
}
