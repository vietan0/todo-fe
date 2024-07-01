import { DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Icon } from '@iconify/react';
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Tooltip } from '@nextui-org/react';
import { Resizable } from 're-resizable';
import { useEffect, useState } from 'react';

import useSignOutMutation from '../mutations/useSignOutMutation';
import useUpdateProjectMutation, { optimisticUpdate } from '../mutations/useUpdateProjectMutation';
import useProjects from '../queries/useProjects';
import useUser from '../queries/useUser';
import calcProjectRankAfterDragged from '../utils/calcProjectRankAfterDraggged';
import CreateProjectButton from './CreateProjectButton';
import LoadingScreen from './LoadingScreen';
import QueryError from './QueryError';
import SortableProjectBtn from './SortableProjectBtn';
import UserAvatar from './UserAvatar';

import type { ProjectScalar } from '../types/dataSchemas';
import type { DragEndEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';

export default function Sidebar({ isSidebarHidden, setIsSidebarHidden }: {
  isSidebarHidden: boolean;
  setIsSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: user } = useUser();
  const { data: projects, isLoading, error } = useProjects(user?.id);
  const signOutMutation = useSignOutMutation();
  const [width, setWidth] = useState(240);
  const [projectsState, setProjectsState] = useState(projects);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 15 } }));
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const updateProjectMutation = useUpdateProjectMutation();

  function handleDragStart(event: DragStartEvent): void {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent): void {
    setActiveId(null);

    if (projects && event.over) {
      const lexorank = calcProjectRankAfterDragged(event, projects);

      if (lexorank) {
        // update state so dndkit can update immediately
        const updatedProjectsState = optimisticUpdate(projectsState!, { lexorank }, event.active.id as string);
        setProjectsState(updatedProjectsState);

        // send request
        updateProjectMutation.mutate({
          data: { lexorank },
          projectId: event.active.id as string,
        });
      }
    }
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  useEffect(() => {
    setProjectsState(projects);
  }, [projects]);

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
        <Divider className="my-2 bg-default-100" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-default-500">My Projects</p>
            <CreateProjectButton />
          </div>
          {isLoading && <LoadingScreen />}
          {error && <QueryError error={error} queryName="useProjects" />}
          {projectsState
          && (
            <DndContext
              collisionDetection={closestCorners}
              onDragCancel={handleDragCancel}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              sensors={sensors}
            >
              <SortableContext
                items={projectsState}
                strategy={verticalListSortingStrategy}
              >
                {projectsState.map(project => <SortableProjectBtn key={project.id} project={project} />)}
              </SortableContext>
              <DragOverlay>
                {activeId && (
                  <SortableProjectBtn
                    isOverlay={true}
                    project={projectsState.find(t => t.id === activeId) as ProjectScalar}
                  />
                )}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>
    </Resizable>
  );
}
