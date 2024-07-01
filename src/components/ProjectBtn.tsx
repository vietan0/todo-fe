import { Icon } from '@iconify/react/dist/iconify.js';
import { Tooltip } from '@nextui-org/react';
import { forwardRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import cn from '../utils/cn';
import noop from '../utils/noop';
import ProjectActionBtn from './ProjectActionBtn';

import type { ProjectScalar } from '../types/dataSchemas';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { HTMLAttributes } from 'react';

type Props = Omit<HTMLAttributes<HTMLAnchorElement>, 'id'> & {
  attributes: DraggableAttributes;
  isDragging: boolean;
  isOverlay: boolean;
  listeners: SyntheticListenerMap | undefined;
  style: {
    transform: string | undefined;
    transition: string | undefined;
  };
  project: ProjectScalar;
};

const ProjectBtn = forwardRef<HTMLAnchorElement, Props>(({
  attributes,
  isDragging,
  isOverlay,
  listeners,
  style,
  project,
  ...props
}: Props, ref) => {
  const nav = useNavigate();
  const params = useParams<'projectId' | 'taskId'>();
  const isProjectSelected = params.projectId === project.id;
  const [isHover, setIsHover] = useState(false);

  function handleClick() {
    isProjectSelected || nav(`/project/${project.id}`);
  }

  return (
    <Tooltip
      content={project.name}
      delay={1000}
      placement="right"
    >
      <a
        ref={ref}
        {...attributes}
        {...listeners}
        {...props}
        className={cn(
          'justify-start pl-2 pr-0 hover:bg-default-100 focus:bg-default-100 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          isProjectSelected && 'bg-default/40',
          'group relative z-0 box-border inline-flex h-10 min-w-20 select-none appearance-none items-center gap-2 overflow-hidden whitespace-nowrap rounded-small text-small font-normal subpixel-antialiased outline-none tap-highlight-transparent transition-transform-colors-opacity [&>svg]:max-w-[theme(spacing.8)]',
          isDragging && 'z-50 cursor-grabbing',
          isOverlay && 'border border-primary',
        )}
        onBlur={isOverlay ? noop : () => setIsHover(false)}
        onClick={isOverlay ? noop : handleClick}
        onFocus={isOverlay ? noop : () => setIsHover(true)}
        onMouseEnter={isOverlay ? noop : () => setIsHover(true)}
        onMouseLeave={isOverlay ? noop : () => setIsHover(false)}
        style={style}
      >
        <Icon className="shrink-0 text-lg" icon="material-symbols:category" />
        <p className="w-full overflow-hidden text-ellipsis text-left">{project.name}</p>
        <ProjectActionBtn isHover={isHover} project={project} />
      </a>
    </Tooltip>
  );
},
);

export default ProjectBtn;
