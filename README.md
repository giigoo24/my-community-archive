# Portfolio Starter

A small website for your work. Two columns, a thumbnail index, and a page about you. On a phone, browse one column at a time.

[See the demo](https://echoes-from-afar.github.io/portfolio-starter/) · [Make your own copy](https://github.com/echoes-from-afar/portfolio-starter/generate)

Made for the Echoes from Afar workshop. Built with Astro and Markdown. No database, sign-in, or AI subscription needed to run the site.

## 1. Start

Install [Node.js 22.12 or later (an even-numbered LTS release)](https://nodejs.org/en/download) and [Git](https://git-scm.com/downloads).

On GitHub, choose **Use this template → Create a new repository**. Choose your own account, give it a name such as `my-portfolio`, and make it **Public** for free GitHub Pages hosting. You don't need to create an empty repository first.

Clone **your new repository**. Replace `YOUR-NAME` and `my-portfolio` below:

```sh
git clone https://github.com/YOUR-NAME/my-portfolio.git
cd my-portfolio
npm ci
npm run dev
```

Open the local address printed in your terminal. If you're using OpenCode, open this same folder. You can ask:

> Help me run this site locally. Read the README and AGENTS.md first. Change the name to “Sam Lee”. Keep the layout and sample projects for now.

## 2. Make it yours

- **Your name and group labels:** `src/site.ts`. Keep the IDs `left` and `right`; change their labels freely. Leave email blank if you don't want it displayed.
- **Your introduction:** `src/content/information.md`.
- **Your projects:** `src/content/projects/`. Copy one Markdown file, give it a new filename, then change its text.
- **Your images:** `public/images/`. Use small JPG, PNG, WebP or SVG files. Around 1600 px wide is usually plenty. The sample vectors are deliberately simple placeholders.

The filename becomes the project's address. `my-project.md` becomes `/projects/my-project/`. To preserve a shared link, keep its filename when editing.

```yaml
---
title: My project
group: left
year: '2026'
medium: Photography
summary: A short sentence about the work.
cover: /images/my-project.jpg
coverAlt: Describe what someone would see in this image.
order: 1
gallery:
  - src: /images/my-project-detail.jpg
    alt: Describe this second image.
    caption: An optional caption.
---

Write about the work here. Remove the gallery section if you only need a cover.
```

Cover and gallery paths automatically work on GitHub Pages. Add images through those fields rather than raw root-relative image links in the Markdown body. Lower `order` numbers appear first within each group.

Another useful prompt:

> Add a project called “Walks” to the right-hand group. Use the photos I put in public/images/walks. Ask me for the description and image descriptions; don't invent facts about my work. Keep the existing layout. Run the checks when you're done.

**Only publish content you want to make public.** Files in a public repository can be downloaded, including old versions. Don't add private drafts, other people's work without permission, or API keys. This is a personal portfolio, not the Echoes submission system. Removing a file later does not erase its Git history.

## 3. Publish

### GitHub Pages — the workshop route

1. In **your repository**, open **Settings → Pages → Source → GitHub Actions**.
2. Save and push your changes. Check `git remote -v` first: it should point to **your** repository, not this template.

```sh
git add src public
git commit -m "Add my work"
git push
```

3. Open **Actions → Publish website**. If there isn't a run yet, choose **Run workflow** on `main`. Wait for it to finish, then open the address shown in **Settings → Pages**.

The workflow handles your repository's address automatically. It usually looks like `https://YOUR-NAME.github.io/my-portfolio/`. No custom domain is needed. If the build fails, open the red step in Actions; missing image paths are a common cause.

### Cloudflare Pages — optional

Create a **Pages** project, connect your copy of this repository, and set:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `NODE_VERSION` = `22` |

No Astro server adapter is needed. Branch preview deployments work at their own Cloudflare addresses. For a custom domain, add it in the Pages project's **Custom domains** settings. Optionally set `SITE_URL` to the full public URL (for example `https://portfolio.example.com`) so canonical links use it; this also applies to branch previews when set there. Do not use the GitHub repository subpath on Cloudflare.

For local production checks, run `npm run check`, then `npm run build`, `npm test`, and `npm run preview`.

The code is MIT-licensed. The fictional sample text and original vector images are CC0; see [CREDITS.md](CREDITS.md). Replace or reuse them. The layout is inspired by [Cargo G937](https://cargo.site/templates/preview/2659118); no Cargo source code, fonts or artwork are included.
