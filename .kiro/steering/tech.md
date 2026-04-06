# Tech Stack

## Framework & Build System

- **SvelteKit 2.4.0**: Full-stack framework for building the application
- **Svelte 4.2.7**: Component framework
- **Vite 5.0.3**: Build tool and dev server
- **Adapter**: Vercel adapter with Node.js 20.x runtime

## Styling

- **Tailwind CSS 3.3.5**: Utility-first CSS framework
- **PostCSS**: CSS processing with Autoprefixer
- **Custom CSS Variables**: HSL-based color system defined in app.css
  - `--background`, `--foreground`, `--card`, `--card-foreground`

## Key Libraries

- **@vercel/analytics**: Analytics tracking for user interactions
- **canvas-confetti**: Celebration animations
- **svelte-tilt**: 3D tilt effect for interactive elements
- **sharp**: Image processing (used in build scripts)
- **puppeteer**: Headless browser for screenshot generation

## Development Setup

### Common Commands

```bash
# Start development server (accessible on network)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Dev Server Configuration

- Port: 3000
- Host: 0.0.0.0 (accessible on local network)
- Strict port enforcement enabled

## Deployment

- **Platform**: Vercel
- **Runtime**: Node.js 20.x
- **Build output**: `.vercel/output/`
- **Config**: `vercel.json` for deployment settings

## Image Optimization

- Primary format: WebP for modern browsers
- Fallback: PNG/JPG for compatibility
- Placeholder images generated via scripts in `/scripts/`
- Uses lazy loading with placeholder strategy
