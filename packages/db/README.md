# `@tba/db` — Postgres schema and Drizzle wiring

Source of truth for the TBA Academy data model. Spec §2.

## Status

Schema-as-code only. The schema is committed and TS-checked, but no live
Postgres connection has been provisioned yet. To go live:

```bash
# 1. Provision a free Neon Postgres (https://neon.tech)
#    Region: eu-west-2 (London) — matches the Vercel project region.
#    Save the connection string with ?sslmode=require.

# 2. Add to Vercel envs (Production + Preview):
#    DATABASE_URL = postgres://...?sslmode=require

# 3. Local dev: paste the same DATABASE_URL into .env.local (gitignored).

# 4. From repo root:
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit

# 5. Generate the first migration from this schema:
pnpm drizzle-kit generate --schema packages/db/schema.ts --out packages/db/migrations

# 6. Apply it to Neon:
pnpm drizzle-kit migrate --schema packages/db/schema.ts --out packages/db/migrations
```

## Encryption-at-rest

`api_keys.encryptedKey` holds **libsodium sealed-box** ciphertext. The
keypair is stored in Vercel encrypted env as:

- `TBA_SECRETS_PUB` — public key (base64), can ship to the client if needed
- `TBA_SECRETS_PRIV` — private key (base64), **server runtimes only**

Never log decrypted API keys. Decryption only happens inside Node API
routes (not Edge runtimes that emit structured logs).

## Soft delete

`users.deletedAt` is the soft-delete tombstone. A daily cron purges
records older than 30 days, taking child tables with them via the
`onDelete: cascade` cascades.

## Outbox

Every write that should emit a domain event (`attempt_submitted`,
`marker_run`, `card_reviewed`, ...) inserts a row into `outbox` in the
same DB transaction as the business write. A worker reads pending rows
(`dispatchedAt IS NULL`), POSTs them to PostHog + queues email reminders
via Resend, and stamps `dispatchedAt`. Retries are bounded; permanent
failures go to a dead-letter view.
