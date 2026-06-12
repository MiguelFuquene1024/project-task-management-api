import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects, useDeleteProject } from '../hooks/useProjects';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectFormModal } from '../components/ProjectFormModal';
import { Button } from '../../../shared/components/Button';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { useDisclosure } from '../../../shared/hooks/useDisclosure';
import type { Project } from '../../../shared/types';

export function ProjectsPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading, error } = useProjects();
  const deleteProject = useDeleteProject();

  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();
  const [selected, setSelected] = useState<Project | null>(null);

  function handleEdit(e: React.MouseEvent, project: Project) {
    e.stopPropagation();
    setSelected(project);
    editModal.open();
  }

  function handleDeleteRequest(e: React.MouseEvent, project: Project) {
    e.stopPropagation();
    setSelected(project);
    deleteModal.open();
  }

  async function handleDeleteConfirm() {
    if (!selected) return;
    await deleteProject.mutateAsync(selected.id);
    deleteModal.close();
    setSelected(null);
  }

  const totalTasks = projects?.reduce((s, p) => s + p.taskCount, 0) ?? 0;
  const doneTasks = projects?.reduce((s, p) => s + p.tasksByStatus.DONE, 0) ?? 0;

  return (
    <div className="min-h-screen bg-surface-base">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-mono text-[11px] text-amber-400/70 mb-3 tracking-[0.2em] uppercase">
              workspace
            </p>
            <h1 className="font-display font-black text-5xl text-zinc-50 leading-none">
              Projects
            </h1>
          </div>
          <Button onClick={createModal.open}>+ New Project</Button>
        </div>

        {projects && projects.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Projects
              </p>
              <p className="font-display font-black text-3xl text-zinc-50">{projects.length}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Total Tasks
              </p>
              <p className="font-display font-black text-3xl text-zinc-50">{totalTasks}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Completed
              </p>
              <p className="font-display font-black text-3xl text-emerald-400">{doneTasks}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {error && (
          <div className="flex justify-center py-20">
            <p className="text-red-400 font-mono text-sm">Failed to load projects.</p>
          </div>
        )}

        {!isLoading && !error && projects?.length === 0 && (
          <EmptyState
            title="No projects yet"
            description="Create your first project to start organizing tasks."
            action={<Button onClick={createModal.open}>Create Project</Button>}
            icon="◫"
          />
        )}

        {!isLoading && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/projects/${project.id}`)}
                onEdit={(e) => handleEdit(e, project)}
                onDelete={(e) => handleDeleteRequest(e, project)}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectFormModal isOpen={createModal.isOpen} onClose={createModal.close} mode="create" />

      {selected && (
        <ProjectFormModal
          isOpen={editModal.isOpen}
          onClose={() => { editModal.close(); setSelected(null); }}
          mode="edit"
          project={selected}
        />
      )}

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="Delete Project"
        message={`Delete "${selected?.name}"? All tasks inside will be permanently removed.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { deleteModal.close(); setSelected(null); }}
        isLoading={deleteProject.isPending}
      />
    </div>
  );
}
