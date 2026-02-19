# 🚀 Deployment Checklist — Shopify Sync Fix

## What Was Fixed

✅ **Fire-and-forget serverless bug** — Sync no longer gets killed on Vercel
✅ **Sync timeout** — Increased from 60s to 300s (5 minutes)
✅ **Shop ID lookup bug** — Fixed wrong argument type
✅ **Sync status tracking** — Added `syncStatus` and `lastSyncAt` fields
✅ **Empty state handling** — Redirect to `/syncing` waiting room
✅ **Progress polling** — Real-time sync status checks

---

## Files Changed

### Modified
- `packages/frontend/src/app/api/auth/shopify/callback/route.ts` — Removed fire-and-forget
- `packages/frontend/src/app/api/sync/route.ts` — Fixed shop lookup, added status tracking
- `packages/frontend/src/app/(app)/command-center/page.tsx` — Redirect to /syncing if pending
- `packages/frontend/src/app/onboarding/page.tsx` — Client-side sync trigger
- `packages/shared/prisma/schema.prisma` — Added syncStatus enum
- `vercel.json` — Increased sync timeout to 300s

### Created
- `packages/frontend/src/app/syncing/page.tsx` — Waiting room with progress
- `packages/frontend/src/app/api/sync/status/route.ts` — Polling endpoint
- `packages/shared/prisma/migrations/20260220_add_sync_status/migration.sql` — DB migration
- `PRODUCTION_ARCHITECTURE.md` — Full architecture proposal
- `DEPLOYMENT_CHECKLIST.md` — This file

---

## Pre-Deployment Steps

### 1. Verify Prisma Client Generated
```bash
cd packages/shared
npx prisma generate
```

### 2. Check Database Migration Applied
The migration was already applied to your production database. Verify:
```bash
npx prisma db pull --schema packages/shared/prisma/schema.prisma
```

You should see `syncStatus` and `lastSyncAt` in the Shop model.

### 3. Test Locally (Optional)
```bash
npm run dev
```

Navigate to `/onboarding` and test the OAuth flow.

---

## Deployment Steps

### 1. Commit Changes
```bash
git add .
git commit -m "fix: resolve Shopify sync failures on Vercel serverless

- Remove fire-and-forget runFullSync from OAuth callback
- Increase sync route timeout to 300s
- Add syncStatus tracking to Shop model
- Create /syncing waiting room with progress polling
- Fix shop ID lookup in sync route

Fixes #[issue-number]"
```

### 2. Push to GitHub
```bash
git push origin main
```

Vercel will auto-deploy (assuming you have auto-deploy enabled).

### 3. Monitor Deployment
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Watch deployment logs
3. Check for any build errors

---

## Post-Deployment Verification

### Test the Full Flow

1. **Create a test Shopify development store** (if you don't have one)
   - Go to https://partners.shopify.com
   - Create a development store

2. **Test OAuth flow**
   - Sign up with a new email on your deployed app
   - Connect your test Shopify store
   - **Expected:** Redirected to `/onboarding?mode=oauth_complete`

3. **Verify sync triggers**
   - **Expected:** `POST /api/sync` called from onboarding page
   - **Expected:** Redirected to `/syncing` waiting room
   - **Expected:** Progress bar shows "Syncing..."

4. **Check Vercel function logs**
   ```
   [Sync] Starting Smart Sync for [store].myshopify.com
   [Sync] Fetching products...
   [Sync] Fetching orders...
   [Sync] Finished syncing X products, Y orders
   ```

5. **Verify database updated**
   Query your Neon database:
   ```sql
   SELECT id, shopDomain, syncStatus, lastSyncAt FROM "Shop";
   ```
   **Expected:** `syncStatus = 'COMPLETED'` after sync finishes

6. **Check command center**
   - **Expected:** After sync completes, auto-redirect to `/command-center`
   - **Expected:** Dashboard shows real data (orders, products, KPIs)

---

## Rollback Plan (If Needed)

If deployment fails:

```bash
# Revert commit
git revert HEAD

# Push revert
git push origin main

# Or reset to previous commit
git reset --hard HEAD~1
git push origin main --force
```

**Note:** The database migration (`syncStatus` field) was already applied. Rolling back code won't remove the field, but it's harmless.

---

## Known Issues & Limitations

### 1. 300-Second Timeout Still Exists
- **Impact:** Stores with 10,000+ orders may still timeout
- **Workaround:** Cursor state is saved, so next sync resumes where it left off
- **Long-term fix:** Implement async job queue (see PRODUCTION_ARCHITECTURE.md)

### 2. Fake Progress Bar
- **Impact:** Progress shown on `/syncing` is simulated, not real sync progress
- **Long-term fix:** Add `syncProgress` field and update it during sync

### 3. No Retry on Failure
- **Impact:** If sync fails, user must manually trigger retry from dashboard
- **Long-term fix:** Add retry button on `/syncing` page

---

## Monitoring & Alerts

### Set Up Vercel Logs
1. Go to Vercel Dashboard → Your Project → Functions
2. Filter by `/api/sync`
3. Watch for errors

### Key Metrics to Monitor
- **Sync Success Rate:** Should be >95%
- **Sync Duration:** Should be <300s for most stores
- **Error Rate:** Should be <5%

### Error Patterns to Watch For
```
Error: Shop not found
→ Check: OAuth callback saved shop correctly?

Error: Shopify API error (429)
→ Check: Rate limiting, add backoff/retry

Error: Function timeout (504)
→ Check: Store has >10k orders? Need async queue

Error: Invalid access token
→ Check: Shopify app uninstalled or token revoked
```

---

## Next Steps (After Deployment)

### Immediate (This Week)
- [ ] Test with 3-5 real Shopify stores of different sizes
- [ ] Set up error tracking (Sentry, Bugsnag, or similar)
- [ ] Add manual sync button in settings page
- [ ] Add retry button on sync failure

### Short-term (Next 2 Weeks)
- [ ] Review `PRODUCTION_ARCHITECTURE.md` and choose job queue solution
- [ ] Implement chunked sync with real progress tracking
- [ ] Add sync analytics to admin dashboard
- [ ] Set up automated tests for OAuth → Sync flow

### Long-term (Next Month)
- [ ] Implement Inngest or Trigger.dev for async jobs
- [ ] Add Shopify webhooks for real-time updates
- [ ] Build admin monitoring dashboard
- [ ] Add multi-store support

---

## Support & Troubleshooting

### If Sync Still Fails After Deployment

1. **Check Vercel Function Logs**
   - Go to Vercel Dashboard → Functions → Logs
   - Look for `/api/sync` errors

2. **Check Database**
   ```sql
   SELECT * FROM "Shop" ORDER BY "installedAt" DESC LIMIT 5;
   ```
   Verify `syncStatus` is being updated.

3. **Check Shopify API Access**
   - Verify app is still installed in Shopify admin
   - Check access token is valid
   - Verify scopes are correct (`read_products`, `read_orders`, `read_customers`)

4. **Enable Debug Logging**
   Add to sync route:
   ```typescript
   console.log('[DEBUG] Shop:', shop);
   console.log('[DEBUG] Starting sync...');
   ```

### Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Property 'syncStatus' does not exist` | Prisma client not regenerated | Run `npx prisma generate` |
| `Enum "SyncStatus" does not exist` | Migration not applied | Run migration SQL manually |
| `Shop not found` | OAuth callback didn't save shop | Check callback logs |
| `No shop connected` | Cookie not set | Check OAuth callback sets cookie |
| Function timeout after 300s | Store too large | Implement async queue |

---

## Success Criteria

✅ **Sync completes successfully** for test store
✅ **Data appears in database** (orders, products, customers)
✅ **Command center shows real KPIs** after sync
✅ **No errors in Vercel function logs**
✅ **Sync status updates correctly** (PENDING → IN_PROGRESS → COMPLETED)

---

**Ready to deploy?** Follow the steps above and monitor closely. Good luck! 🚀

**Questions?** Review `PRODUCTION_ARCHITECTURE.md` for deeper technical details.
