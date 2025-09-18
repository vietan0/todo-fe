import type { DragEndEvent, DragMoveEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import type { Project, Task } from '../types/dataSchemas';
import { closestCorners, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Helmet } from '@dr.pogodin/react-helmet';
import { BreadcrumbItem, Breadcrumbs, Button, Checkbox, CircularProgress, Modal, ModalBody, ModalContent, ModalHeader, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import removeMarkdown from 'markdown-to-text';
import { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useParams } from 'react-router';
import CreateTaskButton from '../components/CreateTaskButton';
import CustomMarkdown from '../components/CustomMarkdown';
import DeleteTaskButton from '../components/DeleteTaskButton';
import LoadingScreen from '../components/LoadingScreen';
import QueryError from '../components/QueryError';
import SortableTask from '../components/SortableTask';
import TaskForm from '../components/TaskForm';
import UpdateTaskButton from '../components/UpdateTaskButton';
import useUpdateTaskMutation, { optimisticUpdateSubTask } from '../mutations/useUpdateTaskMutation';
import useTask from '../queries/useTask';
import { calcRank } from '../utils/calcRank';
import cn from '../utils/cn';

dayjs.extend(relativeTime);

export default function TaskModal({ isOpen, onOpen, onOpenChange, onClose, projectState }: {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onClose: () => void;
  projectState: Project;
}) {
  const { projectId, taskId } = useParams<'projectId' | 'taskId'>();
  const nav = useNavigate();
  const { data: task, isLoading, error } = useTask(taskId);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [deltaX, setDeltaX] = useState(0);
  const [taskState, setTaskState] = useState(task);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 15 } }));
  const updateTaskMutation = useUpdateTaskMutation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isXs = useMediaQuery({ query: '(min-width: 400px)' });

  const [completedSubCount, subCount] = useMemo(() => {
    const subCount = taskState?.subTasks.length || 0;
    const completedSubCount = taskState?.subTasks.filter(t => t.completed).length || 0;

    return [completedSubCount, subCount];
  }, [taskState]);

  useEffect(() => {
    setTaskState(task);
  }, [task]);

  useEffect(() => {
    if (!isOpen)
      nav(`/project/${projectId}`);
  }, [isOpen]);

  function handleDragStart(event: DragStartEvent): void {
    setActiveId(event.active.id);
  }

  function handleDragMove(event: DragMoveEvent): void {
    setDeltaX(event.delta.x);
  }

  function handleDragEnd(event: DragEndEvent): void {
    setActiveId(null);
    setDeltaX(0);

    if (event.over) {
      const lexorank = calcRank(event, task!.subTasks);

      // update state so dndkit can update immediately
      if (lexorank) {
        const updatedTaskState = optimisticUpdateSubTask(taskState!, { lexorank }, event.active.id as string);
        setTaskState(updatedTaskState);

        updateTaskMutation.mutate({
          data: { lexorank },
          taskId: event.active.id as string,
        });
      }
    }
  }

  function handleDragCancel() {
    setActiveId(null);
    setDeltaX(0);
  }

  const [prevId, nextId] = useMemo(() => {
    if (projectState.tasks.length <= 1)
      // disable both arrows
      return [null, null];

    const taskIndex = projectState.tasks.findIndex(t => t.id === taskId);

    if (taskIndex === 0) {
      const nextId = projectState.tasks[1]!.id;

      return [null, nextId];
    }
    else if (taskIndex === projectState.tasks.length - 1) {
      const prevId = projectState.tasks[taskIndex - 1]!.id;

      return [prevId, null];
    }
    else {
      const nextId = projectState.tasks[taskIndex + 1]!.id;
      const prevId = projectState.tasks[taskIndex - 1]!.id;

      return [prevId, nextId];
    }
  }, [projectState, taskId]);

  return (
    <Modal
      classNames={{
        base: cn('h-[620px] overflow-hidden'),
        header: cn('flex justify-between gap-1 border-b-1 border-default-100 px-3 py-2 text-base'),
        body: cn('p-0'),
        footer: cn('px-5 py-3'),
      }}
      hideCloseButton
      isOpen={isOpen}
      onClick={e => e.stopPropagation()}
      onOpenChange={onOpenChange}
      onPointerDown={e => e.stopPropagation()}
      scrollBehavior="inside"
      size="4xl"
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex grow items-center gap-2" id="left">
            {task && (
              <Breadcrumbs
                itemClasses={{
                  item: 'max-w-[60px] xs:max-w-none overflow-hidden text-ellipsis',
                }}
                size="sm"
                variant={isXs ? 'solid' : 'light'}
              >
                <BreadcrumbItem
                  onPress={() => nav(`/project/${projectId}`)}
                  startContent={<Icon className="shrink-0" icon="material-symbols:category" />}
                >
                  {projectState.name}
                </BreadcrumbItem>
                {task.parentTaskId && (
                  <BreadcrumbItem
                    key={task.parentTaskId}
                    onPress={() => nav(`task/${task.parentTaskId}`)}
                  >
                    {removeMarkdown(projectState.tasks.find(t => t.id === task.parentTaskId)!.name)}
                  </BreadcrumbItem>
                )}
                <BreadcrumbItem
                  isCurrent
                  key={taskId}
                  onPress={() => nav(`task/${taskId}`)}
                >
                  {removeMarkdown(task.name)}
                </BreadcrumbItem>
              </Breadcrumbs>
            )}
            {isLoading && 'Loading...'}
            {error && 'Error'}
          </div>
          <div className="flex items-center gap-1" id="right">
            <Tooltip
              closeDelay={0}
              content="Previous task"
              delay={500}
            >
              <Button
                aria-label="Previous Task"
                className="ml-auto"
                isDisabled={!prevId}
                isIconOnly
                onPress={prevId ? () => nav(`task/${prevId}`) : undefined}
                radius="full"
                size="sm"
                variant="light"
              >
                <Icon className="h-5 w-5 text-xl text-default-700" icon="material-symbols:keyboard-arrow-up" />
              </Button>
            </Tooltip>
            <Tooltip
              closeDelay={0}
              content="Next task"
              delay={500}
            >
              <Button
                aria-label="Next Task"
                className="ml-auto"
                isDisabled={!nextId}
                isIconOnly
                onPress={nextId ? () => nav(`task/${nextId}`) : undefined}
                radius="full"
                size="sm"
                variant="light"
              >
                <Icon className="h-5 w-5 text-xl text-default-700" icon="material-symbols:keyboard-arrow-down" />
              </Button>
            </Tooltip>
            <Tooltip
              closeDelay={0}
              content="Close"
              delay={500}
            >
              <Button
                aria-label="Close modal"
                isIconOnly
                onPress={onClose}
                radius="full"
                size="sm"
                variant="light"
              >
                <Icon className="h-4 w-4 text-xl text-default-700" icon="material-symbols:close" />
              </Button>
            </Tooltip>
          </div>
        </ModalHeader>
        <ModalBody>
          {isLoading && <LoadingScreen />}
          {task && (
            <>
              <Helmet>
                <title>
                  {removeMarkdown(task.name)}
                  {' '}
                  – Todo App
                </title>
              </Helmet>
              <div className={`
                flex size-full flex-col
                sm:flex-row
              `}
              >
                <div className={`
                  flex grow flex-col gap-2 overflow-y-scroll p-2 pb-5
                  xs:p-4 xs:pb-10
                `}
                >
                  <div className="flex flex-col gap-2">
                    {task && (
                      <div className={`
                        flex items-start gap-1.5
                        xs:gap-3
                      `}
                      >
                        <Checkbox
                          classNames={{ wrapper: cn('mt-1.5 mr-0') }}
                          id={task.id}
                          isSelected={task.completed}
                          onValueChange={(isSelected: boolean) => {
                            updateTaskMutation.mutate({
                              data: { completed: isSelected },
                              taskId: task.id,
                            });
                          }}
                          radius="full"
                          size={isXs ? 'md' : 'sm'}
                        />
                        {isFormOpen
                          ? (
                              <TaskForm
                                finalIndent={0}
                                inModal
                                mode="update"
                                parentTaskId={undefined}
                                setIsFormOpen={setIsFormOpen}
                                task={task}
                              />
                            )
                          : (
                              <div
                                className="flex min-w-0 grow flex-col gap-2 text-sm"
                                onClick={() => setIsFormOpen(true)}
                              >
                                <div className="task-modal-name flex items-center">
                                  <CustomMarkdown>{task.name}</CustomMarkdown>
                                </div>
                                {task.body && <CustomMarkdown>{task.body}</CustomMarkdown>}
                              </div>
                            )}
                        {updateTaskMutation.isPending && (
                          <CircularProgress
                            aria-label="Loading"
                            classNames={{
                              base: 'ml-auto',
                              svg: cn('h-5 w-5'),
                            }}
                          />
                        )}
                      </div>
                    )}
                    {task.parentTaskId === null && <CreateTaskButton parentTaskId={task.id} />}
                  </div>
                  {task.subTasks.length > 0 && (
                    <div className="flex items-center gap-2">
                      <CircularProgress
                        aria-label="Completion Count"
                        classNames={{
                          svg: 'w-6 h-6',
                          indicator: 'stroke-primary',
                          track: 'stroke-white/10',
                        }}
                        size="sm"
                        strokeWidth={4}
                        value={(completedSubCount / subCount) * 100}
                      />
                      <span className="text-xs">
                        {completedSubCount}
                        {' '}
                        /
                        {' '}
                        {subCount}
                      </span>
                    </div>
                  )}
                  <DndContext
                    collisionDetection={closestCorners}
                    onDragCancel={handleDragCancel}
                    onDragEnd={handleDragEnd}
                    onDragMove={handleDragMove}
                    onDragStart={handleDragStart}
                    sensors={sensors}
                  >
                    <SortableContext
                      items={task.subTasks}
                      strategy={verticalListSortingStrategy}
                    >
                      {task.subTasks.map(subTask => (
                        <SortableTask
                          deltaX={subTask.id === activeId ? deltaX : 0} // ghost indentation, only apply to task being dragged
                          inModal
                          isTaskModalOpen={isOpen}
                          key={subTask.id}
                          onTaskModalOpen={onOpen}
                          task={subTask}
                        />
                      ))}
                    </SortableContext>
                    <DragOverlay>
                      {activeId && (
                        <SortableTask
                          deltaX={0}
                          isOverlay={true}
                          isTaskModalOpen={isOpen}
                          onTaskModalOpen={onOpen}
                          task={task.subTasks.find(t => t.id === activeId) as Task}
                        />
                      )}
                    </DragOverlay>
                  </DndContext>
                </div>
                <div className="flex min-w-60 flex-col gap-2 bg-default-100/75 p-4">
                  <div>
                    <p className="text-xs text-default-500">Project</p>
                    <div className="flex items-center gap-1">
                      <Icon className="shrink-0" icon="material-symbols:category" />
                      <p className="text-sm font-semibold">{projectState.name}</p>
                    </div>
                  </div>
                  <div className={`
                    flex flex-col gap-2
                    xs:flex-row
                    sm:flex-col
                  `}
                  >
                    <UpdateTaskButton setIsFormOpen={setIsFormOpen} />
                    <DeleteTaskButton task={task} />
                  </div>
                  <div className="mt-auto text-end">
                    <p
                      className="text-xs text-default-400"
                      title={dayjs(task.updatedAt).format('D MMM · h:mm A')}
                    >
                      Updated
                      {' '}
                      {dayjs(task.updatedAt).fromNow()}
                    </p>
                    <p
                      className="text-xs text-default-400"
                      title={dayjs(task.createdAt).format('D MMM · h:mm A')}
                    >
                      Created
                      {' '}
                      {dayjs(task.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          {error && <QueryError error={error} queryName="useTask" />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
