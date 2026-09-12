# Working on this starter

This is a personal portfolio for a nontechnical artist. Keep it small: static Astro, Markdown, CSS and a little TypeScript. No database, API key, paid service or framework migration unless asked.

- Read README.md first. Most requests belong in `src/site.ts`, `src/content/` or `public/images/`.
- Ask for missing facts about the author's work. Never invent exhibitions, clients, awards or biographical claims.
- Keep `left` and `right` group IDs stable. Labels can change.
- Keep all local URLs compatible with `import.meta.env.BASE_URL`, using `localPath`. Cover/gallery paths are handled for the author.
- Keep the desktop independent columns and opposing panels; mobile is single-column. Preserve normal links without JavaScript, keyboard access, history and reduced motion.
- Do not put secrets, private drafts or the workshop key into this public repository.
- Run `npm run check`, `npm run build`, and `npm test` before handing off. When changing interactions, also run the browser tests described in tests/README.md.
- Before pushing, verify `git remote -v` points to the participant's own repository. Do not publish or change domains unless asked.
