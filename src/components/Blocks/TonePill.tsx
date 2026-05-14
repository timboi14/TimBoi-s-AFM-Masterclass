import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { useTone, type Tone } from './tone';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

/**
 * Tier-tone driven button system per spec §12.4.
 * Picks the right palette based on the surrounding SectionShell tone:
 *   white/mist  -> navy-on-white primary, navy-outline secondary
 *   navy/black  -> gold-on-navy primary, white-outline secondary
 */
function classFor(tone: Tone, variant: Variant, size: Size, fullWidth: boolean) {
  const dark = tone === 'navy' || tone === 'black';

  const sizeCls =
    size === 'sm'
      ? 'h-9 px-4 text-[12px]'
      : 'h-11 px-5 text-[13.5px]';

  const base = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-wider transition-colors whitespace-nowrap',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-500)] focus-visible:ring-offset-2',
    fullWidth && 'w-full',
    sizeCls,
  );

  if (variant === 'primary') {
    return cn(
      base,
      dark
        ? 'bg-[var(--gold-500)] text-[var(--navy-900)] hover:bg-[var(--gold-600)]'
        : 'bg-[var(--navy-800)] text-white hover:bg-[var(--navy-900)]',
    );
  }
  if (variant === 'secondary') {
    return cn(
      base,
      'bg-transparent border',
      dark
        ? 'border-white text-white hover:bg-white/10'
        : 'border-[var(--navy-800)] text-[var(--navy-800)] hover:bg-[var(--navy-800)]/[0.06]',
    );
  }
  // ghost
  return cn(
    base,
    'bg-transparent underline underline-offset-4 hover:no-underline',
    dark ? 'text-white' : 'text-[var(--navy-800)]',
  );
}

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string };
type RouterProps = BaseProps & Omit<LinkProps, 'children' | 'className'> & { as: 'link' };

export type TonePillProps = ButtonProps | AnchorProps | RouterProps;

export const TonePill = forwardRef<HTMLElement, TonePillProps>(function TonePill(props, ref) {
  const tone = useTone();
  const { variant = 'primary', size = 'md', fullWidth = false, className, children } = props;
  const cls = cn(classFor(tone, variant, size, fullWidth), className);

  if ((props as AnchorProps).as === 'a') {
    const { as, variant: _v, size: _s, fullWidth: _f, className: _c, children: _ch, ...rest } = props as AnchorProps;
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  if ((props as RouterProps).as === 'link') {
    const { as, variant: _v, size: _s, fullWidth: _f, className: _c, children: _ch, ...rest } = props as RouterProps;
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  const { as, variant: _v, size: _s, fullWidth: _f, className: _c, children: _ch, ...rest } = props as ButtonProps;
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} className={cls} {...rest}>
      {children}
    </button>
  );
});
