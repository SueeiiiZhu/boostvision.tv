# Strapi Media CDN Cache Setup

## Issue
Strapi Cloud media files (helpful-fun-dead826d03.media.strapiapp.com) have short cache lifetime (1 hour), resulting in:
- Slow repeat visits
- Increased bandwidth usage
- Lower PageSpeed Insights scores

## Solution: Use Cloudflare CDN

### Step 1: Setup Cloudflare (Free Plan)

1. Sign up at https://cloudflare.com
2. Add your domain (boostvision.tv)
3. Update DNS nameservers to Cloudflare's

### Step 2: Create Page Rule for Strapi Media

In Cloudflare Dashboard → Rules → Page Rules:

**URL Pattern:**
```
*helpful-fun-dead826d03.media.strapiapp.com/*
```

**Settings:**
- Cache Level: Cache Everything
- Edge Cache TTL: 1 year (31536000 seconds)
- Browser Cache TTL: 1 year

### Step 3: Update Next.js Image Config

In `apps/web/next.config.ts`, update the Strapi image domain to use Cloudflare proxy:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'media.boostvision.tv', // Your custom domain
      pathname: '**',
    },
  ],
}
```

### Step 4: Create CNAME in Cloudflare DNS

```
Type: CNAME
Name: media
Target: helpful-fun-dead826d03.media.strapiapp.com
Proxy: Enabled (orange cloud)
```

### Step 5: Update Strapi Image URLs

In Strapi admin, you can either:
1. Use Cloudflare Transform Rules to rewrite URLs on-the-fly
2. Or update the base URL in Strapi settings (if supported)

## Alternative: AWS CloudFront

If you prefer AWS:

1. Create CloudFront distribution
2. Set origin to: helpful-fun-dead826d03.media.strapiapp.com
3. Set cache behaviors:
   - Cache Policy: CachingOptimized (1 year)
   - Origin Request Policy: AllViewer
4. Update Next.js config with CloudFront domain

## Expected Results

After implementing:
- ✅ Cache TTL: 1 hour → 1 year
- ✅ Bandwidth savings: ~14 KiB per page load
- ✅ Faster repeat visits
- ✅ Better PageSpeed Insights scores
