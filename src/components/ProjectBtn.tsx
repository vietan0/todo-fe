import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { HTMLAttributes } from 'react';
import type { ProjectScalar } from '../types/dataSchemas';
import { Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import cn from '../utils/cn';
import ProjectActionBtn from './ProjectActionBtn';

type Props = Omit<HTMLAttributes<HTMLDivElement>, 'id'> & {
  attributes: DraggableAttributes;
  isDragging: boolean;
  isOverlay: boolean;
  listeners: SyntheticListenerMap | undefined;
  ref: React.Ref<HTMLDivElement>;
  style: {
    transform: string | undefined;
    transition: string | undefined;
  };
  project: ProjectScalar;
};

export default function ProjectBtn({
  attributes,
  isDragging,
  isOverlay,
  listeners,
  style,
  project,
  ...props
}: Props) {
  const nav = useNavigate();
  const params = useParams<'projectId' | 'taskId'>();
  const isProjectSelected = params.projectId === project.id;
  const [isHover, setIsHover] = useState(false);

  function handleClick() {
    isProjectSelected || nav(`/project/${project.id}`);
  }

  return (
    <Tooltip
      closeDelay={0}
      content={project.name}
      delay={1000}
      placement="right"
    >
      <div
        {...attributes}
        {...listeners}
        {...props}
        className={cn(
          `
            group relative z-0 box-border inline-flex h-10 min-w-20 appearance-none items-center gap-2 overflow-hidden
            rounded-lg text-sm font-normal whitespace-nowrap subpixel-antialiased outline-hidden select-none
            tap-highlight-transparent
            [&>svg]:max-w-8
          `, // copied HeroUI Button's styles
          `
            w-full cursor-pointer justify-start pr-0 pl-2
            hover:bg-default-100
            focus:bg-default-100
            focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus
          `,
          isProjectSelected && 'bg-default/40',
          isOverlay && 'z-50 cursor-grabbing border border-primary',
        )}
        onBlur={isOverlay ? undefined : () => setIsHover(false)}
        onClick={isOverlay ? undefined : handleClick}
        onFocus={isOverlay ? undefined : () => setIsHover(true)}
        onMouseEnter={isOverlay ? undefined : () => setIsHover(true)}
        onMouseLeave={isOverlay ? undefined : () => setIsHover(false)}
        style={style}
      >
        <Icon className="shrink-0 text-lg" icon="material-symbols:category" />
        <p className="w-full overflow-hidden text-left text-ellipsis">{project.name}</p>
        <ProjectActionBtn isHover={isHover} project={project} />
      </div>
    </Tooltip>
  );
}
