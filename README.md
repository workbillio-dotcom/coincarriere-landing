# CoinCarrière — Landing Page

Professional recruitment platform for the BTP (Construction) sector in Morocco. This landing page is designed to convert HR professionals and hiring managers into registered users.

## Tech Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — custom design system (`style.css`) + Tailwind CSS (CDN)
- **Vanilla JavaScript** — animations, scroll effects, video interactions (`script.js`)
- **Meta Pixel** — conversion tracking
- **Google Fonts** — Sora, JetBrains Mono

## Project Structure

```
coincarriere-landing/
├── index.html                        # Main landing page
├── cgu.html                          # Terms of Use
├── politique-confidentialite.html    # Privacy Policy
├── style.css                         # Global styles & design system
├── script.js                         # Interactions & animations
├── vercel.json                       # Vercel deployment config
├── site.webmanifest                  # PWA manifest
├── logo.png                          # Brand logo
├── demo.webm                         # Platform demo video
├── hero-bg.mp4                       # Hero background — desktop
├── hero-bg-mobile.mp4                # Hero background — mobile
├── favicon.ico / favicon-*.png       # Favicon set
├── apple-touch-icon.png              # iOS icon
├── android-chrome-*.png              # Android icons
└── logos/                            # Partner & client logos (17 files)
```

## Local Development

No build step required — this is a static site.

```bash
# Serve locally with any static server, e.g.:
npx serve .

# Or with Python:
python -m http.server 3000
```

Then open [http://localhost:3000](http://localhost:3000).

## Deployment on Vercel

### One-click deploy (recommended)

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import the `coincarriere-landing` repository
4. Framework preset: **Other** (static site — no build command needed)
5. Click **Deploy**

### Manual deploy via Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### Update the site

Every `git push` to the `main` branch automatically triggers a redeploy on Vercel.

```bash
git add .
git commit -m "Your update message"
git push origin main
```

## Environment & Configuration

| Variable | Location | Description |
|----------|----------|-------------|
| Meta Pixel ID | `index.html` line 27 | Facebook/Meta tracking pixel |

## Pages & Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `index.html` | Main landing page |
| `/cgu` | `cgu.html` | Terms of Use |
| `/politique-confidentialite` | `politique-confidentialite.html` | Privacy Policy |
