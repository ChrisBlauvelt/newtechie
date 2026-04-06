# Project Structure

## Root Configuration Files

- `package.json`: Dependencies and npm scripts (uses pnpm)
- `svelte.config.js`: SvelteKit configuration with Vercel adapter
- `vite.config.js`: Vite build configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS configuration
- `vercel.json`: Vercel deployment settings

## Source Directory (`/src`)

### Core Files

- `app.html`: HTML template with meta tags, favicons, and third-party scripts (Klaviyo)
- `app.css`: Global styles and CSS custom properties
- `tailwind.css`: Tailwind directives
- `animations.js`: Reusable Svelte transition functions (fadeIn, scaleIn, slideIn)

### Routes (`/src/routes`)

SvelteKit file-based routing structure:

- `+layout.svelte`: Root layout (imports global CSS, initializes Vercel Analytics)
- `+page.svelte`: Homepage with all main sections
- `/home-improvement/+page.svelte`: Home improvement services page
- `/pricing/+page.svelte`: Pricing information
- `/privacy-policy/+page.svelte`: Privacy policy
- `/terms-of-service/+page.svelte`: Terms of service

### Components (`/src/components`)

Currently empty - components are defined inline in route files

## Static Assets (`/static`)

- `/portfolio/`: Portfolio project images (WebP format with placeholders)
- `/sounds/`: Audio files for interactions
- `profile.jpg`, `profile.webp`: Profile images with placeholder
- `resume.pdf`: Downloadable resume
- `robots.txt`, `sitemap.xml`: SEO files
- Favicon files (ico, webp, apple-touch-icon)

## Scripts (`/scripts`)

Utility scripts for asset generation:

- `generate-placeholder.js`: Creates placeholder images
- `generate-portfolio-placeholders.js`: Generates portfolio placeholders
- `generate-screenshots.js`: Uses Puppeteer for screenshots

## Build Output

- `.svelte-kit/`: SvelteKit build artifacts (generated, not committed)
- `.vercel/`: Vercel deployment output (generated, not committed)
- `node_modules/`: Dependencies (not committed)

## Conventions

### File Naming

- Route files: `+page.svelte`, `+layout.svelte` (SvelteKit convention)
- Static assets: kebab-case with descriptive names
- Scripts: kebab-case with `.js` extension

### Component Structure

- Components currently inline in route files
- Use Svelte's `<script>`, `<style>`, and markup sections
- Import animations from `animations.js` for consistent transitions

### Styling Approach

- Tailwind utility classes for most styling
- Custom CSS variables for theming
- Responsive design with mobile-first approach
- Glassmorphic effects for buttons and cards
- Hover states with transitions for interactive elements

### State Management

- Component-level reactive state using Svelte stores
- No global state management library
- Analytics tracking via Vercel Analytics `track()` function

### Image Strategy

- WebP format with fallback images
- Placeholder images for lazy loading
- Responsive images with multiple sizes
- Alt text for accessibility
