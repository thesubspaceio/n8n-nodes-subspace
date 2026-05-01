# n8n-nodes-subspace

Community n8n node for [Subspace](https://www.thesubspace.io) — operational company intelligence from DNS, HTTP, and ATS forensics. One API call returns 88+ verified facts per company domain with zero LinkedIn dependency.

## What you get

For any company domain, Subspace returns ~90 operational fields including:

- **Operating status** — `active`, `slow`, `inactive` plus DNS + ATS confidence
- **Hiring signals** — `total_jobs`, `fresh_jobs_30d`, `hiring_actively`, `ghost_job_rate`, `ats_provider`
- **Infrastructure** — `cdn_enterprise`, `waf_active`, `ttfb_fast`, `hsts_active`, `security_posture_mature`
- **Email security** — `dmarc_enforcing`, `email_provider_enterprise`, `email_security_gateway`
- **Engineering** — `shipping_actively`, `has_changelog`, `has_status_page`, `npm_high_velocity`, `app_store_presence`
- **Sales & marketing** — `is_spending_on_ads`, `has_tag_manager`, `international_presence`, `hreflang_markets`
- **Legal & compliance** — `has_soc2`, `has_hipaa`, `has_compliance_program`, `has_trust_center`, `h1b_filer`, `warn_notices`
- **Finance** — `billing_model`, `has_pricing_page`, `has_banking_api`
- **SSO & telecom** — `has_enterprise_sso`, `has_enterprise_uc`, `has_conferencing`
- **M&A & funding** — `possible_acquisition`, `recent_funding`, `sec_public_filer`, `gov_contractor`

Every field is derived from public, deterministic sources: DNS records, HTTP headers, SSL certificate transparency, government filings (SEC, H-1B, WARN, patents), Common Crawl, and ATS API responses. No LinkedIn scraping, no AI hallucination.

## Install

### On n8n Cloud (verified install)

> Pending n8n Creator Portal verification. Once verified, install directly from the Nodes panel in your n8n Cloud workflow editor — search "Subspace" and click install.

### On self-hosted n8n (manual install)

1. Go to **Settings → Community Nodes** in your n8n instance
2. Enter the package name: `n8n-nodes-subspace`
3. Click install

Or via npm:

```bash
npm install n8n-nodes-subspace
```

## Get an API key

Subspace is in **open beta — all features are free**. Generate an API key at [thesubspace.io/settings](https://www.thesubspace.io/settings). No credit card required.

## Credentials

Configure a `Subspace API` credential in n8n with your API key. The key is sent as the `x-api-key` header on every request.

The credential test hits `GET /api/v1/enrich?domain=stripe.com` to validate the key is live.

## Actions

### Company → Enrich by Domain

Returns 88+ operational signals for a company domain.

**Input**
- `Domain` (string, required) — apex domain (e.g. `stripe.com`). Avoid `www.` or subdomains.

**Output (excerpt — every field shown is verified against the live response)**
```json
{
  "domain": "stripe.com",
  "company_name": "Stripe",
  "operating_status": "active",
  "ats_provider": "greenhouse",
  "company_size": "enterprise",
  "company_type": "saas_product",
  "total_jobs": 285,
  "fresh_jobs_30d": 47,
  "hiring_actively": true,
  "confidence": "high",
  "quality_score": 78,
  "hiring_verdict": "Healthy",
  "it_infrastructure_score": 88,
  "it_infrastructure_tier": "Enterprise",
  "engineering_product_score": 72,
  "engineering_product_tier": "Growth",
  "hr_hiring_score": 65,
  "hr_hiring_tier": "Growth",
  "cdn_enterprise": true,
  "waf_active": true,
  "dmarc_enforcing": true,
  "has_enterprise_sso": true,
  "has_compliance_program": true,
  "is_spending_on_ads": true,
  "shipping_actively": true,
  "billing_model": "saas_payments",
  "possible_acquisition": false,
  "recent_funding": true,
  "saas_stack_premium": true,
  "data_freshness": "cached",
  "credits_consumed": 2,
  "billed": true
}
```

See the full response schema at [thesubspace.io/docs/api](https://www.thesubspace.io/docs/api).

## Example workflows

Ready-to-import templates live in [`workflows/`](./workflows/):

- **[Enrich a Single Domain](./workflows/01-enrich-single-domain.json)** — starter / smoke test. Use this first to verify install + credential.
- **[Filter Active-Hiring Companies for Outbound](./workflows/02-filter-active-hiring-companies.json)** — iterate a domain list, enrich each, filter by `hiring_actively == true AND total_jobs >= 5`. Drop in Clay / Apollo / Sheets list sources.

More on the way:
- **HubSpot lifecycle sync** — trigger on new company, enrich, write scores back to contact properties
- **Apollo + Subspace** — firmographic + operational filter; skip companies with `ghost_job_rate > 60`
- **Watchlist distress alerts** — daily re-check of CRM accounts, Slack on `operating_status` change

Templates also published on [n8n.io/workflows](https://n8n.io/workflows) — search "Subspace".

## Rate limits

60 requests / minute during beta. Contact [dev@thesubspace.io](mailto:dev@thesubspace.io) if you need higher throughput.

## Support

- Issues: [github.com/thesubspaceio/n8n-nodes-subspace/issues](https://github.com/thesubspaceio/n8n-nodes-subspace/issues)
- API docs: [thesubspace.io/docs/api](https://www.thesubspace.io/docs/api)
- Clay integration: [thesubspace.io/integrations/clay](https://www.thesubspace.io/integrations/clay)

## License

[MIT](./LICENSE.md)
