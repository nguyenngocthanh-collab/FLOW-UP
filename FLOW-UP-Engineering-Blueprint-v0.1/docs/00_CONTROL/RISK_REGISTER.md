# Risk Register

| ID | Risk | Probability | Impact | Mitigation | Owner |
|---|---|---:|---:|---|---|
| R-001 | MVP scope exceeds four-day capacity | High | High | Freeze MVP scope; defer non-core features | Product |
| R-002 | Goal Tree proves confusing | Medium | High | List default; test Tree; keep data view-independent | Product/UX |
| R-003 | Cross-module contracts diverge | High | High | Contract Registry + change-impact review | Architecture |
| R-004 | Supabase free project pauses | Medium | Medium | Activity monitoring; local fallback; export/backup process | Operations |
| R-005 | Free-tier quota changes | Medium | Medium | Keep portable schema and documented fallback | Operations |
| R-006 | RLS misconfiguration exposes user data | Medium | Critical | Deny-by-default policies; tests for cross-user access | Backend/QA |
| R-007 | AI invents requirements or changes contracts | High | High | Require source references and approval gates | AI Orchestrator |
| R-008 | Demo depends on network or live data | Medium | High | Seeded demo project and rehearsal/fallback | Demo owner |
| R-009 | Tree hierarchy cannot represent cross-links | Medium | Medium | Separate dependency relationships from parent-child hierarchy | Domain |
