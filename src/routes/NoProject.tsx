import { Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Navigate } from 'react-router-dom';

import useProjects from '../queries/useProjects';
import useUser from '../queries/useUser';

export default function NoProject() {
  const { data: user } = useUser();
  const { data: projects } = useProjects(user?.id);

  if (projects) {
    if (projects.length > 0)
      return <Navigate to={`/project/${projects[0].id}`} />;

    return (
      <div className="m-auto flex size-full min-h-96 items-center p-8">
        <p
          className="h-full max-w-[35ch] text-2xl"
          data-testid="NoProject"
        >
          Create your first project by clicking the
          <Button
            aria-label="Sample button"
            className="top-[2px] mx-2"
            isIconOnly
            size="md"
            startContent={<Icon className="text-xl text-default-500" icon="material-symbols:add" />}
            variant="ghost"
          />
          button on the left.
        </p>
      </div>
    );
  }
}
