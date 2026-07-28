---
name: cloudflare-pages-deploy
description: Publish this personal website to the existing Cloudflare Pages project by safely mirroring approved local site files into GCSimba/personal-website main, then verifying the automatic production deployment at wennancao.com. Use when the user asks to push, deploy, publish, or verify this project's Cloudflare Pages site.
---

# Cloudflare Pages Deploy

Use the existing deployment chain:

`local project → GitHub main → Cloudflare Pages personal-website → wennancao.com`

Do not create a new Pages project, change domain settings, or place credentials in the project. The site already has Pages Git integration and custom domains configured.

## Preflight

1. Run the relevant local validations. For changes to reading cards, run the `weread-cards` validation, build, and public-site scan first.
2. Confirm the target is `GCSimba/personal-website`, branch `main`, and production URL `https://wennancao.com`.
3. Inspect the remote `main` tip before publishing. Do not overwrite a newer remote commit or use force-push.

## Publish

Run the deterministic publisher from the project root:

```powershell
powershell -ExecutionPolicy Bypass -File .codex/skills/cloudflare-pages-deploy/scripts/deploy.ps1
```

The script clones the current remote branch to a temporary directory, mirrors the project files, checks the staged diff, commits only when there are changes, and pushes normally to `main`. It reuses the latest remote commit author if Git identity is not configured locally. It excludes `.git`, `node_modules`, and Python cache directories; do not store credentials in the project.

Use `-NoPush` to inspect the generated change set without committing or pushing. Use `-Message` only for a concise deployment commit message.

## Verify production

1. In the signed-in Cloudflare dashboard, open **Workers & Pages → personal-website** and wait for the pushed commit to show a successful production deployment.
2. Request `https://wennancao.com/` and any changed page with a cache-busting query string. Verify the expected content is present.
3. Report the commit SHA, Pages deployment URL, production URL, and any remaining issue.

Stop before publishing if GitHub authentication fails, the remote branch advances during the run, Cloudflare reports a failed deployment, or the production URL does not serve the expected version.
