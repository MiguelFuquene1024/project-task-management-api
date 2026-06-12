import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: string;
}

export function EmptyState({ title, description, action, icon = '○' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
        <span className="text-zinc-500 text-2xl">{icon}</span>
      </div>
      <h3 className="font-display font-semibold text-zinc-300 text-base mb-1">{title}</h3>
      {description && <p className="text-zinc-500 text-sm mb-5 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}
