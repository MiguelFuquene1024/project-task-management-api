interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizes = { sm: 'w-3 h-3 border', md: 'w-5 h-5 border-2', lg: 'w-8 h-8 border-2' };
  return (
    <div
      className={`${sizes[size]} border-zinc-700 border-t-amber-400 rounded-full animate-spin`}
    />
  );
}
