import type { DragEndEvent } from '@dnd-kit/core';

import type { ProjectScalar, Task, TaskScalar } from '../types/dataSchemas';
import { LexoRank } from 'lexorank';

export const indent = 40;

/**
 * Use in `Project.tsx` for all tasks (handle nesting)
 */
export function calcNestedRank(event: DragEndEvent, tasks: Task[]) {
  type LevelChange = 'base-to-base' | 'base-to-sub' | 'sub-to-base' | 'sub-to-sub';
  const { active, over, delta } = event;
  const activeIndex = tasks.findIndex(t => t.id === active.id);
  const activeTask = tasks[activeIndex];
  const activeIsBase = activeTask.parentTaskId === null;
  let newRank = LexoRank.parse(activeTask.lexorank);
  let parentTaskId = activeTask.parentTaskId;

  if (active.id === over!.id) {
    // only delta.x changes, not order
    const dragBaseToRight = activeIsBase && delta.x > indent;
    const dragSubToLeft = !activeIsBase && delta.x < -indent;

    if (dragBaseToRight) {
      if (activeIndex === 0 || activeTask.subTasks.length > 0)
        // disallow first task to be sub
        // disallow active to be sub if active has children
        return;

      const prevTask = tasks[activeIndex - 1];
      const prevTaskIsBase = prevTask.parentTaskId === null;

      if (prevTaskIsBase) {
        // if prev is base, active is now prev's first and only child
        newRank = LexoRank.middle();
        parentTaskId = prevTask.id;
      }
      else {
        // prev is sub, active is last child of prev's parent
        newRank = LexoRank.parse(prevTask.lexorank).genNext();
        parentTaskId = prevTask.parentTaskId;
      }
    }
    else if (dragSubToLeft) {
      // sub is guaranteed to not be first index in this block

      if (activeIndex === tasks.length - 1) {
        // sub is last task of the whole array
        const parent = tasks.find(t => t.id === activeTask.parentTaskId);
        newRank = LexoRank.parse(parent!.lexorank).genNext();
        parentTaskId = null;
      }

      else {
        const nextTask = tasks[activeIndex + 1];

        if (nextTask.parentTaskId === null) {
          // sub is last child of a group
          const parent = tasks.find(t => t.id === activeTask.parentTaskId);
          const parentRank = LexoRank.parse(parent!.lexorank);
          const nextRank = LexoRank.parse(nextTask.lexorank);
          newRank = parentRank.between(nextRank);
          parentTaskId = null;
        }
      }
    }
    else {
      // delta.x isn't big enough (bigger than indent) to change level
      return;
    }
  }
  else {
    // there are order changes
    let levelChange: LevelChange;

    if (activeIsBase) {
      if (delta.x > indent)
        levelChange = 'base-to-sub';
      else levelChange = 'base-to-base';
    }
    else {
      if (delta.x < -indent)
        levelChange = 'sub-to-base';
      else levelChange = 'sub-to-sub';
    }

    if (levelChange.endsWith('to-sub') && activeTask.subTasks.length > 0) {
      // disallow active to be sub if active has children
      return;
    }

    const overIndex = tasks.findIndex(t => t.id === over!.id);
    const overTask = tasks[overIndex];
    const overIsBase = overTask.parentTaskId === null;

    if (overIndex === 0) {
      // drag to first
      // over can only be base
      // active can only be base, levelChange and delta.x is irrelevant
      const overRank = LexoRank.parse(overTask.lexorank);
      newRank = overRank.genPrev();
      parentTaskId = null;
    }

    else if (overIndex === tasks.length - 1) {
      // drag to last
      // over can be base or sub, active can be base or sub
      if (overIsBase) {
        // 1. over is base
        if (levelChange.endsWith('to-base')) {
          // a. active: base --> call genNext() on over as usual
          newRank = LexoRank.parse(overTask.lexorank).genNext();
          parentTaskId = null;
        }
        else {
          // b. active: sub --> active will be over's first and only child, update active's rank & parentTaskId
          newRank = LexoRank.middle();
          parentTaskId = overTask.id;
        }
      }
      else {
        // 2. over is sub
        if (levelChange.endsWith('to-base')) {
          // a. active: base --> find over's parent, call genNext() on its rank, set active's `parentTaskId` to null
          const overParent = tasks.find(t => t.id === overTask.parentTaskId);
          const overParentRank = LexoRank.parse(overParent!.lexorank);
          newRank = overParentRank.genNext();
          parentTaskId = null;
        }
        else {
          // b. active: sub --> call genNext() on over, set active's `parentTaskId` to over's parent
          const overRank = LexoRank.parse(overTask.lexorank);
          newRank = overRank.genNext();
          parentTaskId = overTask.parentTaskId;
        }
      }
    }

    else {
      // drag to middle
      const dragDirection = delta.y > 0 ? 'down' : 'up';

      if (dragDirection === 'down') {
        const nextTask = tasks[overIndex + 1];
        const nextIsBase = nextTask.parentTaskId === null;

        if (overIsBase) {
          // 1. over: base
          if (nextIsBase) {
            // a. next: base
            if (levelChange.endsWith('to-base')) {
              // a1. active: base --> all base tasks, use `between` as usual
              const overRank = LexoRank.parse(overTask.lexorank);
              const nextRank = LexoRank.parse(nextTask.lexorank);
              newRank = overRank.between(nextRank);
              parentTaskId = null;
            }
            else {
              // a2. active: sub --> active will be over's first and only child
              newRank = LexoRank.middle();
              parentTaskId = overTask.id;
            }
          }
          else {
            // b. next: sub
            // ignore levelChange, active will always be over's first child (previously next is first child)
            const nextRank = LexoRank.parse(nextTask.lexorank);
            newRank = nextRank.genPrev();
            parentTaskId = overTask.id;
          }
        }
        else {
          // 2. over: sub
          if (nextIsBase) {
            // a. next: base
            if (levelChange.endsWith('to-base')) {
              // a1: active: base --> active will be between over's parent and next
              const overParent = tasks.find(t => t.id === overTask.parentTaskId);
              const overParentRank = LexoRank.parse(overParent!.lexorank);
              const nextTaskRank = LexoRank.parse(nextTask.lexorank);
              newRank = overParentRank.between(nextTaskRank);
              parentTaskId = null;
            }
            else {
              // a2: active: sub --> active will be last child of over's parent (previously next is the last child)
              const overParent = tasks.find(t => t.id === overTask.parentTaskId);
              newRank = LexoRank.parse(overTask.lexorank).genNext();
              parentTaskId = overParent!.id;
            }
          }
          else {
            // b. next: sub
            // ignore levelChange, active will always be sub, between over and next
            const overRank = LexoRank.parse(overTask.lexorank);
            const nextRank = LexoRank.parse(nextTask.lexorank);
            newRank = overRank.between(nextRank);
            parentTaskId = overTask.parentTaskId;
          }
        }
      }
      else {
        // dragging up
        const prevTask = tasks[overIndex - 1];
        const prevIsBase = prevTask.parentTaskId === null;

        if (prevIsBase) {
          // 1. prev: base
          if (overIsBase) {
            // a. over: base
            if (levelChange.endsWith('to-base')) {
              // a1. active: base, between prev and over as usual
              const prevRank = LexoRank.parse(prevTask.lexorank);
              const overRank = LexoRank.parse(overTask.lexorank);
              newRank = prevRank.between(overRank);
              parentTaskId = null;
            }
            else {
              // active: sub, active is prev's first and only child
              newRank = LexoRank.middle();
              parentTaskId = prevTask.id;
            }
          }
          else {
            // b. over: sub
            // ignore levelChange, active will always be prev's first child (previously over is first child)
            const overRank = LexoRank.parse(overTask.lexorank);
            newRank = overRank.genPrev();
            parentTaskId = prevTask.id;
          }
        }
        else {
          // 2. prev: sub
          if (overIsBase) {
            // a. over: base
            if (levelChange.endsWith('to-base')) {
              // a1. active: base
              // active is between prev's parent and over
              const prevParent = tasks.find(t => t.id === prevTask.parentTaskId);
              const prevParentRank = LexoRank.parse(prevParent!.lexorank);
              const overRank = LexoRank.parse(overTask.lexorank);
              newRank = prevParentRank.between(overRank);
              parentTaskId = null;
            }
            else {
              // a2. active: sub
              // active is prev's parent's last child
              const prevRank = LexoRank.parse(prevTask.lexorank);
              newRank = prevRank.genNext();
              parentTaskId = prevTask.parentTaskId;
            }
          }
          else {
            // b. over: sub
            // ignore levelChange, active will always be sub between prev and over
            const prevRank = LexoRank.parse(prevTask.lexorank);
            const overRank = LexoRank.parse(overTask.lexorank);
            newRank = prevRank.between(overRank);
            parentTaskId = prevTask.parentTaskId;
          }
        }
      }
    }
  }

  return {
    lexorank: newRank.toString(),
    parentTaskId,
  };
}

/**
 * Use in `Sidebar.tsx` for projects, or in `TaskModal.tsx` for subtasks only (no nesting)
 */
export function calcRank(event: DragEndEvent, items: ProjectScalar[] | TaskScalar[]) {
  const { active, over, delta } = event;
  const overIndex = items.findIndex(p => p.id === over!.id);
  const overProject = items[overIndex];
  const overRank = LexoRank.parse(overProject.lexorank);
  let newRank;

  if (active.id !== over!.id) {
    // drag to first
    if (overIndex === 0) {
      newRank = overRank.genPrev();
    }
    else if (overIndex === items.length - 1) {
      // drag to last
      newRank = LexoRank.parse(overProject.lexorank).genNext();
    }
    else {
      // drag to middle
      const dragDirection = delta.y > 0 ? 'down' : 'up';

      if (dragDirection === 'down') {
        // active is between over and next
        const nextProject = items[overIndex + 1];
        const nextRank = LexoRank.parse(nextProject.lexorank);
        newRank = overRank.between(nextRank);
      }
      else {
        // drag up
        // active is between prev and over
        const prevProject = items[overIndex - 1];
        const prevRank = LexoRank.parse(prevProject.lexorank);
        newRank = prevRank.between(overRank);
      }
    }
  }

  return newRank?.toString();
}
