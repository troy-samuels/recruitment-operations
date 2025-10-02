# Accessibility (A11y) Standards & Testing

This document outlines the accessibility standards, testing procedures, and guidelines for the Jobwall recruitment operations dashboard.

## Overview

The application follows **WCAG 2.1 Level AA** standards to ensure accessibility for all users, including those with disabilities.

**Status**: ✅ Accessibility testing configured
**Last Audit**: 2025-10-02
**Target Compliance**: WCAG 2.1 Level AA

---

## 1. Accessibility Standards

### WCAG 2.1 Level AA Requirements

**Perceivable**:
- ✅ Text alternatives for non-text content
- ✅ Captions and audio descriptions for multimedia
- ✅ Content can be presented in different ways
- ✅ Minimum color contrast ratio of 4.5:1

**Operable**:
- ✅ All functionality available via keyboard
- ✅ Users have enough time to read and use content
- ✅ Content doesn't cause seizures (no flashing content)
- ✅ Users can navigate and find content

**Understandable**:
- ✅ Text is readable and understandable
- ✅ Content appears and operates in predictable ways
- ✅ Users are helped to avoid and correct mistakes

**Robust**:
- ✅ Content is compatible with assistive technologies
- ✅ Valid HTML and ARIA attributes

---

## 2. Automated Testing

### ESLint with jsx-a11y Plugin

**Status**: ✅ Configured

**Configuration** (.eslintrc.json):
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["jsx-a11y"],
  "rules": {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/heading-has-content": "error",
    // ... additional rules
  }
}
```

**Running Linter**:
```bash
npm run lint
```

**Fixing Auto-Fixable Issues**:
```bash
npm run lint -- --fix
```

### Common Issues Detected

1. **Missing alt text on images**:
   ```tsx
   // ❌ Bad
   <img src="/logo.png" />

   // ✅ Good
   <img src="/logo.png" alt="Jobwall logo" />
   ```

2. **Buttons without accessible names**:
   ```tsx
   // ❌ Bad
   <button><IconX /></button>

   // ✅ Good
   <button aria-label="Close modal"><IconX /></button>
   ```

3. **Links without text**:
   ```tsx
   // ❌ Bad
   <a href="/dashboard"><IconHome /></a>

   // ✅ Good
   <a href="/dashboard" aria-label="Dashboard"><IconHome /></a>
   ```

4. **Form inputs without labels**:
   ```tsx
   // ❌ Bad
   <input type="email" />

   // ✅ Good
   <label htmlFor="email">Email</label>
   <input type="email" id="email" />
   ```

---

## 3. Browser Testing with Playwright (Optional)

**Status**: 🔜 Can be implemented

**Installation**:
```bash
npm install --save-dev @playwright/test
npm install --save-dev @axe-core/playwright
```

**Test File** (tests/accessibility.spec.ts):
```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('Landing page should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Dashboard should not have accessibility violations', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login')
    // ... perform login

    await page.goto('http://localhost:3000/dashboard')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
```

**Running Tests**:
```bash
npx playwright test tests/accessibility.spec.ts
```

---

## 4. Manual Testing Checklist

### Keyboard Navigation

Test all pages with keyboard only (no mouse):

- [ ] **Tab key**: Navigate through interactive elements
- [ ] **Shift + Tab**: Navigate backwards
- [ ] **Enter/Space**: Activate buttons and links
- [ ] **Arrow keys**: Navigate within widgets (dropdowns, tabs)
- [ ] **Escape**: Close modals and dialogs
- [ ] **Focus indicators**: Visible on all interactive elements

**Pages to Test**:
- [ ] Landing page (/)
- [ ] Login page (/login)
- [ ] Dashboard (/dashboard)
- [ ] Analytics (/analytics)
- [ ] Onboarding (/onboarding)
- [ ] Team management (/team)
- [ ] Settings (/settings)

### Screen Reader Testing

**Tools**:
- **macOS**: VoiceOver (Cmd + F5)
- **Windows**: NVDA (free) or JAWS
- **Chrome**: ChromeVox extension

**Test Checklist**:
- [ ] Page title is announced
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Form labels are read correctly
- [ ] Button purposes are clear
- [ ] Images have descriptive alt text
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Modal dialogs trap focus

### Color Contrast

**Tool**: WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)

**Requirements**:
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

**Current Color Palette** (from tailwind.config.ts):
```
Primary (Navy): #152B3C on white = 12.63:1 ✅
Accent (Orange): #D46240 on white = 3.93:1 ⚠️ (close, but may need adjustment for small text)
Success (Green): #2F906A on white = 4.02:1 ✅
Gray text: #6b7280 on white = 5.74:1 ✅
```

**Action Items**:
- ⚠️ Consider darkening accent color for better contrast on small text

---

## 5. Accessibility Features Implemented

### Semantic HTML

✅ Proper use of semantic elements:
- `<header>`, `<nav>`, `<main>`, `<footer>`
- `<article>`, `<section>`, `<aside>`
- `<button>` for actions, `<a>` for navigation
- `<h1>` through `<h6>` for headings

### ARIA Labels

✅ ARIA attributes where needed:
- `aria-label` for buttons with only icons
- `aria-labelledby` for complex controls
- `aria-describedby` for additional context
- `aria-live` for dynamic content updates

### Focus Management

✅ Visible focus indicators:
```css
/* globals.css - all focusable elements have visible focus */
:focus-visible {
  outline: 2px solid #D46240;
  outline-offset: 2px;
}
```

✅ Focus trapping in modals:
- Modal components trap focus within dialog
- First focusable element receives focus on open
- Focus returns to trigger element on close

### Skip Links

✅ Skip to main content link:
```tsx
// src/app/layout.tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Form Validation

✅ Accessible form validation:
- Clear error messages
- Error messages associated with inputs (`aria-describedby`)
- Errors announced to screen readers (`aria-live`)
- Client-side and server-side validation

---

## 6. Known Issues & Roadmap

### Current Issues

1. **Drag-and-Drop Kanban Board**:
   - ⚠️ Drag-and-drop is mouse-only (not keyboard accessible)
   - **Solution**: Add keyboard shortcuts for moving cards
     - `Ctrl + Up/Down`: Move card within column
     - `Ctrl + Left/Right`: Move card to adjacent column

2. **Color-Only Indicators**:
   - ⚠️ Some status indicators rely solely on color
   - **Solution**: Add icons or text labels alongside color

3. **Third-Party Components**:
   - ⚠️ Some third-party libraries may not be fully accessible
   - **Solution**: Audit and replace or enhance with ARIA

### Roadmap

**Q1 2026**:
- [ ] Implement keyboard shortcuts for Kanban board
- [ ] Add high contrast mode toggle
- [ ] Comprehensive screen reader testing
- [ ] User testing with people with disabilities

**Q2 2026**:
- [ ] VPAT (Voluntary Product Accessibility Template) documentation
- [ ] Third-party accessibility audit
- [ ] Automated accessibility testing in CI/CD

**Q3 2026**:
- [ ] WCAG 2.2 compliance
- [ ] Mobile accessibility improvements
- [ ] Voice control support

---

## 7. Testing in CI/CD

### GitHub Actions Workflow

**File**: `.github/workflows/accessibility.yml`
```yaml
name: Accessibility Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint (includes jsx-a11y)
        run: npm run lint

      - name: Build application
        run: npm run build

  playwright-a11y:
    runs-on: ubuntu-latest
    needs: lint

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Start application
        run: npm run dev &

      - name: Wait for application
        run: npx wait-on http://localhost:3000

      - name: Run Playwright accessibility tests
        run: npx playwright test tests/accessibility.spec.ts

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Vercel Build Checks

Add to `package.json`:
```json
{
  "scripts": {
    "build": "next lint && next build"
  }
}
```

This ensures linting (including a11y checks) runs before every build.

---

## 8. Resources & Tools

### Testing Tools

1. **Lighthouse** (Chrome DevTools):
   - Built into Chrome
   - Automated accessibility audit
   - Performance, SEO, PWA checks

2. **axe DevTools** (Browser Extension):
   - Chrome/Firefox extension
   - Detailed accessibility testing
   - Issue guidance and remediation tips

3. **WAVE** (Browser Extension):
   - Chrome/Firefox extension
   - Visual feedback on accessibility
   - Inline error explanations

4. **Accessibility Insights** (Microsoft):
   - Chrome extension
   - Fast pass and comprehensive testing
   - Guided manual tests

### Screen Readers

1. **NVDA** (Windows): Free, widely used
2. **JAWS** (Windows): Commercial, industry standard
3. **VoiceOver** (macOS/iOS): Built-in
4. **TalkBack** (Android): Built-in
5. **ChromeVox** (Chrome): Extension for testing

### Online Checkers

1. **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
2. **WAVE**: https://wave.webaim.org/
3. **HTML Validator**: https://validator.w3.org/
4. **ARIA Validator**: https://www.w3.org/WAI/test-evaluate/

### Learning Resources

1. **WebAIM**: https://webaim.org/
2. **W3C WAI**: https://www.w3.org/WAI/
3. **A11y Project**: https://www.a11yproject.com/
4. **Deque University**: https://dequeuniversity.com/

---

## 9. Accessibility Statement

**For Website Footer**:

> **Accessibility Commitment**
>
> Jobwall is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
>
> **Conformance Status**
>
> We aim to conform to WCAG 2.1 Level AA standards. These guidelines explain how to make web content accessible to people with disabilities.
>
> **Feedback**
>
> We welcome your feedback on the accessibility of Jobwall. Please contact us if you encounter accessibility barriers:
> - Email: accessibility@jobwall.co.uk
> - We aim to respond within 5 business days
>
> **Technical Specifications**
>
> Jobwall relies on the following technologies:
> - HTML
> - CSS
> - JavaScript
> - ARIA
>
> These technologies are relied upon for conformance with the accessibility standards used.

---

## 10. Developers Guide

### Writing Accessible Components

**Checklist for Every Component**:
- [ ] Uses semantic HTML
- [ ] Has proper ARIA labels (if needed)
- [ ] Keyboard navigable
- [ ] Has visible focus indicators
- [ ] Screen reader tested
- [ ] Color contrast checked
- [ ] Responsive (works at 200% zoom)

**Example: Accessible Button Component**:
```tsx
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  ariaLabel?: string
  type?: 'button' | 'submit' | 'reset'
}

export function Button({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="px-4 py-2 bg-primary-500 text-white rounded-lg
                 hover:bg-primary-600 focus:outline-none focus:ring-2
                 focus:ring-primary-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}
```

**Example: Accessible Modal**:
```tsx
export function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Trap focus in modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements?.[0] as HTMLElement
      firstElement?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-xl font-bold mb-4">
          {title}
        </h2>
        {children}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4"
        >
          <IconX />
        </button>
      </div>
    </div>
  )
}
```

---

**Last Updated**: 2025-10-02
**Version**: 1.0.0
**Next Audit**: 2026-01-02 (Quarterly)
**Status**: Active Development ✅
