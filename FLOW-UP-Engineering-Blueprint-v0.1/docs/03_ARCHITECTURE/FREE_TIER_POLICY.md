# Free-Tier Policy for MVP

**Policy:** No mandatory paid service, paid domain, paid AI API, or paid build service may be required to run or demo MVP 0.1.

| Need | Selected option | Free-tier caveat |
|---|---|---|
| Source control | GitHub Free | Actions quota and artifact/storage limits |
| Static hosting | Cloudflare Pages | Build/file limits; custom domain not included |
| Database/Auth | Supabase Free | 500 MB DB, 5 GB egress, 1 GB storage; project may pause after 7 days of low activity |
| Server-side functions | Supabase Edge Functions | 500k invocations quota; CPU and wall-clock limits |
| Mobile build later | Expo Free or local build | Monthly build quota and low-priority queue |
| AI coding | Existing free chat quotas / OpenCode free models / local model | Quotas, model availability and privacy vary |
| UI libraries | Open-source packages | License and maintenance still need review |

## Cost safety
- Do not enter payment details unless owner explicitly approves.
- Disable optional paid add-ons.
- Do not enable usage-based billing.
- Set provider alerts where available.
- Do not store secrets in Git.
- Keep local development and database export/migration paths.
- Review current provider pricing before public launch.

## Important distinction
A free tier is suitable for a student MVP/demo, not a guaranteed commercial production SLA. Supabase free projects can pause after a week of low activity. Vercel Hobby is not selected because its terms restrict use to personal/non-commercial purposes.
