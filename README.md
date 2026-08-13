# portfolio

Personal site: Express serves static pages from `public/`, with the **lab** site at `/` and `public/lab/` as the main surface. See [DEV_NOTES.md](DEV_NOTES.md) for layout, routes, and legacy vs lab paths.

## run locally

```bash
npm install
# create `.env` with EMAIL_USER, EMAIL_PASS (required by server.js); optional YOUTUBE_API_KEY for guitar playlist API
npm start
```

Default port is `5050` unless `PORT` is set.

## documentation (markdown in this repo)

| Doc | What it’s for |
| --- | --- |
| [DEV_NOTES.md](DEV_NOTES.md) | Repo layout, lab vs legacy, redirects |
| [STYLEGUIDE.md](STYLEGUIDE.md) | Voice, lab nav, blog/inspo conventions |
| [ARCHIVE.md](ARCHIVE.md) | Removed lab copy, restore snippets, legacy tree note |
| [IDEAS.md](IDEAS.md) | Backlog ideas not implemented yet |
| [FILM_SITE_PLAN.md](FILM_SITE_PLAN.md) | Plan for turning the site into a film portfolio (not started) |
| [design-refs/film-site/INSPO.md](design-refs/film-site/INSPO.md) | Web-design references for the film portfolio |
| [README.md](README.md) | This file |
