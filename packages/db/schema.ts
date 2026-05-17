/**
 * Drizzle ORM schema for TimBoi's Academy.
 *
 * Spec §2 (Master Build Contract, 2026-05-18): full data model. This file
 * is the single source of truth; Drizzle Kit reads it to emit migrations
 * with `pnpm drizzle-kit generate`.
 *
 * Status: schema-as-code only. No live DB yet — Sprint 3 will provision
 * Neon Postgres, paste DATABASE_URL into Vercel env, and run the first
 * migration. See packages/db/README.md for the provisioning steps.
 *
 * Design notes:
 *  - All tables use `text` UUIDv7 IDs (sortable, multi-instance safe).
 *  - Foreign keys to `users.id` cascade on delete so account wipes are clean.
 *  - `deletedAt` columns implement 30-day soft delete per §3 (account purge).
 *  - JSON blobs (jsonb) are typed via Drizzle's `$type<T>()` so callers get
 *    end-to-end TS guarantees.
 *  - The `outbox` table is the domain-event source for the cron worker
 *    that fans events out to PostHog and email reminders.
 */

import {
  pgTable,
  text,
  timestamp,
  integer,
  bigint,
  boolean,
  jsonb,
  uniqueIndex,
  index,
  primaryKey,
  bytea,
  pgEnum,
} from 'drizzle-orm/pg-core';

// ─── Enums ───────────────────────────────────────────────────────────────────

export const oauthProviderEnum = pgEnum('oauth_provider', ['google', 'apple', 'microsoft']);
export const mfaFactorTypeEnum = pgEnum('mfa_factor_type', ['totp', 'webauthn']);
export const apiKeyProviderEnum = pgEnum('api_key_provider', ['deepseek', 'openai', 'anthropic', 'elevenlabs']);
export const paperSourceEnum = pgEnum('paper_source', ['q-pack', 'acca', 'kaplan']);
export const attemptModeEnum = pgEnum('attempt_mode', ['practice', 'mock', 'drill', 'diagnostic']);
export const documentKindEnum = pgEnum('document_kind', ['word', 'sheet', 'plan']);
export const exportKindEnum = pgEnum('export_kind', ['json', 'pdf', 'scorm', 'anki']);
export const leaderboardScopeEnum = pgEnum('leaderboard_scope', ['personal', 'sitting', 'topic']);

// ─── Identity & access ───────────────────────────────────────────────────────

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    hashedPassword: text('hashed_password'), // null when account is OAuth-only
    name: text('name'),
    handle: text('handle').notNull(),
    avatarUrl: text('avatar_url'),
    sitting: text('sitting'), // e.g. 'jun-2026'
    locale: text('locale').default('en-GB').notNull(),
    timezone: text('timezone').default('Europe/London').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    consent: jsonb('consent').$type<{ marketing: boolean; analytics: boolean; ts: string }>(),
    ageGatePassed: boolean('age_gate_passed').default(false).notNull(),
  },
  (t) => [
    uniqueIndex('users_email_uq').on(t.email),
    uniqueIndex('users_handle_uq').on(t.handle),
  ],
);

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    refreshTokenHash: text('refresh_token_hash').notNull(),
    ip: text('ip'),
    ua: text('ua'),
    issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (t) => [index('sessions_user_idx').on(t.userId)],
);

export const oauthAccounts = pgTable(
  'oauth_accounts',
  {
    provider: oauthProviderEnum('provider').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    linkedAt: timestamp('linked_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerId] }), index('oauth_user_idx').on(t.userId)],
);

export const mfaFactors = pgTable(
  'mfa_factors',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: mfaFactorTypeEnum('type').notNull(),
    /** TOTP secret or WebAuthn credential blob — encrypted at rest. */
    secret: text('secret').notNull(),
    verified: boolean('verified').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('mfa_user_idx').on(t.userId)],
);

export const apiKeys = pgTable(
  'api_keys',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    provider: apiKeyProviderEnum('provider').notNull(),
    /** libsodium sealed-box ciphertext; decrypt only in server runtimes. */
    encryptedKey: text('encrypted_key').notNull(),
    label: text('label'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (t) => [index('api_keys_user_idx').on(t.userId)],
);

// ─── Profile, progression ────────────────────────────────────────────────────

export const profiles = pgTable('profiles', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  targetMark: integer('target_mark'), // 0..100
  weakAreas: text('weak_areas').array().$type<string[]>(), // capability refs A1..E5
  strongAreas: text('strong_areas').array().$type<string[]>(),
  examEntryConfirmed: boolean('exam_entry_confirmed').default(false).notNull(),
  predictedBand: text('predicted_band'),
  predictedSigma: integer('predicted_sigma'),
});

// ─── Content (papers, topics, formulas, pitfalls) ────────────────────────────

export const papers = pgTable(
  'papers',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    sitting: text('sitting').notNull(), // 'sd-2025', 'mj-2024', etc.
    section: text('section').notNull(),  // 'A' | 'B'
    marks: integer('marks').notNull(),
    syllabusRefs: text('syllabus_refs').array().$type<string[]>(),
    source: paperSourceEnum('source').notNull(),
    pdfSha256: text('pdf_sha256'),
    ocrText: text('ocr_text'),
    modelAnswerText: text('model_answer_text'),
    examinerReportText: text('examiner_report_text'),
    topics: text('topics').array().$type<string[]>(),
    verifiedBy: text('verified_by'), // 'Q' | 'A' | 'S' | 'E' from existing schema
  },
  (t) => [uniqueIndex('papers_slug_uq').on(t.slug), index('papers_sitting_idx').on(t.sitting)],
);

export const topics = pgTable(
  'topics',
  {
    id: text('id').primaryKey(),
    code: text('code').notNull(),  // 'apv', 'npv', etc.
    name: text('name').notNull(),
    section: text('section'),
    syllabusRefs: text('syllabus_refs').array().$type<string[]>(),
    pitfallIds: text('pitfall_ids').array().$type<string[]>(),
    formulaIds: text('formula_ids').array().$type<string[]>(),
  },
  (t) => [uniqueIndex('topics_code_uq').on(t.code)],
);

export const formulas = pgTable('formulas', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  latex: text('latex').notNull(),
  prose: text('prose'),
  mnemonics: jsonb('mnemonics').$type<Array<{ id: string; phrase: string }>>(),
});

export const pitfalls = pgTable('pitfalls', {
  id: text('id').primaryKey(),
  topicId: text('topic_id').references(() => topics.id),
  severity: integer('severity').notNull(), // 1..5
  symptom: text('symptom').notNull(),
  why: text('why'),
  fix: text('fix'),
  paperRefs: text('paper_refs').array().$type<string[]>(),
  examinerQuote: text('examiner_quote'),
});

// ─── Attempts, marker, documents, drills ─────────────────────────────────────

export const attempts = pgTable(
  'attempts',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    paperId: text('paper_id').references(() => papers.id),
    mode: attemptModeEnum('mode').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    submittedAt: timestamp('submitted_at', { withTimezone: true }),
    durationMs: bigint('duration_ms', { mode: 'number' }),
    autoSubmitted: boolean('auto_submitted').default(false).notNull(),
  },
  (t) => [index('attempts_user_idx').on(t.userId), index('attempts_paper_idx').on(t.paperId)],
);

export const attemptParts = pgTable(
  'attempt_parts',
  {
    id: text('id').primaryKey(),
    attemptId: text('attempt_id').notNull().references(() => attempts.id, { onDelete: 'cascade' }),
    partRef: text('part_ref').notNull(),
    marksAvailable: integer('marks_available').notNull(),
    marksAwarded: integer('marks_awarded'),
    breakdown: jsonb('breakdown').$type<{
      perRubric: Array<{ lineId: string; awarded: number; evidence?: string; advice?: string }>;
    }>(),
    aiMarkerVersion: text('ai_marker_version'),
  },
  (t) => [index('attempt_parts_attempt_idx').on(t.attemptId)],
);

export const documents = pgTable(
  'documents',
  {
    id: text('id').primaryKey(),
    attemptId: text('attempt_id').notNull().references(() => attempts.id, { onDelete: 'cascade' }),
    kind: documentKindEnum('kind').notNull(),
    /** Yjs CRDT state — opaque bytes, version-vector inside. */
    yjsState: bytea('yjs_state'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('documents_attempt_idx').on(t.attemptId)],
);

export const drills = pgTable(
  'drills',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    topicId: text('topic_id').references(() => topics.id),
    paperPartRef: text('paper_part_ref'),
    score: integer('score'),
    durationMs: bigint('duration_ms', { mode: 'number' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('drills_user_idx').on(t.userId)],
);

// ─── Gamification: quests, points, streaks ───────────────────────────────────

export const quests = pgTable(
  'quests',
  {
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    date: text('date').notNull(), // ISO YYYY-MM-DD
    items: jsonb('items').$type<Array<{ id: string; label: string; href: string; done: boolean }>>().notNull(),
    completed: boolean('completed').default(false).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.date] })],
);

export const points = pgTable(
  'points',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    amount: integer('amount').notNull(),
    reason: text('reason').notNull(),
    refId: text('ref_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('points_user_idx').on(t.userId)],
);

export const streaks = pgTable('streaks', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  current: integer('current').default(0).notNull(),
  longest: integer('longest').default(0).notNull(),
  lastActiveDate: text('last_active_date'),
  freezeTokens: integer('freeze_tokens').default(2).notNull(),
});

// ─── Spaced repetition (FSRS) ────────────────────────────────────────────────

export const srCards = pgTable(
  'sr_cards',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    deck: text('deck').notNull(),
    front: text('front').notNull(),
    back: text('back').notNull(),
    type: text('type').notNull(), // 'basic' | 'cloze' | 'image' | 'audio' | 'formula'
    audioUrl: text('audio_url'),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('sr_cards_user_idx').on(t.userId)],
);

export const srReviews = pgTable(
  'sr_reviews',
  {
    cardId: text('card_id').notNull().references(() => srCards.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(), // 1..4 (Again..Easy)
    stability: integer('stability'),
    difficulty: integer('difficulty'),
    due: timestamp('due', { withTimezone: true }).notNull(),
    lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.cardId, t.lastReviewedAt] }),
    index('sr_reviews_user_due_idx').on(t.userId, t.due),
  ],
);

export const mnemonicPalace = pgTable('mnemonic_palace', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  roomIndex: integer('room_index').notNull(),
  formulaId: text('formula_id').references(() => formulas.id),
  imageDataUrl: text('image_data_url'),
  prose: text('prose'),
}, (t) => [primaryKey({ columns: [t.userId, t.roomIndex] })]);

// ─── Debrief, notes ──────────────────────────────────────────────────────────

export const debriefs = pgTable(
  'debriefs',
  {
    id: text('id').primaryKey(),
    attemptId: text('attempt_id').notNull().references(() => attempts.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    markdown: text('markdown').notNull(),
    eightMarkers: jsonb('eight_markers').$type<Record<string, boolean>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('debriefs_user_idx').on(t.userId)],
);

export const notes = pgTable(
  'notes',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    /** Polymorphic foreign key: { kind: 'topic'|'paper'|'partRef', id: string }. */
    target: jsonb('target').$type<{ kind: 'topic' | 'paper' | 'partRef'; id: string }>().notNull(),
    markdown: text('markdown').notNull(),
    tags: text('tags').array().$type<string[]>(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('notes_user_idx').on(t.userId), index('notes_updated_idx').on(t.updatedAt)],
);

// ─── Leaderboards (personal-trend) + audit + exports + outbox ────────────────

export const leaderboards = pgTable('leaderboards', {
  id: text('id').primaryKey(),
  scope: leaderboardScopeEnum('scope').notNull(),
  period: text('period').notNull(), // 'all-time' | 'week' | 'sitting'
  snapshot: jsonb('snapshot').$type<{
    rows: Array<{ key: string; metric: number; meta?: Record<string, unknown> }>;
  }>().notNull(),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const auditLog = pgTable(
  'audit_log',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    target: text('target'),
    meta: jsonb('meta').$type<Record<string, unknown>>(),
    ip: text('ip'),
    ua: text('ua'),
    ts: timestamp('ts', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('audit_user_idx').on(t.userId), index('audit_ts_idx').on(t.ts)],
);

export const exports = pgTable(
  'exports',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    kind: exportKindEnum('kind').notNull(),
    url: text('url').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('exports_user_idx').on(t.userId)],
);

/**
 * The outbox table is appended to inside the same transaction as the
 * business write, then a cron worker fans events out to PostHog / email /
 * webhooks. This is the standard transactional-outbox pattern; it gives
 * exactly-once-with-retry semantics without coupling business writes to
 * external availability.
 */
export const outbox = pgTable(
  'outbox',
  {
    id: text('id').primaryKey(),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    dispatchedAt: timestamp('dispatched_at', { withTimezone: true }),
    retries: integer('retries').default(0).notNull(),
    lastError: text('last_error'),
  },
  (t) => [index('outbox_pending_idx').on(t.dispatchedAt)],
);
