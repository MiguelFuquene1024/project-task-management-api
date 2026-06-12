import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../services/tasksApi';
import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from '../../../shared/types';

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => tasksApi.listByProject(projectId),
    enabled: !!projectId,
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskInput) => tasksApi.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      tasksApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] }),
  });
}

export function useUpdateTaskStatus(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksApi.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
      const previous = queryClient.getQueryData<Task[]>(['tasks', projectId]);
      queryClient.setQueryData<Task[]>(['tasks', projectId], (old) =>
        old ? old.map((t) => (t.id === id ? { ...t, status } : t)) : [],
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['tasks', projectId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
