# SEO Monitoring & Optimization Guide

**Last Updated**: October 21, 2025
**Status**: Phase 5 - Monitoring & Iteration

## Overview

This guide provides step-by-step instructions for monitoring SEO performance, tracking organic traffic, and iterating on optimization strategies for Jobwall.

---

## 1. Google Search Console Setup

### Initial Setup (Required)

1. **Verify Domain Ownership**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add property: `jobwall.co.uk`
   - Verification methods:
     - **Recommended**: DNS TXT record (permanent, works for all subdomains)
     - Alternative: HTML file upload via Vercel

2. **Submit Sitemap**
   ```
   https://jobwall.co.uk/sitemap.xml
   ```
   - Navigate to: Search Console → Sitemaps
   - Submit URL: `https://jobwall.co.uk/sitemap.xml`
   - Verify submission status: "Success"

3. **Monitor Index Coverage**
   - Check: Search Console → Index → Coverage
   - Target: All 15+ pages indexed within 7-14 days
   - Pages to verify:
     - `/` (homepage)
     - `/features`
     - `/use-cases`
     - `/blog`
     - `/blog/how-to-prevent-lost-placements`
     - `/help`
     - `/privacy`
     - `/terms`
     - `/cookies`
     - `/start/account`
     - `/get-started`

### Weekly Monitoring Tasks

1. **Performance Report**
   - Check: Search Console → Performance
   - Metrics to track:
     - **Total Clicks**: Growth week-over-week
     - **Total Impressions**: Search visibility
     - **Average CTR**: Click-through rate (target: >3%)
     - **Average Position**: Ranking position (target: <20 for key terms)

2. **Top Queries**
   - Monitor which keywords drive traffic
   - Compare to target keywords from metadata
   - Expected top queries:
     - "recruitment pipeline management"
     - "prevent lost placements"
     - "recruitment CRM UK"
     - "placement tracking software"

3. **Page Performance**
   - Identify top-performing pages
   - Optimize low-performing pages with:
     - Better titles/descriptions
     - Additional internal links
     - More comprehensive content

4. **Mobile Usability**
   - Check: Search Console → Mobile Usability
   - Fix any reported issues immediately
   - Target: 0 mobile usability errors

---

## 2. Analytics Tracking

### Plausible Analytics (Current Setup)

**Dashboard**: [plausible.io/jobwall.co.uk](https://plausible.io/jobwall.co.uk)

**Key Metrics to Monitor**:
- **Unique Visitors**: Total new users
- **Pageviews**: Total page loads
- **Bounce Rate**: % of single-page sessions (target: <60%)
- **Visit Duration**: Average session time (target: >2 minutes)

**Traffic Sources**:
- **Direct**: Users typing URL or bookmarks
- **Organic Search**: Google, Bing, DuckDuckGo
- **Referral**: Links from other sites
- **Social**: LinkedIn, Twitter, Facebook

**Top Pages**:
- Homepage (`/`)
- Features (`/features`)
- Use Cases (`/use-cases`)
- Blog (`/blog/how-to-prevent-lost-placements`)

**Goals Setup** (Optional):
```html
<!-- Add to conversion pages -->
<script>
  window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }
  plausible('Trial Signup') // Track signup conversions
</script>
```

---

## 3. LLM Citation Tracking

### Manual Monitoring (Monthly)

Test how LLMs reference Jobwall:

1. **ChatGPT (GPT-4 with web search)**
   ```
   What is the best recruitment pipeline software for UK agencies to prevent lost placements?
   ```
   - Check if Jobwall appears in results
   - Note: Citation format, position, description

2. **Claude (with web search)**
   ```
   How do UK recruitment consultants prevent lost placements?
   ```
   - Check for Jobwall mentions
   - Verify accuracy of information

3. **Perplexity AI**
   ```
   recruitment operations dashboard UK
   ```
   - Monitor featured snippets
   - Track citation frequency

4. **Google Gemini**
   ```
   What features should recruitment pipeline software have?
   ```
   - Check if Jobwall features page appears

### Optimization for LLM Citations

**Content Patterns That Perform Well**:
- ✅ Direct answers to specific questions (FAQ format)
- ✅ Numbered lists and step-by-step guides
- ✅ Comprehensive feature comparisons
- ✅ Real-world use cases with specific metrics
- ✅ Problem → Solution → Results structure

**Avoid**:
- ❌ Marketing fluff without substance
- ❌ Vague claims without data
- ❌ Keyword stuffing
- ❌ Thin content pages

---

## 4. Organic Traffic Goals

### 30-Day Targets (November 2025)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Indexed Pages | 0 | 15 | 🟡 Pending |
| Organic Visitors | 0 | 50 | 🟡 Pending |
| Avg Position (Top 5 Keywords) | N/A | <30 | 🟡 Pending |
| Blog Post Views | 0 | 20 | 🟡 Pending |

### 90-Day Targets (January 2026)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Indexed Pages | 15 | 25 | 🟡 Pending |
| Organic Visitors | 50 | 300 | 🟡 Pending |
| Avg Position (Top 5 Keywords) | <30 | <15 | 🟡 Pending |
| Blog Post Views | 20 | 150 | 🟡 Pending |
| Backlinks | 0 | 5 | 🟡 Pending |

### 180-Day Targets (April 2026)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Indexed Pages | 25 | 40 | 🟡 Pending |
| Organic Visitors | 300 | 1,000 | 🟡 Pending |
| Avg Position (Top 5 Keywords) | <15 | <10 | 🟡 Pending |
| Blog Post Views | 150 | 600 | 🟡 Pending |
| Backlinks | 5 | 20 | 🟡 Pending |
| Trial Signups from SEO | 0 | 10 | 🟡 Pending |

---

## 5. Keyword Tracking

### Primary Keywords (Target <10 Position)

1. **"recruitment pipeline management"** - Priority 1
   - Current Position: Not tracked
   - Competing Pages: `/features`, `/`
   - Monthly Volume: ~320 (UK)

2. **"prevent lost placements recruitment"** - Priority 1
   - Current Position: Not tracked
   - Competing Pages: `/blog/how-to-prevent-lost-placements`, `/`
   - Monthly Volume: ~50 (UK)

3. **"recruitment CRM UK"** - Priority 2
   - Current Position: Not tracked
   - Competing Pages: `/features`, `/use-cases`
   - Monthly Volume: ~590 (UK)

4. **"placement tracking software"** - Priority 2
   - Current Position: Not tracked
   - Competing Pages: `/features`, `/`
   - Monthly Volume: ~140 (UK)

5. **"recruitment operations dashboard"** - Priority 3
   - Current Position: Not tracked
   - Competing Pages: `/`, `/use-cases`
   - Monthly Volume: ~90 (UK)

### Long-Tail Keywords (Target <20 Position)

- "how to prevent lost placements in recruitment"
- "recruitment agency software UK"
- "in-house recruitment tools"
- "freelance recruiter dashboard"
- "recruitment pipeline visibility"

### Tracking Tools

**Free**:
- Google Search Console (positions, clicks, impressions)
- Plausible Analytics (traffic sources)

**Paid** (Optional):
- Ahrefs (keyword positions, backlinks, competitor analysis)
- SEMrush (comprehensive SEO tracking)

---

## 6. Content Iteration Strategy

### Monthly Content Audit

**Review Metrics**:
1. **Page Performance**
   - Impressions: Search visibility
   - Clicks: User interest
   - CTR: Title/description quality
   - Position: Ranking performance

2. **Improvement Actions**
   - **Low Impressions** → Add internal links, improve keywords
   - **Low CTR** → Rewrite title/meta description
   - **High Impressions, Low Clicks** → Optimize snippets, add FAQ schema
   - **Low Position** → Expand content, add media, improve structure

### Content Expansion Roadmap

**Q1 2026**:
- Blog Post: "7 Signs Your Recruitment Pipeline Needs a Dedicated Dashboard"
- Blog Post: "Recruitment Agency vs Freelance Consultant: Which Tool is Right?"
- Use Case: "How Thames Recruitment Saved £96k Annually"
- Landing Page: `/pricing` (dedicated pricing page with calculator)

**Q2 2026**:
- Blog Post: "Ultimate Guide to Recruitment Analytics"
- Blog Post: "How to Measure Placement Velocity"
- Use Case: "In-House Team Case Study: Tech Startup"
- Landing Page: `/demo` (interactive product demo)

**Q3 2026**:
- Blog Post: "Client Response Time Optimization Guide"
- Blog Post: "Recruitment SLA Best Practices"
- Resource: "Recruitment Pipeline Template (Free Download)"
- Landing Page: `/integrations` (future feature)

---

## 7. Backlink Strategy

### Priority Backlink Sources

1. **Recruitment Industry Publications**
   - Target: The Recruiter, Recruitment International, RecTech
   - Method: Contribute guest articles, industry insights

2. **SaaS Directories**
   - Target: Capterra, G2, GetApp, Software Advice
   - Method: Claim listings, collect reviews

3. **UK Business Directories**
   - Target: Startup Britain, Tech Nation, London & Partners
   - Method: Submit company profile

4. **Recruitment Communities**
   - Target: Reddit /r/recruiting, LinkedIn recruitment groups
   - Method: Helpful contributions, not spam

5. **Podcast Guest Appearances**
   - Target: Recruitment podcasts (The Recruitment Brainfood, etc.)
   - Method: Pitch founder story, operational expertise

### Link Building Guidelines

**Do**:
- ✅ Create genuinely helpful content worth linking to
- ✅ Build relationships with industry influencers
- ✅ Contribute valuable insights in communities
- ✅ Offer free resources (templates, guides, tools)

**Don't**:
- ❌ Buy backlinks (Google penalty risk)
- ❌ Spam forums/communities
- ❌ Use automated link building tools
- ❌ Create low-quality guest posts

---

## 8. Technical SEO Monitoring

### Weekly Checks

1. **Sitemap Status**
   ```bash
   curl https://jobwall.co.uk/sitemap.xml
   ```
   - Verify 200 status code
   - Check all pages present

2. **Robots.txt Accessibility**
   ```bash
   curl https://jobwall.co.uk/robots.txt
   ```
   - Verify sitemap URL correct
   - Check LLM crawler permissions

3. **Page Speed**
   - Tool: [PageSpeed Insights](https://pagespeed.web.dev/)
   - Target: >90 mobile, >95 desktop
   - Core Web Vitals: All green

4. **Mobile Usability**
   - Tool: Google Mobile-Friendly Test
   - Target: "Page is mobile-friendly"

5. **Structured Data Validation**
   - Tool: [Rich Results Test](https://search.google.com/test/rich-results)
   - Test URLs:
     - `/` (Organization, SoftwareApplication, HowTo)
     - `/features` (Breadcrumb)
     - `/blog` (Breadcrumb)
     - `/blog/how-to-prevent-lost-placements` (Article, Breadcrumb)
   - Verify: 0 errors, 0 warnings

---

## 9. SEO Success Metrics

### Key Performance Indicators (KPIs)

**Traffic**:
- Organic visitors/month
- Pageviews/session
- Avg session duration
- Pages per session

**Rankings**:
- Keywords in top 10 (page 1)
- Keywords in top 20 (page 2)
- Average position for primary keywords

**Conversions**:
- Trial signups from organic
- Blog → Trial conversion rate
- Features page → Trial conversion rate

**Authority**:
- Total backlinks
- Referring domains
- Domain Authority (Moz) / Domain Rating (Ahrefs)

### Monthly Reporting Template

```markdown
# SEO Performance Report - [Month Year]

## Traffic Overview
- Organic Visitors: XXX (+XX% vs last month)
- Total Pageviews: XXX (+XX% vs last month)
- Top Pages:
  1. [Page] - XXX visits
  2. [Page] - XXX visits
  3. [Page] - XXX visits

## Rankings
- Keywords in Top 10: XX (+X)
- Keywords in Top 20: XX (+X)
- Average Position (Top 5 Keywords): XX.X

## Conversions
- Trial Signups from Organic: XX
- Conversion Rate: X.X%

## Content Performance
- Top Blog Post: [Title] (XXX visits)
- Avg Time on Blog Posts: X:XX

## Actions for Next Month
1. [Action item based on data]
2. [Action item based on data]
3. [Action item based on data]
```

---

## 10. Quick Reference

### Essential URLs

- **Sitemap**: https://jobwall.co.uk/sitemap.xml
- **Robots.txt**: https://jobwall.co.uk/robots.txt
- **Google Search Console**: https://search.google.com/search-console
- **Plausible Analytics**: https://plausible.io/jobwall.co.uk
- **PageSpeed Insights**: https://pagespeed.web.dev/

### Target Keywords (Copy-Paste for Tracking)

```
recruitment pipeline management
prevent lost placements recruitment
recruitment CRM UK
placement tracking software
recruitment operations dashboard
recruitment agency software UK
in-house recruitment tools
freelance recruiter dashboard
how to prevent lost placements
recruitment analytics dashboard
```

### Recommended Reading

- [Google Search Central](https://developers.google.com/search/docs)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Ahrefs SEO Blog](https://ahrefs.com/blog/)
- [Search Engine Journal](https://www.searchenginejournal.com/)

---

## Changelog

- **October 21, 2025**: Initial guide creation (Phase 5 kickoff)
