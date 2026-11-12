# Project instructions

## Git workflow

Commit and push all changes directly to the `main` branch automatically. Do not create feature branches or pull requests unless explicitly asked.

## Indexing

This site must stay no-indexed. `vercel.json` sends `X-Robots-Tag: noindex, nofollow` on every route and `robots.txt` disallows all crawlers. Every HTML page must also include `<meta name="robots" content="noindex, nofollow">` in its `<head>`. Do not remove any of these unless explicitly asked.
