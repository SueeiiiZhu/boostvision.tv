export const adSenseSlots = {
  // Fill these placeholders with real Google AdSense slot IDs when ready.
  faqAccordion: "",
  faqBottom: "",
  tutorialAccordion: "",
  tutorialBottom: "",
  termsInline: "",
  privacyInline: "",
} as const;

export type AdSensePlacement = keyof typeof adSenseSlots;

export function normalizeAdSenseSlot(slot?: string | null) {
  const normalized = slot?.trim();
  return normalized ? normalized : null;
}

export function getAdSenseSlot(placement: AdSensePlacement) {
  return normalizeAdSenseSlot(adSenseSlots[placement]);
}

export function hasAdSenseSlot(placement: AdSensePlacement) {
  return getAdSenseSlot(placement) !== null;
}
