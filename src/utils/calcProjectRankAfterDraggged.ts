import { LexoRank } from 'lexorank';

import type { ProjectScalar } from '../types/dataSchemas';
import type { DragEndEvent } from '@dnd-kit/core';

export default function calcProjectRankAfterDragged(event: DragEndEvent, projects: ProjectScalar[],
) {
  const { active, over, delta } = event;
  const overIndex = projects.findIndex(p => p.id === over!.id);
  const overProject = projects[overIndex];
  const overRank = LexoRank.parse(overProject.lexorank);
  let newRank;

  if (active.id !== over!.id) {
    // drag to first
    if (overIndex === 0) {
      newRank = overRank.genPrev();
    }
    else if (overIndex === projects.length - 1) {
      // drag to last
      newRank = LexoRank.parse(overProject.lexorank).genNext();
    }
    else {
      // drag to middle
      const dragDirection = delta.y > 0 ? 'down' : 'up';

      if (dragDirection === 'down') {
        // active is between over and next
        const nextProject = projects[overIndex + 1];
        const nextRank = LexoRank.parse(nextProject.lexorank);
        newRank = overRank.between(nextRank);
      }
      else {
        // drag up
        // active is between prev and over
        const prevProject = projects[overIndex - 1];
        const prevRank = LexoRank.parse(prevProject.lexorank);
        newRank = prevRank.between(overRank);
      }
    }
  }

  return newRank?.toString();
}
