import { Button } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import useProjects from '../hooks/useProjects';
import useUser from '../hooks/useUser';
import signOut from '../utils/signOut';
import ProjectBtn from './ProjectBtn';

export default function Sidebar() {
  const { data: user } = useUser();
  const { data: projects } = useProjects();
  const queryClient = useQueryClient();

  return (
    <nav className="sticky top-0 flex h-screen w-72 flex-col p-4 outline">
      <p className="font-bold">{user?.email}</p>
      <div className="flex flex-col gap-2">
        <Link className="underline" to="/">Home</Link>
        <Link className="underline" to="/signin">Sign In</Link>
        <Link className="underline" to="/signup">Sign Up</Link>
      </div>
      <Button onPress={async () => {
        await signOut();
        queryClient.invalidateQueries({ queryKey: ['getUser'] });
      }}
      >
        Sign Out
      </Button>
      Projects
      {projects && projects.map(project => <ProjectBtn project={project} key={project.id} />)}
    </nav>
  );
}
