import { useParams } from 'react-router-dom';

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

  if (!project)
    return 'something wrong';
  const { tasks } = project;

  return (
    <div>
      <h1 className="text-3xl font-bold">{project.name}</h1>
      {tasks.map(task => <Task task={task} key={task.id} />)}
    </div>
  );
}
