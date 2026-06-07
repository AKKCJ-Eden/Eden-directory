# 🌿 Eden — Deployment Guide
## AKKCJ LTD · Eden Technologies · edendirectory.com

This guide takes you from zero to live in about 30 minutes.
Follow every step in order. Nothing requires coding knowledge.

---

## PART 1 — SET UP SUPABASE (Your Database)

### Step 1: Create your Supabase project
1. Go to **supabase.com** and sign in
2. Tap **"New Project"**
3. Name it: `eden-production`
4. Choose a strong database password — **save this somewhere safe**
5. Region: **Europe (London)** — closest to your UK users
6. Tap **"Create new project"** and wait ~2 minutes

### Step 2: Set up your database
1. In Supabase, tap **"SQL Editor"** in the left menu
2. Tap **"New query"**
3. Open the file `supabase/migrations/001_initial_schema.sql` from your project
4. Copy the entire contents and paste into the SQL editor
5. Tap **"Run"** — you should see "Success"

### Step 3: Get your Supabase keys
1. In Supabase, go to **Settings → API**
2. Copy your **Project URL** — looks like `https://xxxx.supabase.co`
3. Copy your **anon/public key** — a long string starting with `eyJ...`
4. Keep these — you'll need them in Part 3

---

## PART 2 — PUSH YOUR CODE TO GITHUB

### Step 1: Go to GitHub
1. Go to **github.com** and sign in as `AKKCJ-Eden`
2. Tap the **"+"** button → **"New repository"**
3. Name it: `eden-directory`
4. Set to **Private**
5. Tap **"Create repository"**

### Step 2: Upload your files
1. On the new repository page, tap **"uploading an existing file"**
2. You need to upload ALL the files from this project
3. The easiest way on iPhone: use **Working Copy** app (free on App Store)
   - Install Working Copy
   - Clone your new repo: `github.com/AKKCJ-Eden/eden-directory`
   - Add all the project files
   - Commit with message: "Initial Eden deployment"
   - Push to GitHub

**Alternative (even simpler):**
1. Go to github.com/AKKCJ-Eden/eden-directory
2. Tap "Add file" → "Create new file"
3. Create each file one by one, copying the contents

---

## PART 3 — DEPLOY TO VERCEL

### Step 1: Import your project
1. Go to **vercel.com** and sign in
2. Tap **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose `AKKCJ-Eden/eden-directory`
5. Tap **"Import"**

### Step 2: Configure environment variables
Before deploying, tap **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key (from stripe.com → Developers → API Keys) |

### Step 3: Deploy
1. Tap **"Deploy"**
2. Wait ~2 minutes
3. You'll see a green tick and a URL like `eden-directory.vercel.app`
4. **Your app is live!** 🎉

---

## PART 4 — CONNECT YOUR DOMAIN

### Step 1: Add domain in Vercel
1. In your Vercel project, go to **Settings → Domains**
2. Type `edendirectory.com` and tap **Add**
3. Also add `www.edendirectory.com`
4. Vercel will show you DNS records to add

### Step 2: Update DNS in Namecheap
1. Go to **namecheap.com** → sign in
2. Go to **Domain List** → tap **Manage** next to edendirectory.com
3. Tap **Advanced DNS**
4. Add the records Vercel gave you:
   - Usually an **A record** pointing to Vercel's IP
   - And a **CNAME record** for www
5. Save — DNS can take up to 24 hours but usually under 1 hour

### Step 3: Enable HTTPS
- Vercel does this automatically once DNS is confirmed ✓

---

## PART 5 — CONNECT STRIPE

### Step 1: Get your Stripe keys
1. Go to **dashboard.stripe.com**
2. Sign in with your AKKCJ LTD account
3. Go to **Developers → API Keys**
4. Copy your **Publishable key** (starts with `pk_live_...`)
5. Add it to Vercel environment variables as `VITE_STRIPE_PUBLISHABLE_KEY`
6. Redeploy from Vercel dashboard

### Step 2: Set up Stripe Connect (for salon payouts)
1. In Stripe dashboard → **Connect → Get started**
2. Choose **"Platform or marketplace"**
3. This allows Eden to collect payments and pay out to salons
4. Commission is handled automatically

---

## PART 6 — ADD YOUR FIRST SALONS

### Option A: Manual entry (recommended to start)
1. Go to your Supabase project → **Table Editor → salons**
2. Tap **"Insert row"**
3. Add a salon's details
4. It immediately appears in your Eden search results

### Option B: Business self-registration
- Share your live URL with local salons
- They can register via **"List Your Business"** on your site
- You approve listings from your Supabase dashboard

### Option C: Reach out directly
- DM salons on Instagram: "Hi, I run Eden — the UK's new beauty directory. I'd love to add your salon for free."
- First 50 salons get 3 months free Premium (offer this to get listings fast)

---

## PART 7 — LAUNCH CHECKLIST

Before you announce Eden publicly:

- [ ] edendirectory.com loads correctly
- [ ] Search by postcode works
- [ ] "List Your Business" form works
- [ ] Sign up / Sign in works
- [ ] Booking flow completes
- [ ] Stripe is connected
- [ ] At least 10 salons listed in your area
- [ ] Mobile looks good on iPhone

---

## ONGOING — GETTING YOUR FIRST CUSTOMERS

### Week 1
- Post in Facebook groups: "Beauty Professionals UK", local area groups
- Instagram post announcing Eden — tag local salons
- DM 20 salon owners per day offering free listing

### Week 2
- Google My Business listing for Eden Technologies
- Press release to local news: "New app launches to help [your city] find beauty services"
- Partner with a local beauty school — offer students discounts

### Month 1 target
- 50 listed businesses
- 10 paid subscriptions (£590/mo)
- 100 bookings (£480 commission)
- Total: ~£1,070/mo recurring revenue

---

## SUPPORT

If you get stuck on any step, come back to Claude and describe exactly what you see — I'll fix it immediately.

**Eden Technologies**
AKKCJ LTD · Registered in England & Wales
edendirectory.com · hello@edendirectory.com
