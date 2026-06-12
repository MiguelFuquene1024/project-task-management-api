import { useState, useMemo } from 'react';
import type { Task, Priority } from '../../../shared/types';

export interface TaskFilters {
  search: string;
  priority: Priority | '';
  overdueOnly: boolean;
}

const INITIAL: TaskFilters = { search: '', priority: '', overdueOnly: false };

export function useTaskFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<TaskFilters>(INITIAL);

  const filtered = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return tasks.filter((t) => {
      if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.priority && t.priority !== filters.priority) {
        return false;
      }
      if (filters.overdueOnly) {
        if (!t.dueDate) return false;
        if (new Date(t.dueDate) >= now) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const activeCount = [
    filters.search !== '',
    filters.priority !== '',
    filters.overdueOnly,
  ].filter(Boolean).length;

  function reset() {
    setFilters(INITIAL);
  }

  return { filters, setFilters, filtered, activeCount, reset };
}
