import { useEffect, useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { useCreateTask, useUpdateTask } from '../hooks/useTasks';
import type { Priority, Task, TaskStatus } from '../../../shared/types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  mode: 'create' | 'edit';
  task?: Task;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'HIGH', label: 'High', color: 'text-red-400' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-amber-400' },
  { value: 'LOW', label: 'Low', color: 'text-emerald-400' },
];

export function TaskFormModal({ isOpen, onClose, projectId, mode, task }: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [error, setError] = useState('');

  const createTask = useCreateTask(projectId);
  const updateTask = useUpdateTask(projectId);
  const isPending = createTask.isPending || updateTask.isPending;

  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title ?? '');
      setDescription(task?.description ?? '');
      setStatus(task?.status ?? 'TODO');
      setPriority(task?.priority ?? 'MEDIUM');
      setError('');
    }
  }, [isOpen, task]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    try {
      if (mode === 'create') {
        await createTask.mutateAsync({
          title: title.trim(),
          description: description.trim() || null,
          status,
          priority,
        });
      } else if (task) {
        await updateTask.mutateAsync({
          id: task.id,
          data: {
            title: title.trim(),
            description: description.trim() || null,
            status,
            priority,
          },
        });
      }
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  const selectClass =
    'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-amber-400/60 transition-colors appearance-none';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'New Task' : 'Edit Task'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-display text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(''); }}
            placeholder="What needs to be done?"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-400/60 transition-colors"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
        </div>

        <div>
          <label className="block font-display text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more context..."
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-400/60 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-display text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className={selectClass}
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-display text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={selectClass}
            >
              {priorityOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            {mode === 'create' ? 'Create Task' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
