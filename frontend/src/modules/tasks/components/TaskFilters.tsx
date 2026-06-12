import type { TaskFilters } from '../hooks/useTaskFilters';
import type { Priority } from '../../../shared/types';

interface TaskFiltersProps {
  filters: TaskFilters;
  activeCount: number;
  onChange: (f: TaskFilters) => void;
  onReset: () => void;
}

const priorityOptions: { value: Priority | ''; label: string }[] = [
  { value: '', label: 'All priorities' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

export function TaskFilters({ filters, activeCount, onChange, onReset }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none">
          ⌕
        </span>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search tasks..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-7 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400/50 transition-colors"
        />
      </div>

      <select
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value as Priority | '' })}
        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-400/50 transition-colors appearance-none pr-7"
      >
        {priorityOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <div
          onClick={() => onChange({ ...filters, overdueOnly: !filters.overdueOnly })}
          className={`w-8 h-4 rounded-full transition-colors relative ${
            filters.overdueOnly ? 'bg-red-500' : 'bg-zinc-700'
          }`}
        >
          <span
            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
              filters.overdueOnly ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </div>
        <span className="font-mono text-xs text-zinc-400">Overdue only</span>
      </label>

      {activeCount > 0 && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          <span className="bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded text-[10px]">
            {activeCount}
          </span>
          Clear filters
        </button>
      )}
    </div>
  );
}
