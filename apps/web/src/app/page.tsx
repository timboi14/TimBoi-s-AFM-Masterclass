import Link from 'next/link';

/**
 * Home — Next.js parity stub.
 *
 * Spec D-001 (DECISIONS.md): the canonical Home page is still served from
 * the root Vite SPA at `/`. This file is the parity target — once the full
 * Home component ports over (Hero, NewUserTourBanner, Today's Mission, Form
 * Guide compact, Spotlights, News, Personal Trend Board), the Vercel project
 * root flips to apps/web and this becomes canonical.
 *
 * Until then, the production deploy still serves src/pages/Home.tsx from
 * the Vite root and this directory is build-only (not yet wired to Vercel).
 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-muted font-bold">
        Next.js 15 · strangler-fig scaffold
      </p>
      <h1 className="font-display text-5xl tracking-wide uppercase text-ink leading-[0.95]">
        TimBoi&apos;s Academy
      </h1>
      <p className="mt-4 max-w-2xl text-ink/80 leading-relaxed">
        The canonical Home page is still served from the Vite SPA at the repo root.
        This Next.js shell is the migration target; pages port over here one at a
        time until pixel-parity is achieved across every route — at which point the
        Vercel project root flips to <code>apps/web</code>.
      </p>
      <ul className="mt-6 space-y-1 text-[14px] text-ink/80">
        <li>· Strangler-fig migration target (DECISIONS.md D-001)</li>
        <li>· Tailwind tokens mirrored from root <code>tailwind.config.js</code></li>
        <li>· Drizzle schema source-of-truth: <code>packages/db/schema.ts</code></li>
      </ul>
      <p className="mt-6">
        <Link href="/" className="text-primary underline underline-offset-4">
          Open the live site →
        </Link>
      </p>
    </main>
  );
}
