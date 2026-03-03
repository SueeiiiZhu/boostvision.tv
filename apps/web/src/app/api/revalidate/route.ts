import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import {
  appTag,
  authorTag,
  blogPostTag,
  CACHE_TAGS,
  faqTag,
  globalSettingLocaleTag,
  navigationLocaleTag,
  pageTag,
  tutorialTag,
} from "@/lib/strapi/cacheTags";

interface WebhookPayload {
  event?: string;
  model?: string;
  uid?: string;
  entry?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

function isEnabled(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
}

function isPreciseTag(tag: string): boolean {
  return (
    tag.startsWith("app:") ||
    tag.startsWith("author:") ||
    tag.startsWith("blog-post:") ||
    tag.startsWith("faq:") ||
    tag.startsWith("page:") ||
    tag.startsWith("tutorial:")
  );
}

const ALL_BASE_TAGS = [
  CACHE_TAGS.apps,
  CACHE_TAGS.authors,
  CACHE_TAGS.blogPosts,
  CACHE_TAGS.blogCategories,
  CACHE_TAGS.faqs,
  CACHE_TAGS.globalSetting,
  CACHE_TAGS.navigation,
  CACHE_TAGS.pages,
  CACHE_TAGS.tutorials,
] as const;

function getAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  const xSecret = req.headers.get("x-revalidate-secret");
  const querySecret = req.nextUrl.searchParams.get("secret");

  if (xSecret) return xSecret;
  if (querySecret) return querySecret;
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7).trim();

  return null;
}

function getUid(payload: WebhookPayload): string {
  const rawUid = payload.model || payload.uid || "";
  return rawUid.toLowerCase();
}

function getEntry(payload: WebhookPayload): Record<string, unknown> {
  if (payload.entry && typeof payload.entry === "object") {
    return payload.entry;
  }
  if (payload.data && typeof payload.data === "object") {
    return payload.data;
  }
  return {};
}

function addLocaleScopedTags(tags: Set<string>, type: "global" | "navigation") {
  for (const locale of routing.locales) {
    if (type === "global") {
      tags.add(globalSettingLocaleTag(locale));
      continue;
    }
    tags.add(navigationLocaleTag(locale));
  }
}

function getTagsToRevalidate(payload: WebhookPayload): string[] {
  const uid = getUid(payload);
  const entry = getEntry(payload);
  const slug = typeof entry.slug === "string" ? entry.slug : undefined;
  const tags = new Set<string>();

  if (uid.includes("blog-post")) {
    tags.add(CACHE_TAGS.blogPosts);
    if (slug) tags.add(blogPostTag(slug));
    return [...tags];
  }

  if (uid.includes("author")) {
    tags.add(CACHE_TAGS.authors);
    tags.add(CACHE_TAGS.blogPosts);
    if (slug) tags.add(authorTag(slug));
    return [...tags];
  }

  if (uid.includes("blog-categor")) {
    tags.add(CACHE_TAGS.blogCategories);
    tags.add(CACHE_TAGS.blogPosts);
    return [...tags];
  }

  if (uid.includes("page")) {
    tags.add(CACHE_TAGS.pages);
    if (slug) tags.add(pageTag(slug));
    return [...tags];
  }

  if (uid.includes("global-setting")) {
    tags.add(CACHE_TAGS.globalSetting);
    addLocaleScopedTags(tags, "global");
    return [...tags];
  }

  if (uid.includes("navigation")) {
    tags.add(CACHE_TAGS.navigation);
    addLocaleScopedTags(tags, "navigation");
    return [...tags];
  }

  if (uid.includes("tutorial")) {
    tags.add(CACHE_TAGS.tutorials);
    if (slug) tags.add(tutorialTag(slug));
    return [...tags];
  }

  if (uid.includes("faq")) {
    tags.add(CACHE_TAGS.faqs);
    if (slug) tags.add(faqTag(slug));
    return [...tags];
  }

  if (uid.includes("app")) {
    tags.add(CACHE_TAGS.apps);
    if (slug) tags.add(appTag(slug));
    return [...tags];
  }

  const fallbackTags = new Set<string>(ALL_BASE_TAGS);
  addLocaleScopedTags(fallbackTags, "global");
  addLocaleScopedTags(fallbackTags, "navigation");
  return [...fallbackTags];
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRAPI_REVALIDATE_SECRET;
  const webhookRevalidateEnabled = isEnabled(
    process.env.STRAPI_WEBHOOK_REVALIDATE_ENABLED,
    true
  );
  const preciseRevalidateEnabled = isEnabled(
    process.env.STRAPI_PRECISE_REVALIDATE_ENABLED,
    true
  );

  if (!secret) {
    return NextResponse.json(
      { error: "Missing STRAPI_REVALIDATE_SECRET" },
      { status: 500 }
    );
  }

  const token = getAuthToken(req);
  if (!token || token !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!webhookRevalidateEnabled) {
    return NextResponse.json({
      revalidated: false,
      skipped: true,
      reason: "STRAPI_WEBHOOK_REVALIDATE_ENABLED=false",
      event: payload.event ?? null,
      uid: getUid(payload) || null,
      timestamp: Date.now(),
    });
  }

  const tags = getTagsToRevalidate(payload).filter(
    (tag) => preciseRevalidateEnabled || !isPreciseTag(tag)
  );
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({
    revalidated: true,
    event: payload.event ?? null,
    uid: getUid(payload) || null,
    tags,
    timestamp: Date.now(),
  });
}
