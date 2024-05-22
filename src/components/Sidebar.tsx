import { Icon } from '@iconify/react';
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import useProjects from '../queries/useProjects';
import useUser from '../queries/useUser';
import CreateProjectButton from './CreateProjectButton';
import LoadingScreen from './LoadingScreen';
import ProjectBtn from './ProjectBtn';
import UserAvatar from './UserAvatar';

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
    <nav className="sticky top-0 flex h-screen w-72 flex-col px-2 py-4 outline outline-default-100">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="ghost" isIconOnly className="w-fit rounded-full p-0">
            <UserAvatar />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="User Options">
          <DropdownSection title={user?.email} showDivider>
            <DropdownItem
              startContent={(<Icon icon="material-symbols:settings" className="text-lg" />)}
              key="settings"
            >
              Settings
            </DropdownItem>
          </DropdownSection>
          <DropdownSection aria-label="Danger zone">
            <DropdownItem
              onPress={() => signOutMutation.mutate()}
              startContent={(<Icon icon="material-symbols:exit-to-app" className="text-lg" />)}
              key="signout"
              className="text-danger"
              color="danger"
            >
              Sign out
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <Divider className="my-4" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="text-xs text-default-500">My Projects</p>
          <CreateProjectButton />
        </div>
        {isLoading && <LoadingScreen />}
        {projects && projects.map(project => <ProjectBtn project={project} key={project.id} />)}
      </div>
    </nav>
  );
}
