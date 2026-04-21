# Handoff — n8n-nodes-subspace v0.1.0

**Status:** Local v0.1.0 built, linted, committed. **NOT pushed, NOT published.**

## What shipped this session

- Scaffolded from `n8n-io/n8n-nodes-starter`
- Single `Company` resource + `Enrich by Domain` operation → `GET /api/v1/enrich?domain=<domain>`
- `SubspaceApi` credential using `x-api-key` header; credential-test hits the enrich endpoint with `stripe.com`
- Light + dark SVG icons (terminal amber, matches site brand)
- README + CHANGELOG + LICENSE (updated to Subspace copyright)
- Zero runtime deps, MIT, Node 22+, TypeScript declarative style
- GitHub Actions workflows (`ci.yml` + `publish.yml`) kept from starter — already set up for OIDC provenance (May 1 2026 requirement)
- `npx n8n-node lint` ✓, `npx n8n-node build` ✓

## BEFORE PUSH — assumptions to confirm/replace

These fields in the repo contain my best-guess placeholders. Verify each before pushing.

| File | Placeholder | Confirm/Replace |
|---|---|---|
| `package.json` | `"email": "hello@thesubspace.io"` | Real support email |
| `package.json` | `"url": "git+https://github.com/subspace-io/n8n-nodes-subspace.git"` | Actual GitHub org/user + repo name |
| `package.json` | `"bugs.url": "...subspace-io/n8n-nodes-subspace/issues"` | Same as repo |
| `nodes/Subspace/Subspace.node.json` | All `subspace-io/n8n-nodes-subspace` refs | Same as repo |
| `credentials/SubspaceApi.credentials.ts` | `documentationUrl: 'https://www.thesubspace.io/docs/api'` | Confirm this URL exists and is public |
| `README.md` | Repo URL, docs URL, support email | Match confirmed values |

`grep -r "subspace-io" .` finds all references if org differs.

## Next steps — in order

### 1. Create GitHub repo and push (5 min)

```bash
cd /Users/vivek/Antigravity/Code/n8n-nodes-subspace
gh repo create <org>/n8n-nodes-subspace --public --source=. --remote=origin --description="n8n community node for Subspace — operational company intelligence"
git push -u origin main
```

### 2. Configure npm Trusted Publisher — OIDC (10 min, one-time)

On npmjs.com (logged in as package owner):

1. Publish once manually to claim the package name: `npm publish --access public` (skip if you want the workflow to do the very first publish)
2. Package settings → **Publish access** → **Trusted Publishers** → **Add a publisher**:
   - Publisher: **GitHub Actions**
   - Repository owner: `<org>`
   - Repository name: `n8n-nodes-subspace`
   - Workflow filename: `publish.yml`
   - Environment: (blank)
3. Do NOT set `NPM_TOKEN` secret — OIDC handles auth

Full notes are in the comment block at the top of `.github/workflows/publish.yml`.

### 3. First release via tag push (2 min)

```bash
npm run release
# Interactively bumps version, commits, tags, pushes
# GitHub Actions sees the tag → runs publish.yml → publishes to npm with provenance
```

Watch the Actions tab; first publish typically 2-3 min.

### 4. Verify on npm

- `npm view n8n-nodes-subspace` — confirm metadata
- Look for the **Provenance** badge on the npmjs.com package page
- Self-host an n8n instance and try **Settings → Community Nodes → Install `n8n-nodes-subspace`**

### 5. Apply to PartnerStack for n8n affiliate program (5 min)

- [https://n8n.io/affiliates/](https://n8n.io/affiliates/) → apply via PartnerStack
- Get your unique affiliate ID once approved
- Terms: **30% commission × 12 months** on Cloud Starter (€24/mo) and Pro (€60/mo) referrals
- €100 min payout, PayPal, monthly
- **No paid ads allowed** — organic only

### 6. Submit to n8n Creator Portal for verification

- Sign up at the Creator Portal (link in submit-community-nodes docs)
- Submit `n8n-nodes-subspace` for verification
- Wait on review (community reports: weeks, not days)
- Once verified: node becomes installable on n8n Cloud via one-click UI = majority audience unlock

### 7. Ship templates (Week 2 — separate task)

5 templates, each tagged `?ref=<affiliateId>&utm_source=affiliate`:
1. Apollo list → Subspace filter → CRM push
2. HubSpot new company → Subspace enrich → property sync
3. Weekly Slack digest: top-10 distressed watchlist accounts
4. Salesforce trigger → daily Subspace re-check → verdict-change alert
5. Clay export → Subspace quality filter → skip ghost-heavy companies

Submit via creators.n8n.io/hub.

## Blindspots — audited + fix

**1. Docs URL `/docs/api` may not be live.**
- Audit: real — I referenced it in credential `documentationUrl` and README, but haven't confirmed the route exists publicly
- Fix: open `https://www.thesubspace.io/docs/api` in browser. If 404, either create the page or change the credential `documentationUrl` to `https://www.thesubspace.io` before pushing

**2. Credential test calls real API.**
- Audit: real — every `Test` click in n8n makes a live enrich request to your production API
- Fix: ensure the `/api/v1/enrich?domain=stripe.com` endpoint is reliable and rate-limit-tolerant for credential-test traffic. Verification reviewer will click Test.

**3. Single operation may look thin.**
- Audit: n8n docs don't require a minimum operation count, but reviewers may feel a single-op node is "trivial." Risk: low, uncertain.
- Fix: have the v0.2 second operation (`Check Operating Status`) ready to ship if reviewer requests. Can add `/api/v1/enrich` subset-extractor as second operation without new backend work.

**4. `usableAsTool: true` exposes the node to n8n AI agents.**
- Audit: intentional — makes Subspace discoverable by LangChain-style AI agents inside n8n
- Fix: none needed; this is a plus. Worth testing post-publish that AI-agent workflows can invoke it cleanly.

**5. First npm publish race: need to claim the `n8n-nodes-subspace` package name.**
- Audit: real — if someone else publishes this name first, you lose it
- Fix: publish v0.1.0 to npm EARLIER rather than later once repo is ready. Consider a defensive `npm publish --access public` even before the full OIDC setup to squat the name.

## Deferred (out of v0.1.0 scope)

- Second operation (`Check Operating Status` or similar)
- Trigger node (polling or webhook for signal-change events)
- Batch enrich (multiple domains in one execution)
- Error-retry + rate-limit backoff helper

## Files to reference

- `package.json` — metadata + n8n manifest paths
- `credentials/SubspaceApi.credentials.ts` — API key credential
- `nodes/Subspace/Subspace.node.ts` — node shell
- `nodes/Subspace/resources/company/index.ts` — operation + parameters
- `icons/subspace.svg` + `subspace.dark.svg` — brand icons
- `.github/workflows/publish.yml` — OIDC publish workflow (has setup instructions in header comment)

## Session summary

1 commit on `main`, working tree clean, dist/ gitignored. Ready to push once placeholders confirmed.
