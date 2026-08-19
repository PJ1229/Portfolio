# portfolio

Personal site: Express serves static pages from `public/`. The **film/projects portfolio** (`public/film/`) is the main surface at `/`; the **lab** site is still reachable at `/lab`, and the v1 site is archived at `/legacy/`. See [DEV_NOTES.md](DEV_NOTES.md) for layout, routes, and legacy vs lab paths.

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
| [FILM_SITE_PLAN.md](FILM_SITE_PLAN.md) | Plan for the film portfolio (built; now restructured to a Projects model) |
| [design-refs/film-site/INSPO.md](design-refs/film-site/INSPO.md) | Web-design references for the film portfolio |
| [README.md](README.md) | This file |
