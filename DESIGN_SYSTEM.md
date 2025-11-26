# Yellow Book - Design Components Guide

## 🎨 Color System

### Primary Colors
```css
Yellow Primary:  #fbbf24  ████████  Main accent color
Yellow Dark:     #f59e0b  ████████  Hover states
Yellow Light:    #fde68a  ████████  Backgrounds
Yellow Pale:     #fef3c7  ████████  Subtle highlights
```

### Neutral Colors
```css
Gray 50:   #f9fafb  ████████  Page background
Gray 100:  #f3f4f6  ████████  Card backgrounds
Gray 200:  #e5e7eb  ████████  Borders
Gray 300:  #d1d5db  ████████  Dividers
Gray 400:  #9ca3af  ████████  Placeholder text
Gray 500:  #6b7280  ████████  Secondary text
Gray 600:  #4b5563  ████████  Body text
Gray 700:  #374151  ████████  Headings
Gray 800:  #1f2937  ████████  Dark headings
Gray 900:  #111827  ████████  Primary text
```

## 📐 Spacing Scale

```css
0.25rem  =  4px   (Tight spacing)
0.5rem   =  8px   (Small spacing)
0.75rem  = 12px   (Default gap)
1rem     = 16px   (Base unit)
1.5rem   = 24px   (Medium spacing)
2rem     = 32px   (Large spacing)
3rem     = 48px   (Extra large)
4rem     = 64px   (Section spacing)
```

## 🔤 Typography Scale

```css
0.75rem   = 12px  (Small text, badges)
0.875rem  = 14px  (Secondary text)
1rem      = 16px  (Body text)
1.125rem  = 18px  (Large body)
1.25rem   = 20px  (Small headings)
1.5rem    = 24px  (Medium headings)
2rem      = 32px  (Large headings)
2.5rem    = 40px  (Extra large)
3.5rem    = 56px  (Hero titles)
```

## 🎯 Component Examples

### Button Variants

```
┌─────────────────────┐
│   Primary Button    │  ← Yellow background (#fbbf24)
│    (Call Now)       │     Dark text (#111827)
└─────────────────────┘     Bold font weight

┌─────────────────────┐
│  Secondary Button   │  ← Gray background (#f3f4f6)
│  (Send Message)     │     Dark text (#111827)
└─────────────────────┘     Bold font weight
```

### Card Layouts

#### Business Card (Horizontal)
```
┌────────────────────────────────────────┬───┐
│  🏢 Business Name          [Category]  │ → │
│  Short description text...             │   │
│  📞 Phone  📍 Location                 │   │
└────────────────────────────────────────┴───┘
```

#### Featured Card (Vertical)
```
┌─────────────────────────┐
│      [Featured]         │
│                         │
│   Business Name         │
│   Category              │
│                         │
│   Description text...   │
│                         │
│   📍 Location           │
│   📞 Phone              │
└─────────────────────────┘
```

### Category Card
```
┌──────────────┐
│              │
│      🍕      │  ← Large emoji icon
│              │
│  Restaurant  │  ← Category name
│              │
└──────────────┘
  Hover: Yellow border + lift effect
```

### Search Bar
```
┌───────────────────────────────────────────────┬──────────┐
│ 🔍  Search for businesses, services...        │  Search  │
└───────────────────────────────────────────────┴──────────┘
     Icon    Input field                            Button
```

## 🎭 Interactive States

### Hover Effects
```
Default →  Hover
─────────────────────────────────────
Border: Gray 200  →  Yellow Primary
Shadow: 0 1px 3px  →  0 8px 24px (yellow tint)
Transform: none  →  translateY(-4px) | translateX(4px)
```

### Focus States
```css
Focus Ring: 2px solid Yellow Primary
Outline Offset: 2px
Box Shadow: 0 0 0 3px rgba(251, 191, 36, 0.3)
```

### Active States
```css
Background: Yellow Pale (#fef3c7)
Border: Yellow Primary (#fbbf24)
Scale: 0.98 (subtle press effect)
```

## 📱 Responsive Breakpoints

```
Mobile      │ < 768px      │ 1 column
────────────┼──────────────┼───────────────
Tablet      │ 768 - 1024px │ 2 columns
────────────┼──────────────┼───────────────
Desktop     │ > 1024px     │ Multi-column
            │              │ Max width: 1200px
```

## 🎨 Gradient Examples

### Hero Background
```css
background: linear-gradient(135deg, 
  #fef3c7 0%,   /* Yellow Pale */
  #fde68a 50%,  /* Yellow Light */
  #fbbf24 100%  /* Yellow Primary */
);
```

### Logo Text
```css
background: linear-gradient(135deg,
  #fbbf24,  /* Yellow Primary */
  #f59e0b   /* Yellow Dark */
);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

## 🔲 Border Radius Scale

```css
Small:   8px   (Badges, small buttons)
Medium: 12px   (Cards, inputs)
Large:  16px   (Main cards)
XLarge: 20px   (Featured cards)
Round:  50%    (Avatars, icons)
Pill:   999px  (Pills, tags)
```

## 📊 Shadow System

```css
/* Subtle - Default cards */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

/* Medium - Interactive cards */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

/* Large - Hover states */
box-shadow: 0 8px 24px rgba(251, 191, 36, 0.2);

/* XLarge - Featured elements */
box-shadow: 0 12px 32px rgba(251, 191, 36, 0.3);

/* Focus - Form inputs */
box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
```

## 🎯 Icon System

### Business Categories
```
🍕 Restaurant
⚕️ Healthcare
⚖️ Legal Services
💻 Technology
🚗 Automotive
🌿 Home & Garden
```

### Action Icons
```
📞 Phone / Call
✉️ Email / Message
🌐 Website
📍 Location / Map
⭐ Rating / Featured
🔍 Search
→  Navigation / Next
←  Back / Previous
✓  Checkmark / Verified
```

## 🎨 Usage Examples

### Primary CTA (Call-to-Action)
```css
background: var(--yellow-primary);
color: var(--gray-900);
padding: 1rem 2rem;
border-radius: 8px;
font-weight: 600;
transition: all 0.2s;
```

### Secondary Action
```css
background: var(--gray-100);
color: var(--gray-900);
padding: 1rem 2rem;
border-radius: 8px;
font-weight: 600;
```

### Badge / Tag
```css
background: var(--yellow-pale);
color: var(--yellow-dark);
padding: 0.25rem 0.75rem;
border-radius: 20px;
font-size: 0.75rem;
font-weight: 600;
```

### Card Container
```css
background: white;
border: 1px solid var(--gray-200);
border-radius: 16px;
padding: 1.5rem;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
```

## 🔄 Animation Timing

```css
/* Fast - Small UI changes */
transition: 150ms ease-in-out;

/* Medium - Standard interactions */
transition: 200ms ease-in-out;

/* Slow - Large movements */
transition: 300ms ease-in-out;
```

## 📐 Grid Layouts

### Category Grid
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
gap: 1.5rem;
```

### Business Cards Grid
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
gap: 2rem;
```

### Content + Sidebar
```css
display: grid;
grid-template-columns: 1fr 380px;
gap: 2rem;
```

## 🎯 Best Practices

### Do's ✅
- Use yellow for primary actions and accents
- Maintain consistent spacing (multiples of 4px)
- Apply hover effects on interactive elements
- Use semantic HTML elements
- Provide visual feedback for all actions
- Keep color contrast WCAG AA compliant

### Don'ts ❌
- Don't use yellow for large text areas
- Don't mix multiple accent colors
- Don't use too many shadows
- Don't skip hover/focus states
- Don't use bright colors for body text
- Don't forget responsive breakpoints

## 📱 Mobile Optimizations

```css
/* Stack elements vertically */
flex-direction: column;

/* Full-width buttons */
width: 100%;

/* Larger touch targets */
min-height: 44px;

/* Simplified navigation */
hamburger menu pattern

/* Reduced spacing */
padding: 1rem (instead of 2rem)
```

## 🌟 Accessibility Checklist

✅ Color contrast ratios meet WCAG AA
✅ Focus states visible on all interactive elements
✅ Semantic HTML (header, nav, main, footer)
✅ ARIA labels on icon-only buttons
✅ Keyboard navigation support
✅ Alt text on images
✅ Responsive text sizes
✅ Touch targets at least 44x44px

---

This design system ensures consistency across the Yellow Book application while maintaining flexibility for future enhancements.
