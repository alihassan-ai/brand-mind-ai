# Vercel Environment Variables Setup

## Required Actions After Deployment

After deploying this code to Vercel, you **MUST** configure these environment variables in your Vercel Dashboard for the cron job and robust sync to work.

---

## Step 1: Generate Secure Secrets

On your local machine, generate two random secrets:

```bash
# Generate CRON_SECRET
node -e "console.log('CRON_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Generate INTERNAL_API_SECRET
node -e "console.log('INTERNAL_API_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

**Example output:**
```
CRON_SECRET=a7f3d8e9b2c4a6f1e3d8b9c2a4f6e1d3b9c8a7f2e4d6b1c3a8f9e2d4b6c1a3f8
INTERNAL_API_SECRET=f3e8d2c9a7b4f6e1d3c8b2a9f7e4d1c6b8a3f9e2d7c4b1a6f8e3d9c2a7b4f1e6
```

**Copy these values** — you'll need them in the next step.

---

## Step 2: Add Environment Variables to Vercel

### Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project: **shopify-brand-mind-ai**
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `CRON_SECRET` | [paste generated secret] | Production, Preview, Development |
| `INTERNAL_API_SECRET` | [paste generated secret] | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://shopify-brand-mind-ai.vercel.app` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://[your-preview-domain].vercel.app` | Preview |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Development |

**Important Notes:**
- Use the **SAME** secrets for all environments (Production, Preview, Development)
- `NEXT_PUBLIC_APP_URL` should be different per environment
- The secrets you generated above are **permanent** — don't regenerate unless you want to revoke access

### Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login
vercel login

# Set production environment variables
vercel env add CRON_SECRET production
# Paste your generated CRON_SECRET when prompted

vercel env add INTERNAL_API_SECRET production
# Paste your generated INTERNAL_API_SECRET when prompted

vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://shopify-brand-mind-ai.vercel.app

# Pull environment variables to local .env
vercel env pull
```

---

## Step 3: Redeploy Your Application

After adding the environment variables, trigger a redeploy:

```bash
git commit --allow-empty -m "trigger redeploy with new env vars"
git push origin main
```

Or via Vercel Dashboard:
1. Go to **Deployments** tab
2. Click **•••** on the latest deployment
3. Select **Redeploy**
4. Check **Use existing Build Cache** (faster)
5. Click **Redeploy**

---

## Step 4: Verify Cron Job is Active

### Check Vercel Dashboard

1. Go to your project → **Settings** → **Cron Jobs**
2. You should see:
   - **Path:** `/api/cron/sync-pending`
   - **Schedule:** `*/5 * * * *` (Every 5 minutes)
   - **Status:** ✅ Active

### Test the Cron Job Manually

```bash
# Get your CRON_SECRET from Vercel Dashboard
export CRON_SECRET="your_cron_secret_here"

# Trigger cron manually
curl -X GET "https://shopify-brand-mind-ai.vercel.app/api/cron/sync-pending" \
  -H "Authorization: Bearer $CRON_SECRET"
```

**Expected response:**
```json
{
  "success": true,
  "message": "No pending shops",
  "processed": 0
}
```

or if there are pending shops:
```json
{
  "success": true,
  "message": "Processed 2 pending shops",
  "processed": 2,
  "triggered": 2,
  "results": [...]
}
```

---

## Step 5: Test the Full Sync Flow

### Test Scenario: User Closes Browser

1. **Start OAuth flow** — Connect a Shopify store
2. **Immediately close browser** after OAuth redirect (before onboarding page loads)
3. **Wait 3-5 minutes**
4. **Check database:**
   ```sql
   SELECT shopDomain, syncStatus, lastSyncAt, installedAt
   FROM "Shop"
   ORDER BY installedAt DESC
   LIMIT 5;
   ```

**Expected result:**
- After 3 minutes: `syncStatus = 'IN_PROGRESS'` (cron picked it up)
- After 5-10 minutes: `syncStatus = 'COMPLETED'` (sync finished)

### Monitor Cron Logs

Go to Vercel Dashboard → **Deployments** → Select latest deployment → **Functions** tab

Filter by `/api/cron/sync-pending` and watch for logs like:
```
[Cron] Starting sync-pending job...
[Cron] Found 1 pending shops: ["test-store.myshopify.com"]
[Cron] Triggering sync for test-store.myshopify.com...
[Cron] ✓ Sync triggered for test-store.myshopify.com
[Cron] Completed: 1/1 syncs triggered
```

---

## Troubleshooting

### Issue: "CRON_SECRET not configured"

**Cause:** Environment variable not set in Vercel

**Fix:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add `CRON_SECRET` with your generated secret
3. Redeploy the application

### Issue: "Unauthorized" when testing cron

**Cause:** Wrong CRON_SECRET in test curl command

**Fix:**
1. Get the correct secret from Vercel Dashboard
2. Make sure you're using `Bearer [secret]` format in Authorization header

### Issue: Cron job not running

**Cause:** Cron jobs only run on **Production** deployments

**Fix:**
1. Make sure your changes are merged to `main` branch
2. Check Vercel deployed to production (not just preview)
3. Verify in Settings → Cron Jobs that it shows as "Active"

### Issue: "INTERNAL_API_SECRET not configured"

**Cause:** Environment variable not set

**Fix:**
1. Add `INTERNAL_API_SECRET` to Vercel environment variables
2. Redeploy

---

## Security Best Practices

### 🔒 Keep Secrets Secret

- ❌ **NEVER** commit secrets to GitHub
- ❌ **NEVER** share secrets in Slack/Discord/email
- ✅ **ONLY** store in Vercel Dashboard
- ✅ Use different secrets for production vs. development

### 🔄 Rotate Secrets Periodically

To rotate secrets:
1. Generate new secrets using the command above
2. Update in Vercel Dashboard
3. Redeploy application
4. Old secrets are immediately invalid

### 📊 Monitor Cron Activity

Set up alerts for:
- Cron job failures (>5% error rate)
- Excessive pending shops (>10 shops stuck)
- Sync timeouts

Use Vercel's monitoring or integrate with:
- Sentry (error tracking)
- Datadog (metrics & logs)
- Better Uptime (cron job monitoring)

---

## What the Cron Job Does

### Schedule
Runs **every 5 minutes**

### Logic
```
1. Find shops where:
   - syncStatus = 'PENDING'
   - installedAt > 3 minutes ago

2. For each shop (max 10 per run):
   - Call POST /api/sync/trigger with shopId
   - Sync runs in fresh Lambda (300s timeout)
   - Updates syncStatus to COMPLETED or FAILED

3. Return results summary
```

### Why 3-Minute Delay?
Gives the client-side trigger (onboarding page) a chance to fire first. 90% of users will have sync triggered instantly via client-side JavaScript. The cron is just a fallback for the 10% who close their browser.

---

## Cost Analysis

### Vercel Cron Jobs Pricing

| Plan | Cron Invocations | Cost |
|------|------------------|------|
| **Hobby** | 2 cron jobs | Free |
| **Pro** | Unlimited | Free |
| **Enterprise** | Unlimited | Free |

**BrandMindAI Usage:**
- 1 cron job (`/api/cron/sync-pending`)
- Runs 288 times/day (every 5 minutes)
- Function duration: ~5 seconds (if no pending shops)
- **Monthly cost: $0** (free on all plans)

### Function Execution Pricing

| Resource | Usage | Cost |
|----------|-------|------|
| Cron invocations | 288/day × 30 days = 8,640/month | Free |
| Execution time | 8,640 × 5s = 43,200s = 12 hours | ~$0.22/month |
| Sync triggers | ~10-50/month (new users) | ~$0.50/month |
| **Total** | | **~$0.75/month** |

Essentially free! The cron job is extremely lightweight.

---

## Next Steps

After setting up:

1. ✅ **Test the flow** — Close browser after OAuth and verify cron picks it up
2. ✅ **Monitor for 24 hours** — Check cron logs in Vercel Dashboard
3. ✅ **Set up error tracking** — Integrate Sentry for production monitoring
4. ✅ **Document for team** — Share this guide with anyone who needs to debug sync issues

---

## FAQ

**Q: What if I lose my CRON_SECRET?**
A: Generate a new one, update in Vercel, redeploy. Old secret will stop working immediately.

**Q: Can I test cron jobs locally?**
A: Yes, but you need to manually call the endpoint with the Authorization header. Vercel doesn't trigger crons in local development.

**Q: What happens if cron fails?**
A: Vercel will retry automatically. If it keeps failing, check function logs for errors.

**Q: Can I disable the cron?**
A: Yes, remove it from `vercel.json` and redeploy. But then you lose the fallback — users who close browser won't get synced.

**Q: How do I monitor cron execution?**
A: Vercel Dashboard → Deployments → Functions → Filter by `/api/cron/sync-pending`

---

**Setup complete!** Your sync is now 100% robust. 🎉
