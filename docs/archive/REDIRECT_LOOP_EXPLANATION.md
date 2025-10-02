# 🔄 Redirect Loop Explanation - jobwall.co.uk

**Date:** October 1, 2025, 10:01 PM
**Issue:** Infinite redirect loop between apex and www

---

## 🔍 **The Exact Problem**

You're experiencing a **redirect loop** between the two domains:

```
https://jobwall.co.uk
    ↓ (307 redirect)
https://www.jobwall.co.uk
    ↓ (308 redirect)
https://jobwall.co.uk
    ↓ (307 redirect)
https://www.jobwall.co.uk
    ↓ (308 redirect)
... INFINITE LOOP ...
```

---

## 📊 **What's Actually Happening**

### Step 1: Visit https://jobwall.co.uk
```bash
$ curl -I https://jobwall.co.uk

HTTP/2 307 ← TEMPORARY REDIRECT (WRONG!)
location: https://www.jobwall.co.uk/
```

**Problem:** Apex is redirecting TO www (should be the opposite)

---

### Step 2: Redirected to https://www.jobwall.co.uk
```bash
$ curl -I https://www.jobwall.co.uk

HTTP/2 308 ← PERMANENT REDIRECT (CORRECT!)
location: https://jobwall.co.uk/
```

**This is correct!** Your `next.config.js` (lines 3-14) properly redirects www → apex

---

### Step 3: Back to https://jobwall.co.uk
...and the loop repeats forever! Browser gives up after 20+ redirects.

---

## ✅ **What SHOULD Happen**

```
https://jobwall.co.uk
    ↓ (200 OK - SERVES THE APP)
    ✅ Landing page loads

https://www.jobwall.co.uk
    ↓ (308 redirect via next.config.js)
https://jobwall.co.uk
    ↓ (200 OK - SERVES THE APP)
    ✅ Landing page loads
```

---

## 🎯 **Root Cause**

Looking at your project configuration:

```bash
$ npx vercel projects ls

recruitment-operations    https://www.jobwall.co.uk   ← PROBLEM!
```

**The issue:** Vercel thinks `www.jobwall.co.uk` is your **production domain**

**What this means:**
- Vercel automatically redirects apex → www (307) to send traffic to "production"
- Your Next.js app redirects www → apex (308) per `next.config.js`
- Result: Infinite loop!

---

## 🔧 **Why This Happened**

When domains are managed by Vercel DNS but not explicitly assigned to your project:

1. **DNS resolves correctly** ✅ (nameservers work)
2. **But Vercel doesn't know which domain is primary** ❌
3. **Vercel defaults to www as production** ❌ (wrong choice!)
4. **Your app says apex is primary** ✅ (correct!)
5. **Conflict = redirect loop** ❌

---

## ✅ **The Solution**

You need to tell Vercel that **`jobwall.co.uk` (apex) is the primary production domain**.

### **How to Fix in Vercel Dashboard:**

**Go to:** https://vercel.com/troy-blairandbowes-projects/recruitment-operations/settings/domains

### **Current State (Wrong):**
```
www.jobwall.co.uk → Assigned as Production ❌
jobwall.co.uk → Not assigned ❌
```

### **Target State (Correct):**
```
jobwall.co.uk → Assigned as Production ✅ (Primary)
www.jobwall.co.uk → Redirect to apex ✅ (Secondary)
```

---

## 📋 **Step-by-Step Fix**

### **Step 1: Add Apex Domain**

1. Go to domains settings
2. In "Add Domain" field, enter: `jobwall.co.uk`
3. Click "Add"
4. If it says "already assigned to another project":
   - Click "Transfer to this project"
   - Or "Remove from other project" first, then add
5. **Important:** When adding, make sure it's set as **Production**

### **Step 2: Add WWW Domain**

1. In "Add Domain" field, enter: `www.jobwall.co.uk`
2. Click "Add"
3. Vercel will detect it should redirect to apex
4. This will use your `next.config.js` redirect (308)

### **Step 3: Verify Primary Domain**

In the domains list, you should see:

```
✅ jobwall.co.uk
   Status: Production

✅ www.jobwall.co.uk
   Status: Redirect → jobwall.co.uk
```

If `www` is marked as Production:
- Click the three dots (...) next to `jobwall.co.uk`
- Select "Set as Primary" or "Use for Production"

---

## 🧪 **How to Verify It's Fixed**

After configuring in dashboard:

### **Test 1: Apex Domain (Should Return 200)**
```bash
curl -I https://jobwall.co.uk

# Expected:
HTTP/2 200 ✅
content-type: text/html; charset=utf-8
server: Vercel
x-frame-options: DENY
```

### **Test 2: WWW Domain (Should Redirect to Apex)**
```bash
curl -I https://www.jobwall.co.uk

# Expected:
HTTP/2 308 ✅
location: https://jobwall.co.uk/
server: Vercel
```

### **Test 3: In Browser**
1. Visit https://jobwall.co.uk
   - ✅ Should load landing page immediately
   - ✅ URL stays as `jobwall.co.uk`

2. Visit https://www.jobwall.co.uk
   - ✅ Should redirect to `jobwall.co.uk`
   - ✅ Landing page loads

---

## 🎯 **Why recruitment-operations.vercel.app Works**

```bash
$ curl -I https://recruitment-operations.vercel.app

HTTP/2 200 ✅
```

**This works because:**
- It's the default Vercel deployment URL
- Not affected by custom domain configuration
- Always serves the app directly (no redirects)
- Acts as a "backup" URL that always works

---

## 📊 **Visual Comparison**

### **Current Setup (Broken):**
```
┌──────────────────┐     307        ┌──────────────────┐
│  jobwall.co.uk   │ ────────────> │ www.jobwall.co.uk│
│  (Apex)          │               │  (WWW)           │
└──────────────────┘               └──────────────────┘
        ↑                                    │
        │              308                   │
        └────────────────────────────────────┘

        = INFINITE LOOP! 🔄
```

### **Target Setup (Fixed):**
```
┌──────────────────┐
│  jobwall.co.uk   │ ────────────> 200 OK ✅
│  (Primary)       │               Serves App
└──────────────────┘
        ↑
        │              308
        │
┌──────────────────┐
│ www.jobwall.co.uk│
│  (Redirects)     │
└──────────────────┘

= Works! ✅
```

---

## 🔑 **Key Insight**

**Your `next.config.js` is CORRECT** ✅

The problem is NOT in your code. The problem is in Vercel's domain configuration:

- **Code says:** www → apex (CORRECT)
- **Vercel says:** apex → www (WRONG)
- **Result:** They fight each other = loop

**Fix:** Tell Vercel that apex is primary in the dashboard.

---

## ⚡ **Why You Can't Fix This Via CLI**

The Vercel CLI gives this error:
```
Error: Cannot add jobwall.co.uk since it's already assigned to another project.
```

**This means:**
- The domain exists in Vercel's system
- But it's either:
  - Assigned to a different project, OR
  - In a "pending" state, OR
  - Assigned to this project but not as primary

**Only the dashboard can:**
- Transfer domains between projects
- Set primary/production domain
- Resolve domain conflicts

---

## 📖 **Summary**

**Problem:** Redirect loop (307 → 308 → 307 → 308...)

**Cause:** Vercel thinks www is production, your app thinks apex is production

**Solution:** Add both domains in dashboard, set apex as primary

**Time to Fix:** 5 minutes

**After Fix:**
- ✅ https://jobwall.co.uk → Serves app (200 OK)
- ✅ https://www.jobwall.co.uk → Redirects to apex (308)
- ✅ No redirect loop
- ✅ SSL works on both
- ✅ All security headers active

---

## 🚀 **Next Action**

**Go to:** https://vercel.com/troy-blairandbowes-projects/recruitment-operations/settings/domains

**Add:**
1. `jobwall.co.uk` (set as Production/Primary)
2. `www.jobwall.co.uk` (will auto-redirect to apex)

**Result:** Site will be live in 1-2 minutes after adding! 🎉

---

**Last Updated:** October 1, 2025, 10:01 PM
**Issue:** Redirect loop (apex ↔ www)
**Root Cause:** Domain not assigned to project as primary
**Fix Required:** Dashboard configuration (5 min)
**Your Code:** ✅ Correct (no changes needed)
