import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted font-bold">404</p>
      <h1 className="mt-2 font-display text-5xl tracking-wide uppercase text-ink">
        Off the pitch.
      </h1>
      <p className="mt-3 text-ink/80">That route doesn&apos;t exist yet.</p>
      <Link href="/" className="mt-6 inline-block text-primary underline underline-offset-4">
        Back to Home
      </Link>
    </main>
  );
}
