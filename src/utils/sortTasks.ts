import { LexoRank } from 'lexorank';

import type { Project } from '../types/dataSchemas';
import type { Active, Over } from '@dnd-kit/core';

export function sortTasks(active: Active, over: Over, project: Project) {
  const activeIndex = project.tasks.findIndex(t => t.id === active.id);
  const activeTask = project.tasks[activeIndex];
  // dragging will decide if active is to-be-base or sub
  // if active has children, move & animate the whole tree, disallow it to be sub
  const overIndex = project.tasks.findIndex(t => t.id === over.id);
  const overTask = project.tasks[overIndex];
  let newRank: LexoRank;
  let parentTaskId = activeTask.parentTaskId;

  if (overIndex === 0) {
    console.log('drag to first');
    // over can only be base
    // active can only be base, mutate `lexorank` and set parentTaskId to null
    // if active has children, move the whole group to first
    newRank = LexoRank.parse(overTask.lexorank).genPrev();
    parentTaskId = null;
  }

  else if (overIndex === project.tasks.length - 1) {
    console.log('drag to last');
    console.log('overTask', overTask);

    // over can be base or sub
    // active can be base or sub
    if (overTask.parentTaskId === null) {
      // 1. over: base
      //    a. active: base --> call genNext() on over as usual
      //    b. active: sub --> active will be over's first and only child, update active's rank & parentTaskId
    }
    else {
      // 2. over: sub
      //    a. active: base --> find over's parentTaskId, call genNext() on it, set active's `parentTaskId` to null
      //    b. active: sub --> call genNext() on over, set active's `parentTaskId` to over's parent
    }

    newRank = LexoRank.parse(overTask.lexorank).genNext();
  }

  else {
    console.log('drag to middle');
    const nextTask = project.tasks[overIndex + 1];
    // overTask can be base task or sub task
    // nextTask can be base task or sub task
    // 1. over: base
    //    a. next: base
    //        a1. active: base --> all base tasks, use `between` as usual
    //        a2. active: sub --> active will be over's first and only child
    //    b. next: sub
    //        b1. active: base --> disallow
    //        b2. active: sub --> active will be over's first child (previously sub is first child)
    // 2. over: sub
    //    a. next: base
    //        a1: active: base --> active will be between over's parent and next
    //        a2: active: sub --> active will be last child of over's parent
    //    b. next: sub
    //        b1: active: base --> disallow
    //        b2: active: sub --> active will be between over and next, as usual
    console.log('overTask', overTask);
    console.log('nextTask', nextTask);
    const overTaskRank = LexoRank.parse(overTask.lexorank);
    const nextTaskRank = LexoRank.parse(nextTask.lexorank);
    newRank = overTaskRank.between(nextTaskRank);
  }

  console.log('newRank', newRank.toString());
  console.log('parentTaskId', parentTaskId);

  return {
    lexorank: newRank.toString(),
    parentTaskId,
  };
}
