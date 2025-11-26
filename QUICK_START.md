# Quick Start Guide - Yellow Book UI/UX

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Running API server on port 3333

### Start Development

1. **Start API Server** (Terminal 1)
```bash
cd "c:\Users\user\Desktop\web ahisan\yellow-book"
npm run start:api
```

2. **Start Web Application** (Terminal 2)
```bash
cd "c:\Users\user\Desktop\web ahisan\yellow-book"
npm run start:web
```

3. **Open Browser**
```
http://localhost:3000  (or 3001 if 3000 is in use)
```

## 📂 File Structure

```
apps/web/src/app/
├── layout.tsx                    # Root layout with Inter font
├── page.tsx                      # Homepage with search & categories
├── page.module.css               # Homepage styles
├── global.css                    # Global styles & CSS variables
└── business/
    └── [id]/
        ├── page.tsx              # Business details page
        └── page.module.css       # Business details styles
```

## 🎨 Key Changes Made

### 1. **Global Styles** (`global.css`)
- Added CSS custom properties for colors
- Yellow color palette: `--yellow-primary`, `--yellow-dark`, etc.
- Gray scale: `--gray-50` through `--gray-900`
- Removed old Nx boilerplate styles

### 2. **Homepage** (`page.tsx`)
**Features:**
- Hero section with gradient background
- Search bar with real-time filtering
- Category browsing (6 categories)
- Featured businesses section
- Search results display
- Responsive footer

**States:**
- Loading state
- Search active state
- Category filter active
- Results display

### 3. **Business Details** (`business/[id]/page.tsx`)
**Sections:**
- Business header with icon & badge
- About section
- Services grid (4 service cards)
- Location with map placeholder
- Customer reviews (2 sample reviews)
- Contact information sidebar
- Business hours
- Social media links

### 4. **Layout** (`layout.tsx`)
- Added Inter font from Google Fonts
- Updated metadata
- TypeScript type for metadata

## 🎯 Component Patterns

### Search & Filter
```tsx
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

const filteredEntries = entries.filter((entry) => {
  const matchesSearch = /* search logic */;
  const matchesCategory = /* category logic */;
  return matchesSearch && matchesCategory;
});
```

### Navigation
```tsx
import Link from 'next/link';

<Link href="/business/${entry.id}">
  {/* Card content */}
</Link>
```

### Dynamic Routes
```tsx
const params = useParams();
// Access business ID: params.id
```

## 🎨 Styling Patterns

### CSS Modules
```tsx
import styles from './page.module.css';

<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
</div>
```

### Dynamic Classes
```tsx
className={`${styles.categoryCard} ${
  selectedCategory === category.name ? styles.categoryCardActive : ''
}`}
```

### CSS Variables
```css
.button {
  background: var(--yellow-primary);
  color: var(--gray-900);
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile First - Default styles for mobile */
.container {
  padding: 1rem;
}

/* Tablet */
@media (max-width: 1024px) {
  .contentGrid {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .heroTitle {
    font-size: 2.5rem;
  }
}
```

## 🔧 Customization Guide

### Change Primary Color
```css
/* In global.css */
:root {
  --yellow-primary: #your-color;
  --yellow-dark: #your-darker-color;
  --yellow-light: #your-lighter-color;
}
```

### Add New Category
```tsx
// In page.tsx
const CATEGORIES = [
  // ...existing categories
  { name: 'New Category', icon: '🎯', color: '#hexcolor' },
];
```

### Modify Card Layout
```css
/* In page.module.css */
.card {
  /* Adjust spacing, colors, borders */
  padding: 2rem;
  border-radius: 20px;
}
```

## 🎯 Common Tasks

### Add a New Section to Homepage
1. Create section in `page.tsx`
2. Add styles in `page.module.css`
3. Update responsive breakpoints if needed

### Modify Business Details Layout
1. Edit `business/[id]/page.tsx`
2. Update `business/[id]/page.module.css`
3. Add new data from API if needed

### Change Typography
```css
/* In global.css or component CSS */
.heading {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}
```

## 🐛 Troubleshooting

### Port Already in Use
```
Port 3000 is in use, trying 3001 instead.
```
**Solution:** App will automatically use next available port

### API Connection Failed
```
Failed to fetch entries
```
**Solution:** Ensure API server is running on port 3333

### Styles Not Updating
**Solution:** 
1. Clear Next.js cache: Delete `.next` folder
2. Restart development server
3. Hard refresh browser (Ctrl + Shift + R)

### TypeScript Errors
**Solution:**
```bash
npm run typecheck
```
Review and fix type issues

## 📦 Dependencies Used

```json
{
  "next": "~15.2.4",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@yellow-book/contract": "workspace:*"
}
```

## 🎨 CSS Architecture

```
Global Styles (global.css)
    ↓
Layout Styles (layout)
    ↓
Page Styles (page.module.css)
    ↓
Component Styles (inline or modules)
```

## 🚀 Build for Production

```bash
# Build all projects
npm run build

# Build only web
npx nx build @yellow-book/web

# Start production server
npx nx start @yellow-book/web
```

## 📊 Performance Tips

1. **Use CSS Modules** - Scoped styles, no conflicts
2. **Optimize Images** - Use Next.js Image component
3. **Lazy Load** - Load components/data as needed
4. **CSS Variables** - Efficient theming
5. **Minimal Dependencies** - Keep bundle size small

## 🔍 Testing Checklist

### Visual Testing
- [ ] Homepage loads correctly
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Business cards display properly
- [ ] Business details page loads
- [ ] Responsive on mobile
- [ ] Hover effects work
- [ ] Links are clickable

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **CSS Modules**: https://github.com/css-modules/css-modules
- **Nx Docs**: https://nx.dev

## 🎓 Learning Path

1. Understand the file structure
2. Review global styles and variables
3. Examine homepage component
4. Study business details page
5. Modify styles to see changes
6. Add new features incrementally

## 🌟 Next Steps

1. **Add Real Data**: Connect to actual database
2. **Implement Search API**: Server-side search
3. **Add Authentication**: User accounts
4. **Integrate Maps**: Google Maps API
5. **Add Reviews**: User-generated content
6. **Optimize Images**: Add business logos
7. **Add Animations**: Framer Motion
8. **SEO Optimization**: Meta tags, structured data

---

Happy coding! 🎉
