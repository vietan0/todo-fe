import type { DragEndEvent, DragMoveEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import type { Task as TaskT } from '../types/dataSchemas';
import type { OutletContext } from './Home';
import { closestCorners, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button, Tooltip, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router';
import CreateTaskButton from '../components/CreateTaskButton';
import LoadingScreen from '../components/LoadingScreen';
import QueryError from '../components/QueryError';
import SortableTask from '../components/SortableTask';
import useUpdateTaskMutation, { optimisticUpdate } from '../mutations/useUpdateTaskMutation';
import useProject from '../queries/useProject';
import useUser from '../queries/useUser';
import { calcNestedRank } from '../utils/calcRank';
import cn from '../utils/cn';
import TaskModal from './TaskModal';

const variants = {
  enter: { y: 30, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: 30, opacity: 0 },
};

export default function Project() {
  const { data: user } = useUser();
  const { projectId, taskId } = useParams<'projectId' | 'taskId'>();
  const { data: project, isLoading, error } = useProject(projectId);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [deltaX, setDeltaX] = useState(0);
  /*
    Although I don't need to use state since I'm already using Tanstack Query,
    because updating query data when something is dragged is not smooth,
    I add a state layer to display UI, like a manual optimistic update.
   */
  const [projectState, setProjectState] = useState(project);

  useEffect(() => {
    setProjectState(project);
  }, [project]);

  useEffect(() => {
    // hide subtasks when a parent is being dragged
    if (activeId) {
      const activeTask = projectState?.tasks.find(t => t.id === activeId) as TaskT;
      const children = activeTask.subTasks;

      if (children.length > 0) {
        setProjectState((prev) => {
          const filteredTasks = prev!.tasks.filter(t => t.parentTaskId !== activeId);

          return {
            ...prev!,
            tasks: filteredTasks,
          };
        });
      }
    }
    else {
      setProjectState(project);
    }
  }, [activeId]);

  const { mainRef, isSidebarHidden, setIsSidebarHidden } = useOutletContext<OutletContext>();

  useEffect(() => {
    // attach event listener to main content
    function scrollListener(e: Event) {
      const mainContent = e.target as HTMLDivElement;
      setScrolled(mainContent.scrollTop > 0);
    }

    mainRef.current?.addEventListener('scroll', scrollListener);

    return () => mainRef.current?.removeEventListener('scroll', scrollListener);
  }, [mainRef, user]);

  const {
    isOpen: isTaskModalOpen,
    onOpen: onTaskModalOpen,
    onOpenChange: onTaskModalOpenChange,
    onClose: onTaskModalClose,
  } = useDisclosure({ defaultOpen: Boolean(taskId) });

  const updateTaskMutation = useUpdateTaskMutation();

  function handleDragStart(event: DragStartEvent): void {
    setActiveId(event.active.id);
  }

  function handleDragMove(event: DragMoveEvent): void {
    setDeltaX(event.delta.x);
  }

  function handleDragEnd(event: DragEndEvent): void {
    setActiveId(null);
    setDeltaX(0);

    if (project && event.over) {
      const payload = calcNestedRank(event, project.tasks);

      if (payload) {
        // update state so dndkit can update immediately
        const updatedProjectState = optimisticUpdate(projectState!, payload, event.active.id as string);
        setProjectState(updatedProjectState);

        // send request
        updateTaskMutation.mutate({
          data: payload,
          taskId: event.active.id as string,
        });

        // state with sync with cache when request is settled (in useEffect), whether successful or failed
      }
    }
  }

  function handleDragCancel() {
    setActiveId(null);
    setDeltaX(0);
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 15 } }));

  if (isLoading)
    return <LoadingScreen />;

  if (error)
    return <QueryError error={error} queryName="useProject" />;

  if (projectState) {
    return (
      <>
        <Helmet>
          <title>
            {projectState.name}
            {' '}
            – Todo App
          </title>
        </Helmet>
        <div className={cn(
          'sticky top-0 z-10 flex items-center justify-between overflow-hidden bg-default-50 p-2',
          scrolled && 'shadow-[0_1px_0_0] shadow-default-100',
        )}
        >
          {isSidebarHidden && (
            <Tooltip
              closeDelay={0}
              content="Toggle Sidebar"
              delay={500}
            >
              <Button
                aria-label="Toggle Sidebar"
                className="p-0"
                isIconOnly
                onPress={() => setIsSidebarHidden(p => !p)}
                radius="sm"
                size="sm"
                variant="light"
              >
                <Icon className="text-xl" icon="ph:sidebar-simple-fill" />
              </Button>
            </Tooltip>
          )}
          <AnimatePresence mode="popLayout">
            {projectState && scrolled
              && (
                <motion.p
                  animate="center"
                  className="grow text-center font-bold"
                  exit="exit"
                  initial="enter"
                  transition={{
                    type: 'spring',
                    duration: 0.3,
                    bounce: 0.5,
                  }}
                  variants={variants}
                >
                  {projectState.name}
                </motion.p>
              )}
          </AnimatePresence>
          <Button
            aria-label="More"
            className="ml-auto p-0"
            isIconOnly
            radius="sm"
            size="sm"
            variant="light"
          >
            <Icon className="text-xl" icon="material-symbols:more-horiz" />
          </Button>
        </div>
        <div className={`
          flex flex-col gap-4 px-4 py-2
          xs:px-8
        `}
        >
          <h1 className="text-2xl font-bold">{projectState.name}</h1>
          <CreateTaskButton />
          <div className="flex flex-col gap-2">
            <DndContext
              collisionDetection={closestCorners}
              onDragCancel={handleDragCancel}
              onDragEnd={handleDragEnd}
              onDragMove={handleDragMove}
              onDragStart={handleDragStart}
              sensors={sensors}
            >
              <SortableContext
                items={projectState!.tasks}
                strategy={verticalListSortingStrategy}
              >
                {projectState!.tasks.map(task => (
                  <SortableTask
                    deltaX={task.id === activeId ? deltaX : 0} // ghost indentation, only apply to task being dragged
                    isTaskModalOpen={isTaskModalOpen}
                    key={task.id}
                    onTaskModalOpen={onTaskModalOpen}
                    task={task}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeId && (
                  <SortableTask
                    deltaX={0}
                    isOverlay={true}
                    isTaskModalOpen={isTaskModalOpen}
                    onTaskModalOpen={onTaskModalOpen}
                    task={projectState.tasks.find(t => t.id === activeId) as TaskT}
                  />
                )}
              </DragOverlay>
            </DndContext>
          </div>
          {taskId && (
            <TaskModal
              isOpen={isTaskModalOpen}
              onClose={onTaskModalClose}
              onOpen={onTaskModalOpen}
              onOpenChange={onTaskModalOpenChange}
              projectState={projectState}
            />
          )}
        </div>
      </>
    );
  }
}
