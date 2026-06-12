import type { Project } from '../../../shared/types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function ProjectCard({ project, onClick, onEdit, onDelete }: ProjectCardProps) {
  const completionRate =
    project.taskCount > 0
      ? Math.round((project.tasksByStatus.DONE / project.taskCount) * 100)
      : 0;

  return (
    <div
      onClick={onClick}
      className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="font-mono text-[11px] text-amber-400/60 tracking-wider">
          #{project.id.slice(0, 8).toUpperCase()}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={onEdit}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 transition-colors text-xs"
            title="Edit project"
          >
            ✎
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs"
            title="Delete project"
          >
            ✕
          </button>
        </div>
      </div>

      <h3 className="font-display font-bold text-zinc-50 text-xl mb-1.5 leading-tight">
        {project.name}
      </h3>

      <p className="text-zinc-500 text-sm mb-5 line-clamp-2 leading-relaxed min-h-[40px]">
        {project.description ?? 'No description provided.'}
      </p>

      {project.taskCount > 0 && (
        <div className="mb-4">
          <div className="flex h-1 rounded-full overflow-hidden bg-zinc-800 gap-px">
            {project.tasksByStatus.DONE > 0 && (
              <div
                className="bg-emerald-500 transition-all"
                style={{ width: `${(project.tasksByStatus.DONE / project.taskCount) * 100}%` }}
              />
            )}
            {project.tasksByStatus.IN_PROGRESS > 0 && (
              <div
                className="bg-blue-500 transition-all"
                style={{
                  width: `${(project.tasksByStatus.IN_PROGRESS / project.taskCount) * 100}%`,
                }}
              />
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-600" />
          <span className="font-mono text-xs text-zinc-500">
            {project.tasksByStatus.TODO}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="font-mono text-xs text-zinc-500">
            {project.tasksByStatus.IN_PROGRESS}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-xs text-zinc-500">
            {project.tasksByStatus.DONE}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-600">
            {project.taskCount} task{project.taskCount !== 1 ? 's' : ''}
          </span>
          {project.taskCount > 0 && (
            <span className="font-mono text-xs text-amber-400/70">{completionRate}%</span>
          )}
        </div>
      </div>
    </div>
  );
}
