import { useDisclosure } from '@nextui-org/react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import CreateTaskButton from '../components/CreateTaskButton';
import LoadingScreen from '../components/LoadingScreen';
import QueryError from '../components/QueryError';
import Task from '../components/Task';
import useProject from '../queries/useProject';
import TaskModal from './TaskModal';

export default function Project() {
  const { projectId, taskId } = useParams<'projectId' | 'taskId'>();
  const { data: project, isLoading, error } = useProject(projectId);

  const {
    isOpen: isTaskModalOpen,
    onOpen: onTaskModalOpen,
    onOpenChange: onTaskModalOpenChange,
  } = useDisclosure({ defaultOpen: Boolean(taskId) });

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
          {project.tasks.map(task => <Task key={task.id} onTaskModalOpen={onTaskModalOpen} task={task} />)}
        </div>
        {taskId && <TaskModal isOpen={isTaskModalOpen} onOpenChange={onTaskModalOpenChange} />}
      </div>
    );
  }
}
