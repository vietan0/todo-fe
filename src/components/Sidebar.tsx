import { Icon } from '@iconify/react';
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Tooltip } from '@nextui-org/react';
import { Resizable } from 're-resizable';
import { useState } from 'react';

import useSignOutMutation from '../mutations/useSignOutMutation';
import useProjects from '../queries/useProjects';
import useUser from '../queries/useUser';
import CreateProjectButton from './CreateProjectButton';
import LoadingScreen from './LoadingScreen';
import ProjectBtn from './ProjectBtn';
import QueryError from './QueryError';
import UserAvatar from './UserAvatar';

export default function Sidebar({ isSidebarHidden, setIsSidebarHidden }: {
  isSidebarHidden: boolean;
  setIsSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: user } = useUser();
  const { data: projects, isLoading, error } = useProjects(user?.id);
  const signOutMutation = useSignOutMutation();
  const [width, setWidth] = useState(240);

  return (
    <Resizable
      as="nav"
      className="flex duration-75"
      defaultSize={{ width: 240 }}
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
      handleClasses={{ right: 'bg-default-100 hover:bg-default-300 focus:bg-default-300' }}
      handleStyles={{
        right: {
          width: 4,
          right: 0,
        },
      }}
      maxWidth={400}
      minWidth={200}
      onResizeStop={(e, direction, ref, d) => setWidth(width + d.width)}
      size={{ width, height: '100vh' }}
      style={{
        marginLeft: isSidebarHidden ? -width : 0,
        visibility: isSidebarHidden ? 'hidden' : 'visible',
        opacity: isSidebarHidden ? 0 : 1,
      }}
    >
      <div className="flex h-screen w-full flex-col overflow-y-scroll p-2" id="NavContent">
        <div className="flex items-center justify-between">
          <Dropdown>
            <DropdownTrigger>
              <Button
                aria-label="User Menu"
                isIconOnly
                radius="sm"
                size="sm"
                variant="light"
              >
                <UserAvatar />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Options">
              <DropdownSection showDivider title={user?.email}>
                <DropdownItem
                  key="settings"
                  startContent={<Icon className="text-lg" icon="material-symbols:settings" />}
                >
                  Settings
                </DropdownItem>
              </DropdownSection>
              <DropdownSection aria-label="Danger zone">
                <DropdownItem
                  className="text-danger"
                  color="danger"
                  key="signout"
                  onPress={() => signOutMutation.mutate()}
                  startContent={<Icon className="text-lg" icon="material-symbols:exit-to-app" />}
                >
                  Sign out
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
          <Tooltip
            content="Toggle Sidebar"
            delay={500}
          >
            <Button
              aria-label="Toggle Sidebar"
              className="p-0"
              isIconOnly
              onPress={() => setIsSidebarHidden(p => !p)}
              radius="sm"
              size="sm"
              variant="light"
            >
              <Icon className="text-lg" icon="ph:sidebar-simple-fill" />
            </Button>
          </Tooltip>
        </div>
        <Divider className="my-2" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-default-500">My Projects</p>
            <CreateProjectButton />
          </div>
          {isLoading && <LoadingScreen />}
          {error && <QueryError error={error} queryName="useProjects" />}
          {projects && projects.map(project => <ProjectBtn key={project.id} project={project} />)}
        </div>
      </div>
    </Resizable>
  );
}
