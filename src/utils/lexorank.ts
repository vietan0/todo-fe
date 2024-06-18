import { LexoRank } from 'lexorank';

import type { ProjectScalar, Task, TaskScalar } from '../types/dataSchemas';

/**
 * A function that goes into a `sort()` call
 */
export function sortRank<T extends ProjectScalar | Task | TaskScalar>(a: T, b: T) {
  return LexoRank.parse(a.lexorank).compareTo(LexoRank.parse(b.lexorank));
}

/**
 * Call `sort()` on an array of projects or tasks
 */
export function sortByRank<T extends ProjectScalar | Task | TaskScalar>(items: T[]) {
  return items.sort(sortRank);
}

/**
  Sort logic so that tasks are in the following lexorank order:
  - base task 1
    - subtask 1
    - subtask 2
  - base task 2
    - subtask 1
  - base task 3
 */
export function sortTasks(tasks: Task[]) {
  // 1. group each base task and its children (subtasks) into a "family" array
  // a. make an array of families, add base task first
  const baseTasks = tasks.filter(task => task.parentTaskId === null);
  const families = baseTasks.map(t => [t]);
  // b. add all children into their corresponding family
  const subTasks = tasks.filter(task => task.parentTaskId !== null);

  subTasks.forEach((subTask) => {
    const family = families.find(f => f[0].id === subTask.parentTaskId);
    family!.push(subTask);
  });

  // 2. sort children within each family
  const sortedChildrenFamilies = families.map((group) => {
    if (group.length === 1)
      return group;

    const subTasks = group.slice(1);
    const sortedSubTasks = sortByRank(subTasks);

    return [group[0], ...sortedSubTasks];
  });

  // 3. sort families - by base task's lexorank
  sortedChildrenFamilies.sort((a, b) => sortRank(a[0], b[0]));
  const sortedTasks = sortedChildrenFamilies.flat();

  return sortedTasks;
}
