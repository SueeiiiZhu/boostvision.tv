import test from "node:test";
import assert from "node:assert/strict";

import { getAdSenseSlot, normalizeAdSenseSlot } from "./adsense.ts";

test("normalizeAdSenseSlot trims configured slot ids", () => {
  assert.equal(normalizeAdSenseSlot(" 1234567890 "), "1234567890");
});

test("normalizeAdSenseSlot returns null for blank values", () => {
  assert.equal(normalizeAdSenseSlot("   "), null);
  assert.equal(normalizeAdSenseSlot(""), null);
  assert.equal(normalizeAdSenseSlot(undefined), null);
});

test("getAdSenseSlot returns null for unconfigured placeholder placements", () => {
  assert.equal(getAdSenseSlot("faqAccordion"), null);
  assert.equal(getAdSenseSlot("privacyInline"), null);
});
