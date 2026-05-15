import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type AccentTone = 'primary' | 'accent' | 'danger';

/* Match-day stagger container ------------------------------ */
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] as const } },
};
/* Card base ------------------------------------------------- */
export function Card({ className, children, glow, ...rest }: { className?: string; children?: ReactNode; glow?: boolean } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2 }}
      className={cn('card-base relative overflow-hidden p-5', glow && 'shadow-glow', className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* Section title ------------------------------------------- */
export function SectionTitle({
  icon,
  children,
  badge,
  rightSlot,
}: {
  icon?: string;
  children: ReactNode;
  badge?: ReactNode;
  rightSlot?: ReactNode;
}) {
  return (
    <motion.h2
      variants={fadeUp}
      className="font-display text-3xl tracking-wide flex items-center gap-3 uppercase mt-10 mb-5 text-ink"
    >
      {icon && <i className={cn('text-primary', icon)} />}
      <span>{children}</span>
      {badge}
      {rightSlot && <span className="ml-auto text-sm font-body normal-case tracking-normal text-muted">{rightSlot}</span>}
    </motion.h2>
  );
}

/* Pill ----------------------------------------------------- */
export function Pill({
  className,
  children,
  variant = 'outline',
}: {
  className?: string;
  children: ReactNode;
  variant?: 'outline' | AccentTone;
}) {
  const variantCls = {
    outline: 'border border-border bg-white text-text',
    primary: 'bg-primary text-white',
    accent: 'bg-accent text-ink',
    danger: 'bg-danger text-white',
  }[variant];
  return <span className={cn('pill', variantCls, className)}>{children}</span>;
}

/* Form Field (label + input slot) ------------------------- */
// Lives here so Debrief/StudyGuide share the same uppercase eyebrow styling.
// Two callers today; without a shared definition the eyebrow drifts silently.
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted font-bold mb-1 block">{label}</span>
      {children}
    </label>
  );
}

/* Coach Tip card (tactics board) -------------------------- */
export function CoachTip({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="relative my-4 rounded-xl border-2 border-dashed border-accent/60 bg-accent/[0.10] p-4"
    >
      <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-md bg-accent text-ink font-bold text-[11px] uppercase tracking-widest">
        <i className="fa-solid fa-chalkboard-user mr-1.5" /> {title}
      </div>
      <p className="text-[14px] leading-relaxed text-ink mt-1">{children}</p>
    </motion.div>
  );
}
