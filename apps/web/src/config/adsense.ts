export const adSenseSlots = {
  // Fill these placeholders with real Google AdSense slot IDs when ready.
  faqAccordion: "1648701811",
  faqBottom: "1109645762",
  tutorialAccordion: "8400010673",
  tutorialBottom: "4552265002",
  termsInline: "6517885117",
  privacyInline: "5204803446",
  // After-title leaderboard for legal pages
  privacyAfterTitle: "2167108347",
  termsAfterTitle: "7812188824",
  // Sticky mobile bottom banners
  faqStickyMobile: "7328973093",
  tutorialStickyMobile: "9941656585",
  privacyStickyMobile: "2076646410",
  termsStickyMobile: "8258911381",
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
