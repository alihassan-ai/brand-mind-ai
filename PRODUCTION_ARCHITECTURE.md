# BrandMindAI Production Architecture & Sync Strategy

## Executive Summary

This document outlines the critical fixes applied to resolve Shopify data sync failures on Vercel, and proposes a production-grade architecture for reliable, scalable data synchronization and progressive user onboarding.

---

## Part 1: Issues Identified & Emergency Fixes Applied

### Critical Issues Found

#### 1. **Fire-and-Forget in Serverless (ROOT CAUSE)**
**Location:** `packages/frontend/src/app/api/auth/shopify/callback/route.ts`

**Problem:**
```typescript
runFullSync(shop.id).catch(err => { ... }); // Not awaited
return NextResponse.redirect(redirectUrl);  // Lambda freezes here
```

On Vercel's serverless infrastructure:
- HTTP response returns → Lambda is **frozen immediately**
- Any unawaited async tasks are **killed**
- The `runFullSync()` never executes

**Fix Applied:**
- Removed `runFullSync` from OAuth callback entirely
- Onboarding page now calls `POST /api/sync` client-side (fresh Lambda with own lifecycle)
- Added comments to prevent linter from auto-reverting

---

#### 2. **60-Second Timeout on Sync Route**
**Location:** `vercel.json`

**Problem:**
```json
"packages/frontend/src/app/api/sync/route.ts": {
    "maxDuration": 60  // Only 1 minute for full store sync!
}
```

**Fix Applied:**
- Increased to `maxDuration: 300` (5 minutes, Vercel Pro max)
- Added `maxDuration = 300` in route file as well

---

#### 3. **Wrong Argument Type in Sync Route**
**Location:** `packages/frontend/src/app/api/sync/route.ts`

**Problem:**
```typescript
const shopDomain = await getConnectedShop(); // Returns "store.myshopify.com"
await runFullSync(shopDomain);               // Expects shop.id (cuid)
```

**Fix Applied:**
```typescript
const shop = await prisma.shop.findUnique({ where: { shopDomain } });
await runFullSync(shop.id); // Correct ID now
```

---

#### 4. **No Sync Status Tracking**
**Problem:** System had no way to know if a shop was syncing, completed, or failed.

**Fix Applied:**
- Added `syncStatus` enum field to Shop model: `PENDING | IN_PROGRESS | COMPLETED | FAILED`
- Added `lastSyncAt` timestamp
- Sync route now updates status:
  - `IN_PROGRESS` when starting
  - `COMPLETED` when done
  - `FAILED` on error

---

#### 5. **Command Center Blocked on Empty Data**
**Problem:**
```typescript
if (isInitialSync) {
    await triggerAutoSync(shop.id); // BLOCKS page load for 5 minutes!
}
```

**Fix Applied:**
- Check `shop.syncStatus` instead
- Redirect to `/syncing` waiting room if `PENDING` or `IN_PROGRESS`
- Show progress UI with polling instead of blocking

---

### Emergency Fix Summary

| Component | Change | Impact |
|-----------|--------|--------|
| OAuth callback | Removed fire-and-forget `runFullSync` | Sync no longer killed instantly |
| Sync route | Fixed shop lookup + added status tracking | Sync actually runs with correct data |
| vercel.json | Increased timeout to 300s | Gives sync time to complete |
| Command Center | Redirect to waiting room | No more 5-minute page hangs |
| Onboarding | Client-side `POST /api/sync` call | Fresh Lambda with full lifecycle |
| `/syncing` page | New waiting room with polling | Better UX, real-time status |

---

## Part 2: Remaining Limitations

### Current Architecture Still Has Issues:

1. **300-second hard limit** — Large stores with 10,000+ orders will still timeout
2. **No chunked sync** — All-or-nothing approach (if it times out, restart from scratch unless cursor saved)
3. **No real-time progress** — User sees fake progress bar, not actual sync state
4. **Client must stay online** — If user closes browser during sync, Lambda dies (though cursor state persists)
5. **Cold starts** — First invocation on Vercel can take 10-20 seconds before sync even begins

---

## Part 3: Production-Grade Architecture Proposal

### Strategy 1: Async Job Queue (Recommended)

Use a proper job queue that survives HTTP request lifecycle.

#### Option A: **Inngest** (Best for Vercel)
```typescript
// inngest/functions.ts
export const shopifySync = inngest.createFunction(
  { id: "shopify-sync" },
  { event: "shopify/sync.requested" },
  async ({ event, step }) => {
    const { shopId } = event.data;

    await step.run("sync-products", async () => {
      return await syncProducts(shopId);
    });

    await step.run("sync-orders", async () => {
      return await syncOrders(shopId);
    });

    await step.run("sync-customers", async () => {
      return await syncCustomers(shopId);
    });

    await step.run("compute-dna", async () => {
      return await computeStoreDNA(shopId);
    });
  }
);
```

**Benefits:**
- ✅ No time limits (runs for hours if needed)
- ✅ Built-in retry logic
- ✅ Step-based progress tracking (UI can show real progress)
- ✅ Survives server restarts
- ✅ Free tier: 1000 function runs/month

#### Option B: **Trigger.dev**
Similar to Inngest but with different pricing model.

#### Option C: **Vercel Cron + Queue Table**
Use Vercel Cron (free) + database-backed job queue.

```typescript
// cron.ts (runs every 5 minutes)
export async function GET() {
  const pendingJobs = await prisma.syncJob.findMany({
    where: { status: "PENDING" },
    take: 5 // Process 5 at a time
  });

  for (const job of pendingJobs) {
    await processSyncJob(job.id);
  }
}
```

**Benefits:**
- ✅ No external dependencies
- ✅ Free on Vercel
- ❌ More code to maintain
- ❌ Less sophisticated retry logic

---

### Strategy 2: Progressive Sync with Real-Time Updates

Instead of syncing everything at once, sync in stages and show data as it arrives.

```typescript
// Phase 1: Recent data (6 months) - 30 seconds
await syncRecentOrders(shopId, 6);
await prisma.shop.update({
  where: { id: shopId },
  data: { syncProgress: 40 }
});

// Phase 2: Products - 20 seconds
await syncProducts(shopId);
await prisma.shop.update({
  where: { id: shopId },
  data: { syncProgress: 70 }
});

// Phase 3: Historical data - background
await queueHistoricalSync(shopId);
await prisma.shop.update({
  where: { id: shopId },
  data: { syncProgress: 100, syncStatus: "PARTIAL" }
});
```

**Frontend polls `/api/sync/progress` and shows:**
- 0-40%: "Syncing recent orders..."
- 40-70%: "Importing products..."
- 70-100%: "Analyzing data..."
- 100%: "Ready! (Historical data syncing in background)"

---

### Strategy 3: Shopify Webhooks for Real-Time Updates

Instead of polling Shopify every time, register webhooks.

```typescript
// Register webhooks on shop install
await shopify.rest.Webhook.create({
  topic: "orders/create",
  address: "https://yourdomain.com/api/webhooks/shopify/orders/create",
  format: "json"
});
```

**Topics to register:**
- `orders/create`, `orders/updated`
- `products/create`, `products/updated`
- `customers/create`, `customers/updated`

**Benefits:**
- ✅ Real-time data (no delays)
- ✅ No polling needed
- ✅ Reduces API calls (avoids rate limits)
- ❌ Requires webhook verification logic
- ❌ Need to handle webhook failures/retries

---

### Strategy 4: Graceful Degradation & Sample Data

Show useful UI even when no data exists.

#### A. **Demo Mode**
```typescript
const orderCount = await prisma.order.count({ where: { shopId: shop.id } });

if (orderCount === 0) {
  // Show demo dashboard with sample data
  return <DemoDashboard shop={shop} />;
}
```

#### B. **Progressive Enhancement**
```typescript
// Show whatever data is available
const [products, orders, customers] = await Promise.all([
  prisma.product.count({ where: { shopId: shop.id } }),
  prisma.order.count({ where: { shopId: shop.id } }),
  prisma.customer.count({ where: { shopId: shop.id } })
]);

return (
  <Dashboard
    productsReady={products > 0}
    ordersReady={orders > 0}
    customersReady={customers > 0}
  />
);
```

Each section shows:
- ✅ Real data if available
- ⏳ Loading skeleton if syncing
- 📊 Sample/placeholder if not synced yet

---

## Part 4: Recommended Implementation Roadmap

### Phase 1: Quick Wins (This Week)
- [x] Fix fire-and-forget in callback
- [x] Add `syncStatus` tracking
- [x] Create `/syncing` waiting room
- [x] Increase timeout to 300s
- [ ] Add retry button on sync failure
- [ ] Add manual sync trigger in settings

### Phase 2: Production Reliability (Next 2 Weeks)
- [ ] Implement Inngest for async job processing
- [ ] Break sync into chunks (products → recent orders → customers → historical)
- [ ] Add real sync progress tracking (not fake progress bar)
- [ ] Store sync metrics (duration, records synced, errors)
- [ ] Add admin dashboard to monitor sync health

### Phase 3: Real-Time & Optimization (Next Month)
- [ ] Register Shopify webhooks for real-time updates
- [ ] Implement incremental sync (only fetch changed records)
- [ ] Add data freshness indicators in UI
- [ ] Implement auto-sync scheduler (daily background refresh)
- [ ] Add "Last synced: X minutes ago" with manual refresh button

### Phase 4: Advanced Features (Future)
- [ ] Multi-store support (sync multiple stores per user)
- [ ] Selective sync (user chooses which data to sync)
- [ ] Export/import data feature
- [ ] Sync analytics dashboard
- [ ] Historical trend tracking

---

## Part 5: Database Schema Changes Needed

### Current Schema (Added Today)
```prisma
model Shop {
  // ... existing fields
  syncStatus   SyncStatus @default(PENDING)
  lastSyncAt   DateTime?
}

enum SyncStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
}
```

### Recommended Additions
```prisma
model Shop {
  // ... existing fields
  syncStatus     SyncStatus @default(PENDING)
  syncProgress   Int        @default(0)     // 0-100
  lastSyncAt     DateTime?
  lastSyncError  String?                     // Store error message
  syncAttempts   Int        @default(0)      // Track retry count
}

model SyncJob {
  id          String      @id @default(cuid())
  shopId      String
  jobType     String      // "full" | "incremental" | "historical"
  status      JobStatus   @default(PENDING)
  priority    Int         @default(0)
  startedAt   DateTime?
  completedAt DateTime?
  error       String?
  metadata    Json?       // Store job-specific data

  shop        Shop        @relation(fields: [shopId], references: [id], onDelete: Cascade)

  @@index([status, priority])
  @@index([shopId])
}

enum JobStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}
```

---

## Part 6: Code Samples

### Sample: Inngest Integration

```typescript
// inngest/client.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "brandmind-ai",
  eventKey: process.env.INNGEST_EVENT_KEY
});

// inngest/functions/sync-shop.ts
export const syncShopFunction = inngest.createFunction(
  {
    id: "sync-shop",
    retries: 3,
    cancelOn: [
      { event: "shopify/shop.uninstalled", if: "event.data.shopId == async.data.shopId" }
    ]
  },
  { event: "shopify/sync.requested" },
  async ({ event, step }) => {
    const { shopId } = event.data;

    // Step 1: Mark as in progress
    await step.run("mark-in-progress", async () => {
      await prisma.shop.update({
        where: { id: shopId },
        data: { syncStatus: "IN_PROGRESS", syncProgress: 0 }
      });
    });

    // Step 2: Sync products
    const productCount = await step.run("sync-products", async () => {
      const count = await syncProducts(shopId);
      await prisma.shop.update({
        where: { id: shopId },
        data: { syncProgress: 25 }
      });
      return count;
    });

    // Step 3: Sync recent orders
    const orderCount = await step.run("sync-recent-orders", async () => {
      const count = await syncRecentOrders(shopId, 6);
      await prisma.shop.update({
        where: { id: shopId },
        data: { syncProgress: 50 }
      });
      return count;
    });

    // Step 4: Sync customers
    const customerCount = await step.run("sync-customers", async () => {
      const count = await syncCustomers(shopId);
      await prisma.shop.update({
        where: { id: shopId },
        data: { syncProgress: 75 }
      });
      return count;
    });

    // Step 5: Compute Store DNA
    await step.run("compute-dna", async () => {
      await computeStoreDNA(shopId);
      await prisma.shop.update({
        where: { id: shopId },
        data: { syncProgress: 100, syncStatus: "COMPLETED", lastSyncAt: new Date() }
      });
    });

    // Step 6: Send success email
    await step.run("notify-user", async () => {
      const shop = await prisma.shop.findUnique({ where: { id: shopId }, include: { user: true } });
      await sendEmail({
        to: shop.user.email,
        subject: "Your store is ready!",
        body: `We've synced ${productCount} products, ${orderCount} orders, and ${customerCount} customers.`
      });
    });

    return { productCount, orderCount, customerCount };
  }
);

// Trigger from OAuth callback
inngest.send({
  name: "shopify/sync.requested",
  data: { shopId: shop.id }
});
```

### Sample: Real-Time Progress Polling

```typescript
// frontend: syncing/page.tsx
const [progress, setProgress] = useState(0);
const [status, setStatus] = useState("IN_PROGRESS");

useEffect(() => {
  const interval = setInterval(async () => {
    const res = await fetch("/api/sync/status");
    const data = await res.json();

    setProgress(data.syncProgress);
    setStatus(data.syncStatus);

    if (data.syncStatus === "COMPLETED") {
      clearInterval(interval);
      router.push("/command-center");
    }
  }, 2000); // Poll every 2 seconds

  return () => clearInterval(interval);
}, []);
```

---

## Part 7: Testing & Monitoring

### Testing Checklist

- [ ] Test sync with empty Shopify store (0 products/orders)
- [ ] Test sync with small store (10 products, 50 orders)
- [ ] Test sync with medium store (100 products, 1000 orders)
- [ ] Test sync with large store (1000+ products, 10000+ orders)
- [ ] Test sync timeout/failure recovery
- [ ] Test sync cancellation
- [ ] Test concurrent syncs (multiple users onboarding at once)
- [ ] Test sync with invalid Shopify token
- [ ] Test sync with rate-limited Shopify API

### Monitoring & Alerts

```typescript
// Add to sync route
import * as Sentry from "@sentry/nextjs";

try {
  await runFullSync(shop.id);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      shopId: shop.id,
      shopDomain: shop.shopDomain,
      syncType: "initial"
    }
  });
  throw error;
}
```

**Metrics to Track:**
- Sync duration (p50, p95, p99)
- Sync failure rate
- Records synced per shop
- API rate limit hits
- Timeout frequency

---

## Part 8: Cost Analysis

### Current Approach (Serverless HTTP)
- **Vercel Function Invocations:** ~$0.60/million
- **Execution Time:** ~$0.018/GB-hour
- **Typical Cost per Sync:** ~$0.001-0.01 (assuming 2-5 min)

### Inngest Approach
- **Free Tier:** 1,000 function runs/month
- **Paid:** $10/month for 10,000 runs
- **Typical Cost per Sync:** $0.001 after free tier

### Database Costs
- **Neon (current):** $19/month for Postgres
- **Planetscale:** $29/month (better for high concurrency)

### Recommendation
Start with Inngest free tier (1000 syncs/month = 30-40 new users/day). Upgrade to Inngest Pro when needed.

---

## Part 9: Security Considerations

### Current Security Posture
- ✅ OAuth tokens encrypted at rest (AES-256)
- ✅ HTTP-only cookies
- ✅ HTTPS enforced in production
- ❌ No rate limiting on sync endpoint
- ❌ No sync abuse prevention

### Recommended Security Enhancements

```typescript
// Rate limit sync endpoint
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"), // Max 3 syncs per hour
});

export async function POST() {
  const { success } = await ratelimit.limit(shop.id);

  if (!success) {
    return NextResponse.json(
      { error: "Too many sync requests. Please wait before trying again." },
      { status: 429 }
    );
  }

  // ... proceed with sync
}
```

---

## Conclusion

### Immediate Actions Required (Deploy ASAP)

1. **Commit and push** all changes from today's fixes
2. **Deploy to Vercel** — sync should now work
3. **Test with a real Shopify store** — verify full flow works
4. **Monitor Vercel logs** for errors

### Next Steps (This Week)

1. Implement retry logic on sync failure
2. Add sync status API endpoint for admin monitoring
3. Set up error tracking (Sentry)
4. Test with progressively larger stores

### Long-Term (Next Month)

1. Evaluate Inngest vs. Trigger.dev vs. custom queue
2. Implement chunked sync with real progress
3. Add Shopify webhooks for real-time updates
4. Build admin sync monitoring dashboard

---

**Document Version:** 1.0
**Last Updated:** 2026-02-20
**Author:** Claude (Sonnet 4.5)
**Status:** Implementation Roadmap
