import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../hooks/useProjects';
import { useTasks, useDeleteTask } from '../../tasks/hooks/useTasks';
import { TaskBoard } from '../../tasks/components/TaskBoard';
import { TaskFormModal } from '../../tasks/components/TaskFormModal';
import { Button } from '../../../shared/components/Button';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { useDisclosure } from '../../../shared/hooks/useDisclosure';
import type { Task } from '../../../shared/types';

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading: projectLoading } = useProject(projectId!);
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(projectId!);
  const deleteTask = useDeleteTask(projectId!);

  const createTaskModal = useDisclosure();
  const editTaskModal = useDisclosure();
  const deleteTaskModal = useDisclosure();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  function handleEditTask(task: Task) {
    setSelectedTask(task);
    editTaskModal.open();
  }

  function handleDeleteTask(task: Task) {
    setSelectedTask(task);
    deleteTaskModal.open();
  }

  async function handleDeleteConfirm() {
    if (!selectedTask) return;
    await deleteTask.mutateAsync(selectedTask.id);
    deleteTaskModal.close();
    setSelectedTask(null);
  }

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-base">
      <div className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2"
          >
            ← Projects
          </button>

          <div className="w-px h-4 bg-zinc-700" />

          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-zinc-50 text-lg truncate">
              {project?.name}
            </h1>
            {project?.description && (
              <p className="font-mono text-xs text-zinc-500 truncate">{project.description}</p>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                {project?.tasksByStatus.TODO ?? 0}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {project?.tasksByStatus.IN_PROGRESS ?? 0}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {project?.tasksByStatus.DONE ?? 0}
              </span>
            </div>
            <Button onClick={createTaskModal.open}>+ Add Task</Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-8">
        {tasksLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <TaskBoard
            tasks={tasks}
            projectId={projectId!}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>

      <TaskFormModal
        isOpen={createTaskModal.isOpen}
        onClose={createTaskModal.close}
        projectId={projectId!}
        mode="create"
      />

      {selectedTask && (
        <TaskFormModal
          isOpen={editTaskModal.isOpen}
          onClose={() => { editTaskModal.close(); setSelectedTask(null); }}
          projectId={projectId!}
          mode="edit"
          task={selectedTask}
        />
      )}

      <ConfirmDialog
        isOpen={deleteTaskModal.isOpen}
        title="Delete Task"
        message={`Delete "${selectedTask?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { deleteTaskModal.close(); setSelectedTask(null); }}
        isLoading={deleteTask.isPending}
      />
    </div>
  );
}
