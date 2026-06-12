import { useEffect, useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { useCreateProject, useUpdateProject } from '../hooks/useProjects';
import type { Project } from '../../../shared/types';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  project?: Project;
}

export function ProjectFormModal({ isOpen, onClose, mode, project }: ProjectFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const isPending = createProject.isPending || updateProject.isPending;

  useEffect(() => {
    if (isOpen) {
      setName(project?.name ?? '');
      setDescription(project?.description ?? '');
      setError('');
    }
  }, [isOpen, project]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    try {
      if (mode === 'create') {
        await createProject.mutateAsync({ name: name.trim(), description: description.trim() || null });
      } else if (project) {
        await updateProject.mutateAsync({
          id: project.id,
          data: { name: name.trim(), description: description.trim() || null },
        });
      }
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'New Project' : 'Edit Project'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-display text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="My awesome project"
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
            placeholder="What is this project about?"
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-400/60 transition-colors resize-none"
          />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            {mode === 'create' ? 'Create Project' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
