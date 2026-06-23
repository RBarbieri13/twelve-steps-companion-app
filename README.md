# Twelve Steps Companion

A gentle, private companion app for working the Twelve Steps of recovery — one day at a time.

**Live site:** https://rbarbieri13.github.io/twelve-steps-companion-app/

## Features

- **Recovery counter** — set your start date and see your time in recovery (total days plus a years / months / days breakdown).
- **The Twelve Steps** — read each step, work through reflection prompts, and mark your progress with a visual progress bar.
- **Private journal** — write free-form entries, optionally tied to a specific step.
- **Daily reflection** — a calming thought that changes each day.
- **Serenity Prayer** — always one tap away on the home screen.

## Privacy

All of your data — your start date, step progress, and journal entries — is stored **only in your browser** using `localStorage`. Nothing is uploaded, and there is no account or server. Clearing your browser data will remove it.

## Tech

A zero-build static site: plain HTML, CSS, and ES-module JavaScript. No frameworks, no build step, no dependencies. This keeps it fast, durable, and trivial to host.

```
index.html      App shell
styles.css      Styling (light + dark, follows system preference)
app.js          UI logic and localStorage persistence
data.js         The Twelve Steps content and daily reflections
```

## Running locally

Because it uses ES modules, open it through a local web server (not `file://`):

```bash
# Python
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`, which publishes the site to GitHub Pages. The first successful run enables Pages automatically (source: **GitHub Actions**).

## A note

This app is a personal companion tool and is **not** a substitute for a sponsor, a home group, professional treatment, or medical care. If you are in crisis, please reach out to a trusted person or a local helpline.
