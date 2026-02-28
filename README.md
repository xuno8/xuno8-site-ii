# xuno8-site-ii

Personal portfolio site with dual-mode experience — **Developer** and **Photographer**.

## Tech Stack

- [Astro 5](https://astro.build/) (SSG) + [Vue 3](https://vuejs.org/) islands
- [UnoCSS](https://unocss.dev/) (attributify mode)
- [GSAP](https://gsap.com/) + ScrollTrigger for animations
- [Nanostores](https://github.com/nanostores/nanostores) for cross-island state
- Deployed on [Cloudflare Workers](https://workers.cloudflare.com/) (Static Assets)

## Getting Started

```bash
npm install
npm run dev        # http://localhost:4321
```

## Scripts

| Command              | Description              |
| -------------------- | ------------------------ |
| `npm run dev`        | Start dev server         |
| `npm run build`      | Production build         |
| `npm run preview`    | Preview production build |
| `npm run lint`       | ESLint check             |
| `npm run lint:fix`   | ESLint auto-fix          |
| `npm run format`     | Prettier format          |

## Gallery Photos

Photos are hosted on Cloudflare R2 (`https://images.xuno8.com`). Metadata (filename, dimensions, alt text) is defined in `src/data/photos.yaml`. Thumbnails are generated at build time via Cloudflare Image Resizing.

## License

Private
