# Kashmir Loom Tour & Travels — Deployment Package

## 📁 Folder Structure

```
kashmir-loom/
├── index.html        ← Main website (all bugs fixed + clean UI)
├── style.css         ← Stylesheet (responsive, polished)
├── script.js         ← JavaScript (slider, lightbox, form, etc.)
├── images/           ← Put your images here (see list below)
└── README.md         ← This file
```

## 🖼️ Required Images

Place these files inside the `images/` folder:

| Filename         | Used In                                |
|------------------|----------------------------------------|
| `hero-bg.png`    | Hero background, CTA section           |
| `dal-lake.png`   | About section float, Destinations, Gallery |
| `shikara.png`    | About section main image, Gallery      |
| `gulmarg.png`    | Destinations, Gallery                  |
| `pahalgam.png`   | Destinations, Gallery                  |
| `sonamarg.png`   | Destinations, Gallery                  |

> 💡 **Tip:** Use JPEG for photos (smaller file size). Recommended width: 1400px for hero, 800px for others.

## 🚀 Deployment Options

### Option 1: Static Hosting (Recommended — Free)
- **Netlify**: Drag & drop the `kashmir-loom/` folder at netlify.com/drop
- **Vercel**: `vercel deploy` or drag & drop at vercel.com
- **GitHub Pages**: Push to a repo → Settings → Pages → Deploy from main branch

### Option 2: cPanel / Traditional Hosting
1. Upload all files to `public_html/` via File Manager or FTP
2. Ensure `index.html` is in the root

### Option 3: Cloudflare Pages
1. Push files to a GitHub repo
2. Connect repo at pages.cloudflare.com
3. Build command: *(leave empty)*; Output directory: `/`

## ✅ Bugs Fixed

1. **Email address** — Decoded from Cloudflare obfuscation → `mannatourandtravels@gmail.com`
2. **Review slider** — Card widths now calculated from container pixel width, not broken % of track
3. **Packages grid** — Changed from 1-col (480px max) to proper 4→3→2→1 responsive grid
4. **Mobile nav** — Added overlay backdrop + `aria-expanded` + body scroll-lock
5. **Services grid** — Improved to 4→3→2→1 responsive instead of collapsing too early
6. **About images overflow** — Added `padding-bottom + padding-right` to contain the float card
7. **Lightbox** — Added to HTML (was missing), wired fully including keyboard focus & scroll-lock
8. **Gallery items** — Added keyboard accessibility (`tabindex`, `role="button"`)
9. **`form-group:has(textarea)` label** — Replaced with explicit `.form-group-textarea` class (better browser compat)
10. **Nav toggle** — Added `aria-expanded` attribute for accessibility
11. **Particle animation** — Fixed random direction using consistent keyframes instead of inline random
12. **Submit button** — Disables during WhatsApp open to prevent double-submit

## 📞 Contact Details in the Site

- Phone 1: +91 78895 28922
- Phone 2: +91 97977 16577  
- WhatsApp: +91 78895 28922
- Email: mannatourandtravels@gmail.com
- Address: NH 444, Nowgam-Pulwama Rd, Khanda, J&K 191113
