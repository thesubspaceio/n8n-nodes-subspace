# Workflow templates

Ready-to-import n8n workflows that demonstrate the Subspace node. Import any of these into your n8n instance, attach your `Subspace API` credential, and click **Test workflow**.

## How to import

1. In n8n, click **Add workflow** → top-right **⋯** menu → **Import from URL** or **Import from File**.
2. Paste the raw GitHub URL or upload the `.json` file.
3. Open each Subspace node and re-attach your `Subspace API` credential (the template ships with a `REPLACE_ME` placeholder).
4. Click **Test workflow**.

> **Don't have the node yet?** See the install instructions in the [main README](../README.md#install). Generate a free API key at [thesubspace.io/settings](https://www.thesubspace.io/settings).

## Templates

### 1. [Enrich a Single Domain](./01-enrich-single-domain.json) — *starter / smoke test*

Manual trigger → Subspace (Enrich by Domain).

**What it does:** Returns 88+ operational fields for `stripe.com`. Replace the domain with any company you want to inspect.

**Use this to:** verify your install + credential are working before building anything real.

---

### 2. [Filter Companies by Quality Score](./02-filter-by-quality-score.json) — *sales / lead-ops*

Manual trigger → sample domain list (5 companies) → Subspace enrich → IF `quality_score >= 60`.

**What it does:** Iterates a list of company domains, enriches each, then filters out anything below a quality-score threshold so you don't waste outbound effort on operationally-weak companies.

**Use this to:** clean a list before pushing to Clay, Apollo, Outreach, HubSpot, or your CRM. Swap the Code node at the start with your actual list source (Google Sheets, Apollo export, Clay webhook, etc.).

**Common threshold tweaks:**
- `ghost_job_rate <= 30` — skip ghost-heavy companies
- `hiring_actively == true` — only actively hiring
- `it_infrastructure_tier == 'Enterprise'` — target enterprise stack
- `cdn_enterprise == true` — only enterprise infrastructure

---

## Coming next

These four are scaffolded in our roadmap and arriving over the next few weeks:

- **HubSpot lifecycle sync** — new company → Subspace enrich → write scores back as contact properties.
- **Salesforce daily re-check** — daily watchlist scan, Slack alert on `hiring_verdict` change.
- **Clay → Subspace → CRM** — full enrichment loop with Clay as the list source.
- **Weekly distress digest** — top-10 declining accounts emailed to your team every Monday.

If there's a workflow you want, [open an issue](https://github.com/thesubspaceio/n8n-nodes-subspace/issues).

## Field reference

The full output schema (all 88+ fields) is documented at [thesubspace.io/docs/api](https://www.thesubspace.io/docs/api). Quick-reference for the fields used in these templates:

| Field | Type | Range / values |
|---|---|---|
| `quality_score` | number | 0–100 (overall operational health) |
| `hiring_verdict` | string | `Healthy`, `Slowing`, `Frozen`, `Distressed` |
| `hiring_actively` | boolean | true if active jobs detected |
| `ghost_job_rate` | number | 0–100 (% of jobs flagged as stale) |
| `it_infrastructure_tier` | string | `Enterprise`, `Mid-market`, `SMB`, `Hobbyist` |
| `cdn_enterprise` | boolean | enterprise CDN detected (Cloudflare Enterprise, Akamai, Fastly) |
| `has_enterprise_sso` | boolean | Okta or Azure AD SSO detected |

## Submitting your own

Built something useful with the node? PRs welcome — drop your `.json` into this folder, add a section to this README, and open a PR.
