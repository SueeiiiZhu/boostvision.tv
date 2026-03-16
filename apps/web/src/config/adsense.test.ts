import test from "node:test";
import assert from "node:assert/strict";

import { getAdSenseSlot, normalizeAdSenseSlot } from "./adsense";

test("normalizeAdSenseSlot trims configured slot ids", () => {
  assert.equal(normalizeAdSenseSlot(" 1234567890 "), "1234567890");
});

test("normalizeAdSenseSlot returns null for blank values", () => {
  assert.equal(normalizeAdSenseSlot("   "), null);
  assert.equal(normalizeAdSenseSlot(""), null);
  assert.equal(normalizeAdSenseSlot(undefined), null);
});

test("getAdSenseSlot returns configured slot ids", () => {
  assert.equal(getAdSenseSlot("faqAccordion"), "1648701811");
  assert.equal(getAdSenseSlot("privacyInline"), "5204803446");
});
