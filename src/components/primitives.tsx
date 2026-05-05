import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/* Match-day stagger container ------------------------------ */
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] as any } },
};
export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
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
      className="font-display text-3xl tracking-wide flex items-center gap-3 uppercase mt-10 mb-5"
    >
      {icon && <i className={cn('text-primary', icon)} />}
      <span className="bg-gradient-to-b from-text to-text/70 bg-clip-text text-transparent">{children}</span>
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
  variant?: 'outline' | 'primary' | 'accent' | 'danger';
}) {
  const variantCls = {
    outline: 'border border-border text-text',
    primary: 'bg-primary text-bg',
    accent: 'bg-accent text-bg',
    danger: 'bg-danger text-white',
  }[variant];
  return <span className={cn('pill', variantCls, className)}>{children}</span>;
}

/* Coach Tip card (tactics board) -------------------------- */
export function CoachTip({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="relative my-4 rounded-xl border-2 border-dashed border-accent/50 bg-accent/[0.06] p-4"
    >
      <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-md bg-accent text-bg font-bold text-[11px] uppercase tracking-widest">
        <i className="fa-solid fa-chalkboard-user mr-1.5" /> {title}
      </div>
      <p className="text-[14px] leading-relaxed text-text mt-1">{children}</p>
    </motion.div>
  );
}
