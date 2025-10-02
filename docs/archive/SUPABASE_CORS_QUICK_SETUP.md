# Supabase CORS - Quick Setup Checklist

**Time Required**: 5 minutes
**Current Status**: ✅ Code already configured, only Supabase Dashboard needs updating

---

## ✅ Your Code is Already Configured!

Your `src/lib/cors.ts` already has the correct CORS configuration:
- ✅ `https://jobwall.co.uk` (production)
- ✅ `https://www.jobwall.co.uk` (www subdomain)
- ✅ `http://localhost:3000` (development)
- ✅ `http://localhost:3001` (backup port)

**No code changes needed!**

---

## 🚀 Action Required: Supabase Dashboard Only

### Step 1: Login to Supabase Dashboard
Go to: https://supabase.com/dashboard

### Step 2: Select Your Project
Click on your recruitment operations project

### Step 3: Configure Authentication URLs
1. Navigate to **Authentication** (left sidebar)
2. Click **URL Configuration**
3. Set these values:

**Site URL:**
```
https://jobwall.co.uk
```

**Redirect URLs** (add all of these):
```
https://jobwall.co.uk/**
https://www.jobwall.co.uk/**
http://localhost:3000/**
http://localhost:3001/**
```

4. Click **Save**

### Step 4: Verify API Settings (Optional Check)
1. Navigate to **Settings** > **API**
2. Confirm your Project URL is visible
3. Confirm you have both:
   - `anon` `public` key (for client-side)
   - `service_role` `secret` key (for server-side)

---

## 🧪 Test It Works

### Test 1: Local Development
```bash
# Start your dev server
npm run dev

# Open browser to http://localhost:3000
# Open DevTools Console and run:
```

```javascript
fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    organisation: 'Test Co'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Success:', data))
.catch(err => console.error('❌ Error:', err))
```

**Expected**: ✅ No CORS errors

### Test 2: Production
1. Navigate to `https://jobwall.co.uk`
2. Open DevTools Console
3. Run the same test above

**Expected**: ✅ No CORS errors

---

## 📝 Summary

**What's Already Done:**
- ✅ CORS utility functions in `src/lib/cors.ts`
- ✅ Allowed origins configured (jobwall.co.uk + localhost)
- ✅ Helper functions available (`withCors`, `addCorsHeaders`)

**What You Need to Do:**
- [ ] Update Supabase Dashboard > Authentication > URL Configuration
- [ ] Add Site URL: `https://jobwall.co.uk`
- [ ] Add Redirect URLs (4 URLs listed above)
- [ ] Click Save
- [ ] Test from localhost and production

**Time**: 5 minutes
**Status**: Ready to deploy

---

## 📞 Need Help?

See the full guide: `SUPABASE_CORS_SETUP.md`

**Common Issue**: "CORS error still occurring"
**Solution**: Clear browser cache and hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

---

**Last Updated**: 2025-10-02
