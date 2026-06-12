import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '../../../shared/components/Badge';
import type { Task, Priority } from '../../../shared/types';

interface Anomaly {
  label: string;
  className: string;
}

function getAnomaly(task: Task): Anomaly | null {
  if (task.status === 'DONE') return null;

  if (task.dueDate) {
    const due = new Date(task.dueDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const overdueDays = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    if (overdueDays > 0) {
      return {
        label: `${overdueDays}d overdue`,
        className: 'text-red-400 bg-red-500/10 border-red-500/20',
      };
    }
  }

  if (task.status === 'TODO' || task.status === 'IN_PROGRESS') {
    const updatedAt = new Date(task.updatedAt);
    const staleDays = Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
    if (staleDays >= 7) {
      return {
        label: `No update ${staleDays}d`,
        className: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      };
    }
  }

  if (task.priority === 'HIGH' && !task.dueDate) {
    return {
      label: 'Missing deadline',
      className: 'text-zinc-500 bg-zinc-800/60 border-zinc-700/40',
    };
  }

  return null;
}

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

function formatDueDate(iso: string): { label: string; color: string } {
  const due = new Date(iso);
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));

  const label = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (diffDays < 0) return { label, color: 'text-red-400' };
  if (diffDays <= 2) return { label, color: 'text-amber-400' };
  return { label, color: 'text-zinc-500' };
}

export function TaskCard({ task, onEdit, onDelete, isDragOverlay = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: isDragOverlay,
  });

  const style = { transform: CSS.Translate.toString(transform) };
  const priority = priorityConfig[task.priority];
  const due = task.dueDate ? formatDueDate(task.dueDate) : null;
  const anomaly = isDragOverlay ? null : getAnomaly(task);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
      className={`
        group relative bg-zinc-900 border border-zinc-800 rounded-xl p-3
        border-l-2 ${priority.border}
        transition-all duration-150
        ${isDragOverlay
          ? 'shadow-2xl shadow-black/60 rotate-1 scale-105 cursor-grabbing ring-1 ring-amber-400/20'
          : 'cursor-grab hover:border-zinc-700 hover:bg-zinc-800/50 active:cursor-grabbing'
        }
        ${isDragging ? 'opacity-30' : 'opacity-100'}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
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

      <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-zinc-700">
          #{task.id.slice(0, 8).toUpperCase()}
        </span>
        {due && (
          <span className={`font-mono text-[10px] flex items-center gap-1 ${due.color}`}>
            ◷ {due.label}
          </span>
        )}
      </div>

      {anomaly && (
        <div className={`mt-2 px-2 py-1 rounded-md border font-mono text-[10px] ${anomaly.className}`}>
          ⚠ {anomaly.label}
        </div>
      )}
    </div>
  );
}
