import { Icon } from '@iconify/react';
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react';
import { Resizable } from 're-resizable';
import { useState } from 'react';

import useProjects from '../queries/useProjects';
import useSignOutMutation from '../queries/useSignOutMutation';
import useUser from '../queries/useUser';
import CreateProjectButton from './CreateProjectButton';
import LoadingScreen from './LoadingScreen';
import ProjectBtn from './ProjectBtn';
import UserAvatar from './UserAvatar';

export default function Sidebar({ isSidebarHidden, setIsSidebarHidden }: {
  isSidebarHidden: boolean;
  setIsSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: user } = useUser();
  const { data: projects, isLoading } = useProjects(user?.id);
  const signOutMutation = useSignOutMutation();
  const [width, setWidth] = useState(240);

  return (
    <Resizable
      as="nav"
      defaultSize={{ width: 240 }}
      size={{ width }}
      style={{
        marginLeft: isSidebarHidden ? -width : 0,
        visibility: isSidebarHidden ? 'hidden' : 'visible',
        opacity: isSidebarHidden ? 0 : 1,
      }}
      minWidth={220}
      maxWidth={380}
      onResizeStop={(e, direction, ref, d) => setWidth(width + d.width)}
      enable={{
        // only allow dragging from the right
        top: false,
        right: !isSidebarHidden,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      className="flex flex-col p-2 duration-75"
      handleStyles={{
        right: {
          width: 4,
        },
      }}
      handleClasses={{ right: 'bg-default-100 hover:bg-default-200 focus:bg-default-200' }}
    >
      <div className="flex items-center justify-between">
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              aria-label="User Menu"
              size="sm"
              radius="sm"
              variant="light"
            >
              <UserAvatar />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="User Options">
            <DropdownSection title={user?.email} showDivider>
              <DropdownItem
                startContent={<Icon icon="material-symbols:settings" className="text-lg" />}
                key="settings"
              >
                Settings
              </DropdownItem>
            </DropdownSection>
            <DropdownSection aria-label="Danger zone">
              <DropdownItem
                onPress={() => signOutMutation.mutate()}
                startContent={<Icon icon="material-symbols:exit-to-app" className="text-lg" />}
                key="signout"
                className="text-danger"
                color="danger"
              >
                Sign out
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
        <Button
          isIconOnly
          aria-label="Toggle Sidebar"
          size="sm"
          radius="sm"
          variant="light"
          className="p-0"
          onPress={() => setIsSidebarHidden(p => !p)}
        >
          <Icon icon="ph:sidebar-simple-fill" className="text-lg" />
        </Button>
      </div>
      <Divider className="my-2" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="text-xs text-default-500">My Projects</p>
          <CreateProjectButton />
        </div>
        {isLoading && <LoadingScreen />}
        {projects && projects.map(project => <ProjectBtn project={project} key={project.id} />)}
      </div>
    </Resizable>
  );
}
