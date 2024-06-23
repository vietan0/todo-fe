import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDisclosure } from '@nextui-org/react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import CreateTaskButton from '../components/CreateTaskButton';
import LoadingScreen from '../components/LoadingScreen';
import QueryError from '../components/QueryError';
import SortableTask from '../components/SortableTask';
import useUpdateTaskMutation from '../mutations/useUpdateTaskMutation';
import useProject from '../queries/useProject';
import { sortTasks } from '../utils/sortTasks';
import TaskModal from './TaskModal';

import type { DragEndEvent } from '@dnd-kit/core';

export default function Project() {
  const { projectId, taskId } = useParams<'projectId' | 'taskId'>();
  const { data: project, isLoading, error } = useProject(projectId);

  const {
    isOpen: isTaskModalOpen,
    onOpen: onTaskModalOpen,
    onOpenChange: onTaskModalOpenChange,
  } = useDisclosure({ defaultOpen: Boolean(taskId) });

  const updateTaskMutation = useUpdateTaskMutation();

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;

    if (project && over && active.id !== over.id) {
      updateTaskMutation.mutate({
        data: sortTasks(active, over, project),
        taskId: active.id as string,
      });
    }
  }

  const sensors = useSensors(useSensor(PointerSensor));

  if (isLoading)
    return <LoadingScreen />;

  if (error)
    return <QueryError error={error} queryName="useProject" />;

  if (project) {
    return (
      <div className="flex flex-col gap-4">
        <Helmet>
          <title>
            {project.name}
            {' '}
            – Todo App
          </title>
        </Helmet>
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <CreateTaskButton />
        <div className="flex flex-col gap-3">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext
              items={project.tasks}
              strategy={verticalListSortingStrategy}
            >
              {project.tasks.map(task => <SortableTask key={task.id} onTaskModalOpen={onTaskModalOpen} task={task} />)}
            </SortableContext>
          </DndContext>
        </div>
        {taskId && <TaskModal isOpen={isTaskModalOpen} onOpenChange={onTaskModalOpenChange} />}
      </div>
    );
  }
}
