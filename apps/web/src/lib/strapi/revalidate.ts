function toPositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export function getFaqRevalidate() {
  return toPositiveInt(process.env.STRAPI_FAQ_REVALIDATE_SECONDS, 7200);
}

export function getFaqDetailRevalidate() {
  return toPositiveInt(process.env.STRAPI_FAQ_DETAIL_REVALIDATE_SECONDS, getFaqRevalidate());
}

export function getTutorialRevalidate() {
  return toPositiveInt(process.env.STRAPI_TUTORIAL_REVALIDATE_SECONDS, 21600);
}

export function getTutorialDetailRevalidate() {
  return toPositiveInt(
    process.env.STRAPI_TUTORIAL_DETAIL_REVALIDATE_SECONDS,
    getTutorialRevalidate()
  );
}

export function getLegalRevalidate() {
  return toPositiveInt(process.env.STRAPI_LEGAL_REVALIDATE_SECONDS, 86400);
}
