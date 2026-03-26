import test from "node:test";
import assert from "node:assert/strict";

const { normalizeApp, normalizeDownloadLinks, normalizeGlobalSetting, normalizePage } = await import(
  new URL("./normalize.ts", import.meta.url).href
);

test("normalizeDownloadLinks filters null and incomplete entries", () => {
  const links = normalizeDownloadLinks([
    null,
    {
      id: 1,
      platform: "App Store",
      url: "https://example.com/app-store",
      badge: { url: "https://cdn.example.com/app-store.svg" },
      isClickable: true,
      generateQRCode: false,
    },
    {
      id: 2,
      platform: "Google Play",
      url: "https://example.com/google-play",
      badge: null,
      isClickable: true,
      generateQRCode: false,
    },
    {
      id: 3,
      platform: "Amazon",
      url: "",
      badge: { url: "https://cdn.example.com/amazon.svg" },
      isClickable: true,
      generateQRCode: false,
    },
  ]);

  assert.equal(links.length, 1);
  assert.equal(links[0]?.id, 1);
});

test("normalizeApp keeps app data but removes invalid download links", () => {
  const app = normalizeApp({
    id: 10,
    name: "Demo App",
    slug: "demo-app",
    type: "screen-mirroring",
    shortDescription: "Demo",
    icon: null,
    description: "",
    screenshots: [],
    heroImage: null,
    downloadCount: "0",
    features: [],
    isFeatured: false,
    order: 1,
    createdAt: "2026-03-26T00:00:00.000Z",
    publishedAt: "2026-03-26T00:00:00.000Z",
    downloadLinks: [
      {
        id: 1,
        platform: "App Store",
        url: "https://example.com/app-store",
        badge: { url: "https://cdn.example.com/app-store.svg" },
        isClickable: true,
        generateQRCode: true,
      },
      {
        id: 2,
        platform: "Google Play",
        url: "https://example.com/google-play",
        badge: null,
        isClickable: true,
        generateQRCode: false,
      },
    ],
  });

  assert.equal(app.downloadLinks?.length, 1);
  assert.equal(app.downloadLinks?.[0]?.platform, "App Store");
});

test("normalizeGlobalSetting filters null social links", () => {
  const globalSetting = normalizeGlobalSetting({
    siteName: "BoostVision",
    siteDescription: "Demo",
    logo: null,
    footerLogo: null,
    favicon: null,
    contactEmail: "support@example.com",
    supportEmail: "support@example.com",
    socialLinks: [
      null,
      { id: 1, platform: "facebook", url: "https://facebook.com/example" },
      { id: 2, platform: "twitter", url: "" },
    ],
    statistics: {
      downloads: "1",
      countries: "1",
      customers: "1",
      supportHours: "24/7",
    },
  });

  assert.equal(globalSetting.socialLinks.length, 1);
  assert.equal(globalSetting.socialLinks[0]?.platform, "facebook");
});

test("normalizePage strips invalid media from sections", () => {
  const page = normalizePage({
    id: 1,
    documentId: "page-1",
    title: "App",
    slug: "app",
    content: "",
    createdAt: "2026-03-26T00:00:00.000Z",
    publishedAt: "2026-03-26T00:00:00.000Z",
    sections: [
      {
        id: 1,
        __component: "sections.apps-filter",
        screenMirroringLabel: "Screen",
        screenMirroringIcon: null,
        tvRemoteLabel: "Remote",
        tvRemoteIcon: { url: "https://cdn.example.com/remote.svg" },
      },
      {
        id: 2,
        __component: "sections.why-choose",
        title: "Why",
        features: [
          { id: 1, title: "A", description: "B", icon: null },
        ],
      },
    ],
  });

  const filter = page.sections?.[0];
  const whyChoose = page.sections?.[1];

  assert.equal(filter?.__component, "sections.apps-filter");
  assert.equal(filter?.screenMirroringIcon, undefined);
  assert.equal(whyChoose?.__component, "sections.why-choose");
  assert.equal(whyChoose?.features?.[0]?.icon, undefined);
});
