# Audit feature

`src/features/audit` owns the private audit list for authorized financial changes.

- SQL/RLS remains the authorization boundary; frontend filters never grant access.
- The service reads `financial_audit_events` directly under RLS and never requests totals.
- UI states avoid SQL, RLS, IDs, inaccessible item details, and permission-denied detail.
- Snapshot helpers keep only minimal presentation fields: label, amount, date, status, and summary key.
- Actor labels are safe fallbacks: `Voce`, `Pessoa parceira`, or `Autoria indisponivel`.
- Goal mutations emit a local refresh signal so visible audit data is revalidated after saved changes.
