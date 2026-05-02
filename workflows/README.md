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

**What it does:** Returns operational signals for `stripe.com`. Replace the domain with any company you want to inspect.

**Use this to:** verify your install + credential are working before building anything real.

---

### 2. [Filter Active-Hiring Companies for Outbound](./02-filter-active-hiring-companies.json) — *sales / lead-ops*

Manual trigger → sample domain list (5 companies) → Subspace enrich → IF (`hiring_actively == true` AND `total_jobs >= 5`).

**What it does:** Iterates a list of company domains, enriches each, then filters out companies that aren't actively hiring or have fewer than 5 open roles. Saves outbound effort on operationally-quiet companies.

**Use this to:** clean a list before pushing to Clay, Apollo, Outreach, HubSpot, or your CRM. Swap the Code node at the start with your actual list source (Google Sheets, Apollo export, Clay webhook, etc.).

**Common filter swaps (all real fields):**
- `quality_score >= 60` — composite quality threshold (avg of cost-center scores)
- `hiring_verdict == 'Healthy'` — categorical verdict from real signals
- `it_infrastructure_tier == 'Enterprise'` — target enterprise infrastructure
- `engineering_product_score >= 70` — engineering-strong companies
- `operating_status == 'active'` — DNS resolves + signals present
- `confidence == 'high'` — high-evidence enrichment only
- `has_compliance_program == true` — SOC2 / HIPAA / trust center detected
- `has_enterprise_sso == true` — Okta / Azure AD detected
- `cdn_enterprise == true` — enterprise infrastructure
- `recent_funding == true` — funding signal in recent filings
- `is_spending_on_ads == true` — active demand-gen
- Combine with AND/OR by adding conditions to the IF node.

---

### 3. [Paginate All Job Listings for a Domain](./03-paginate-all-jobs.json) — *job feed / bulk export*

Manual trigger → Set domain + page size → Code node that walks every page via `jobs_next_offset` until `jobs_has_more` is false. Emits one item per job (title, location, url, company_domain).

**What it does:** Returns every job listing Subspace has indexed for a domain by following the pagination cursor. Demonstrates the new `jobs_limit` / `jobs_offset` / `jobs_has_more` / `jobs_next_offset` contract on `/api/v1/enrich`.

**Use this to:** build a one-time bulk export for a single company — push to Google Sheets, write to Postgres, dump to S3, feed into Clay's job-row table. Swap the trailing emit step with whatever destination you need.

> **Why a Code node and not the Subspace verified node?** The verified node currently routes only `domain` to `/api/v1/enrich`. Pagination params (`jobs_limit`, `jobs_offset`, `jobs_seen_after`) are part of the API today but ship to the verified node in v2 (in review with the n8n hub). Until then, the Code node hits the same endpoint with the same key — same data, just a different transport. The pattern collapses to a single node-config change once v2 lands.

**Auth:** set `SUBSPACE_API_KEY` in your n8n environment (Settings → Environment variables) before running, or replace the `$env.SUBSPACE_API_KEY` line in the Code node with your literal key.

---

### 4. [Incremental Job Feed (recurring poll)](./04-incremental-job-sync.json) — *real-time hiring intel*

Schedule trigger (hourly) → Set domain → Code node that uses `jobs_seen_after` to fetch only jobs added since the last successful run. Persists the high-water mark in n8n workflow static data.

**What it does:** Polls Subspace on a recurring interval and emits only newly-observed jobs. The first run pulls up to 500 most recent listings; subsequent runs pass `jobs_seen_after=<last_sync_time>` so you never re-process the same listing.

**Use this to:** drive a Slack alert on every new role, push new jobs into a CRM as soon as they're detected, build a real-time competitive hiring monitor for a watchlist of companies. To watch multiple companies, replace the Set node with a Code node that emits one item per domain — the rest of the workflow runs once per item automatically.

**State:** `$getWorkflowStaticData('global').lastSeenByDomain[domain]` holds the high-water timestamp. Survives workflow restarts. To reset, clear that key in a one-off Code node run.

**Auth:** same as template 3 (set `SUBSPACE_API_KEY` in n8n env or hard-code).

---

## Coming next

These four are scaffolded in our roadmap:

- **HubSpot lifecycle sync** — new company → Subspace enrich → write fields back as contact properties.
- **Salesforce daily re-check** — daily watchlist scan, Slack alert on `operating_status` change.
- **Clay → Subspace → CRM** — full enrichment loop with Clay as the list source.
- **Weekly digest** — summarize your watchlist's top operational changes every Monday.

If there's a workflow you want, [open an issue](https://github.com/thesubspaceio/n8n-nodes-subspace/issues).

## Field reference

The full output schema is documented at [thesubspace.io/docs/api](https://www.thesubspace.io/docs/api). Below are the fields used in these templates — all verified against the live `/api/v1/enrich` response shape.

| Field | Type | Values |
|---|---|---|
| `domain` | string | apex domain |
| `company_name` | string \| null | inferred company name |
| `operating_status` | string | `active`, `slow`, `inactive` |
| `ats_provider` | string \| null | `greenhouse`, `workday`, `lever`, `ashby`, etc. |
| `total_jobs` | number | open roles count |
| `fresh_jobs_30d` | number | roles posted in last 30 days |
| `hiring_actively` | boolean | `true` if active jobs detected |
| `confidence` | string | `high`, `moderate`, `low` |
| `quality_score` | number \| null | 0–100 composite. Average of available cost-center scores. Null when no cost centers populated. |
| `hiring_verdict` | string \| null | `Healthy`, `Slowing`, `Distressed`, `Frozen`, `Quiet`, or null on low-confidence data |
| `it_infrastructure_score` | number \| null | 0–100 weighted-avg of IT-infra signals |
| `it_infrastructure_tier` | string \| null | `Enterprise` (≥75), `Growth` (≥50), `Startup` (≥25), `Inactive` (<25) |
| `engineering_product_score` / `_tier` | number / string \| null | same shape — engineering & product pillar |
| `sales_marketing_score` / `_tier` | number / string \| null | same shape — sales & marketing pillar |
| `hr_hiring_score` / `_tier` | number / string \| null | same shape — HR & hiring pillar |
| `legal_compliance_score` / `_tier` | number / string \| null | same shape — legal & compliance pillar |
| `finance_revops_score` / `_tier` | number / string \| null | same shape — finance & RevOps pillar |
| `telecom_remote_score` / `_tier` | number / string \| null | same shape — telecom & remote pillar |
| `corporate_dev_score` / `_tier` | number / string \| null | same shape — corporate development pillar |
| `cdn_enterprise` | boolean | enterprise CDN detected (Cloudflare Enterprise, Akamai, Fastly) |
| `waf_active` | boolean | web application firewall detected |
| `dmarc_enforcing` | boolean | DMARC policy enforced |
| `has_enterprise_sso` | boolean | Okta or Azure AD SSO detected |
| `has_compliance_program` | boolean | SOC2 / HIPAA / trust center detected |
| `is_spending_on_ads` | boolean | active ad spend signals (Google / Meta tags + tracking) |
| `recent_funding` | boolean | funding signal in recent SEC / public filings |
| `possible_acquisition` | boolean | M&A signal detected |
| `billing_model` | string | `enterprise_billing`, `saas_payments`, `checkout_detected`, `proprietary`, `none_detected` |

## Submitting your own

Built something useful with the node? PRs welcome — drop your `.json` into this folder, add a section to this README, and open a PR.
