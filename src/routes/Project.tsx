import { DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDisclosure } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import CreateTaskButton from '../components/CreateTaskButton';
import LoadingScreen from '../components/LoadingScreen';
import QueryError from '../components/QueryError';
import SortableTask from '../components/SortableTask';
import useUpdateTaskMutation, { optimisticUpdate } from '../mutations/useUpdateTaskMutation';
import useProject from '../queries/useProject';
import { calcRankAfterDragged } from '../utils/calcRankAfterDragged';
import TaskModal from './TaskModal';

import type { Task as TaskT } from '../types/dataSchemas';
import type { DragEndEvent, DragMoveEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';

export default function Project() {
  const { projectId, taskId } = useParams<'projectId' | 'taskId'>();
  const { data: project, isLoading, error } = useProject(projectId);
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
          prev!.tasks = filteredTasks;

          return prev;
        });
      }
    }
  }, [activeId]);

  const {
    isOpen: isTaskModalOpen,
    onOpen: onTaskModalOpen,
    onOpenChange: onTaskModalOpenChange,
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
      const payload = calcRankAfterDragged(event, project);

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
      <div className="flex flex-col gap-4">
        <Helmet>
          <title>
            {projectState.name}
            {' '}
            – Todo App
          </title>
        </Helmet>
        <h1 className="text-2xl font-bold">{projectState.name}</h1>
        <CreateTaskButton />
        <div className="flex flex-col gap-3">
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
                  onTaskModalOpen={onTaskModalOpen}
                  task={projectState.tasks.find(t => t.id === activeId) as TaskT}
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
        {taskId && <TaskModal isOpen={isTaskModalOpen} onOpenChange={onTaskModalOpenChange} />}
      </div>
    );
  }
}
