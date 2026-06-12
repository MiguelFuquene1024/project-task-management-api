import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../../../shared/components/EmptyState';
import { useUpdateTaskStatus } from '../hooks/useTasks';
import type { Task, TaskStatus } from '../../../shared/types';

const COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'IN_REVIEW', 'DONE'];

interface TaskBoardProps {
  tasks: Task[];
  projectId: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export function TaskBoard({ tasks, projectId, onEditTask, onDeleteTask }: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const updateStatus = useUpdateTaskStatus(projectId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function handleDragStart({ active }: DragStartEvent) {
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const newStatus: TaskStatus | undefined = COLUMNS.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : tasks.find((t) => t.id === overId)?.status;

    if (!newStatus) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    updateStatus.mutate({ id: taskId, status: newStatus });
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Add tasks to this project to populate the board."
        icon="⊞"
      />
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-5 overflow-x-auto pb-6 min-h-[60vh]">
        {COLUMNS.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
