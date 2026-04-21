# n8n-nodes-subspace

Community n8n node for [Subspace](https://www.thesubspace.io) — operational company intelligence from DNS, HTTP, and ATS forensics. One API call returns 88+ verified facts per company domain with zero LinkedIn dependency.

## What you get

For any company domain, Subspace returns fields including:

- **Operating status** — active, inactive, acquired, hiring paused
- **Hiring signals** — ghost job rate, fresh jobs, total jobs, ATS provider, hiring verdict
- **8 cost-center scores** (0–100) — IT infrastructure, engineering & product, sales & marketing, HR & hiring, legal & compliance, finance & RevOps, telecom & remote, corporate development
- **Enterprise stack booleans** — enterprise CDN, WAF, enterprise SSO (Okta/Azure), DMARC enforcement, compliance program (SOC 2 / ISO 27001), enterprise UC (Teams / Zoom Phone), ad spend detected
- **Revenue & M&A signals** — billing model, recent funding, possible acquisition, SEC filer status
- **Overall health** — `quality_score` 0–100, `hiring_verdict`

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

**Output (excerpt)**
```json
{
  "domain": "stripe.com",
  "company_name": "Stripe",
  "operating_status": "active",
  "ats_provider": "greenhouse",
  "company_size": "enterprise",
  "hiring_actively": true,
  "total_jobs": 285,
  "quality_score": 82,
  "hiring_verdict": "Healthy",
  "it_infrastructure_score": 94,
  "it_infrastructure_tier": "Enterprise",
  "engineering_product_score": 78,
  "hr_hiring_score": 65,
  "cdn_enterprise": true,
  "waf_active": true,
  "dmarc_enforcing": true,
  "has_enterprise_sso": true,
  "is_spending_on_ads": true,
  "has_compliance_program": true,
  "billing_model": "saas_payments",
  "possible_acquisition": false,
  "recent_funding": true
}
```

See the full response schema at [thesubspace.io/docs/api](https://www.thesubspace.io/docs/api).

## Example workflows

- **Enrich Clay exports** — filter lead lists by `quality_score >= 60` before pushing to outbound
- **HubSpot lifecycle sync** — trigger on new company, enrich with Subspace, write scores to contact properties
- **Apollo + Subspace** — complement firmographic enrichment with operational signals; skip companies with `ghost_job_rate > 60`
- **Watchlist distress alerts** — daily re-check of CRM accounts, Slack alert on `hiring_verdict` change

Published templates coming to [n8n.io/workflows](https://n8n.io/workflows) — search "Subspace".

## Rate limits

60 requests / minute during beta. Contact [dev@thesubspace.io](mailto:dev@thesubspace.io) if you need higher throughput.

## Support

- Issues: [github.com/thesubspaceio/n8n-nodes-subspace/issues](https://github.com/thesubspaceio/n8n-nodes-subspace/issues)
- API docs: [thesubspace.io/docs/api](https://www.thesubspace.io/docs/api)
- Clay integration: [thesubspace.io/integrations/clay](https://www.thesubspace.io/integrations/clay)

## License

[MIT](./LICENSE.md)
