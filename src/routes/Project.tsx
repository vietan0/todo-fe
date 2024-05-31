import { Button } from '@nextui-org/react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import Task from '../components/Task';
import useProjects from '../queries/useProjects';
import useUser from '../queries/useUser';

export default function Project() {
  const params = useParams();
  const { data: user } = useUser();
  const { data: projects, isLoading } = useProjects(user?.id);

  if (isLoading)
    return <LoadingScreen />;

  const project = projects!.find(p => p.id === params.projectId);

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

  const { tasks } = project;

  return (
    <>
      <Helmet>
        <title>
          {project.name}
          {' '}
          – Todo App
        </title>
      </Helmet>
      <h1 className="text-3xl font-bold">{project.name}</h1>
      <div className="flex flex-col gap-4">
        {tasks.map(task => <Task task={task} key={task.id} />)}
      </div>
    </>
  );
}
