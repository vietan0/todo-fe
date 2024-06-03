import { Button, useDisclosure } from '@nextui-org/react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

import CreateTaskButton from '../components/CreateTaskButton';
import LoadingScreen from '../components/LoadingScreen';
import Task from '../components/Task';
import useProject from '../queries/useProject';
import TaskModal from './TaskModal';

export default function Project() {
  const { projectId, taskId } = useParams<'projectId' | 'taskId'>();
  const { data: project, isLoading } = useProject(projectId);

  const {
    isOpen: isTaskModalOpen,
    onOpen: onTaskModalOpen,
    onOpenChange: onTaskModalOpenChange,
  } = useDisclosure();

  if (isLoading)
    return <LoadingScreen />;

  if (!project) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <p className="text-2xl">Can't find this project.</p>
        <div className="flex gap-4">
          <Button variant="ghost" color="primary">
            Retry
          </Button>
          <Button variant="ghost">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`Project ${project.id}`}
      className="flex flex-col gap-4"
    >
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
        {project.tasks.map(task => <Task task={task} onTaskModalOpen={onTaskModalOpen} key={task.id} />)}
      </div>
      {taskId && <TaskModal isOpen={isTaskModalOpen} onOpenChange={onTaskModalOpenChange} />}
    </div>
  );
}
