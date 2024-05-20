import { Button } from '@nextui-org/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import useProjects from '../queries/useProjects';
import useUser from '../queries/useUser';
import { signOut } from '../queryFns/auth';
import LoadingScreen from './LoadingScreen';
import ProjectBtn from './ProjectBtn';

export default function Sidebar() {
  const { data: user } = useUser();
  const { data: projects, isLoading } = useProjects(user?.id);
  const queryClient = useQueryClient();

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUser'] });
    },
  });

  return (
    <nav className="sticky top-0 flex h-screen w-72 flex-col p-4 outline">
      <p className="font-bold">{user?.email}</p>
      <div className="flex flex-col gap-2">
        <Link className="underline" to="/">Home</Link>
        <Link className="underline" to="/signin">Sign In</Link>
        <Link className="underline" to="/signup">Sign Up</Link>
      </div>
      <Button onPress={() => signOutMutation.mutate()}>
        Sign Out
      </Button>
      Projects
      {isLoading && <LoadingScreen />}
      {projects && projects.map(project => <ProjectBtn project={project} key={project.id} />)}
    </nav>
  );
}
