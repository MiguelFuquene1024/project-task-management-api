import { ButtonHTMLAttributes } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  loading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50';

  const variants: Record<string, string> = {
    primary: 'bg-amber-400 text-zinc-900 hover:bg-amber-300 active:bg-amber-500',
    ghost: 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800',
    danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
    outline: 'border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading ?? disabled}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}
