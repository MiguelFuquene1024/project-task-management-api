import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '../../../shared/types';

interface ColumnConfig {
  status: TaskStatus;
  label: string;
  topBorder: string;
  dotColor: string;
  countBg: string;
}

export const COLUMN_CONFIG: Record<TaskStatus, ColumnConfig> = {
  TODO: {
    status: 'TODO',
    label: 'To Do',
    topBorder: 'border-t-zinc-600',
    dotColor: 'bg-zinc-500',
    countBg: 'bg-zinc-800 text-zinc-500',
  },
  IN_PROGRESS: {
    status: 'IN_PROGRESS',
    label: 'In Progress',
    topBorder: 'border-t-blue-500',
    dotColor: 'bg-blue-400',
    countBg: 'bg-blue-500/10 text-blue-400',
  },
  BLOCKED: {
    status: 'BLOCKED',
    label: 'Blocked',
    topBorder: 'border-t-red-500',
    dotColor: 'bg-red-400',
    countBg: 'bg-red-500/10 text-red-400',
  },
  IN_REVIEW: {
    status: 'IN_REVIEW',
    label: 'In Review',
    topBorder: 'border-t-amber-500',
    dotColor: 'bg-amber-400',
    countBg: 'bg-amber-500/10 text-amber-400',
  },
  DONE: {
    status: 'DONE',
    label: 'Done',
    topBorder: 'border-t-emerald-500',
    dotColor: 'bg-emerald-400',
    countBg: 'bg-emerald-500/10 text-emerald-400',
  },
};

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export function TaskColumn({ status, tasks, onEditTask, onDeleteTask }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = COLUMN_CONFIG[status];

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div
        className={`flex items-center gap-2.5 mb-4 pb-3 border-t-2 pt-3 ${config.topBorder}`}
      >
        <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
        <span className="font-display font-semibold text-sm text-zinc-300 tracking-wide">
          {config.label}
        </span>
        <span
          className={`ml-auto font-mono text-xs px-2 py-0.5 rounded-md ${config.countBg}`}
        >
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2.5 flex-1 min-h-[200px] rounded-xl p-2 -m-2 transition-colors duration-150 ${
          isOver ? 'bg-zinc-800/60 ring-1 ring-zinc-600' : ''
        }`}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        {tasks.length === 0 && (
          <div
            className={`flex items-center justify-center py-10 rounded-xl border border-dashed transition-colors ${
              isOver ? 'border-zinc-600 bg-zinc-800/30' : 'border-zinc-800'
            }`}
          >
            <span className="font-mono text-xs text-zinc-700">
              {isOver ? 'Release to drop' : 'No tasks'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
