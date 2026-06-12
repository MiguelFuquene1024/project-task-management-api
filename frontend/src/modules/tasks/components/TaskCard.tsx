import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '../../../shared/components/Badge';
import type { Task, Priority } from '../../../shared/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  isDragOverlay?: boolean;
}

const priorityConfig: Record<Priority, { label: string; variant: 'danger' | 'warning' | 'success'; border: string }> = {
  HIGH: { label: 'High', variant: 'danger', border: 'border-l-red-500' },
  MEDIUM: { label: 'Medium', variant: 'warning', border: 'border-l-amber-500' },
  LOW: { label: 'Low', variant: 'success', border: 'border-l-emerald-500' },
};

export function TaskCard({ task, onEdit, onDelete, isDragOverlay = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const priority = priorityConfig[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
      className={`
        group relative bg-zinc-900 border border-zinc-800 rounded-xl p-4
        border-l-2 ${priority.border}
        transition-all duration-150
        ${isDragOverlay
          ? 'shadow-2xl shadow-black/60 rotate-1 scale-105 cursor-grabbing ring-1 ring-amber-400/20'
          : 'cursor-grab hover:border-zinc-700 hover:bg-zinc-800/50 active:cursor-grabbing'
        }
        ${isDragging ? 'opacity-30' : 'opacity-100'}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge variant={priority.variant}>{priority.label}</Badge>
        {!isDragOverlay && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onEdit(task); }}
              className="w-6 h-6 flex items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700 text-xs transition-colors"
            >
              ✎
            </button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onDelete(task); }}
              className="w-6 h-6 flex items-center justify-center rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 text-xs transition-colors"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-zinc-100 font-display font-medium leading-snug mb-1">
        {task.title}
      </p>

      {task.description && (
        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="mt-3 pt-3 border-t border-zinc-800/60">
        <span className="font-mono text-[10px] text-zinc-700">
          #{task.id.slice(0, 8).toUpperCase()}
        </span>
      </div>
    </div>
  );
}
