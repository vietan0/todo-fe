/* eslint-disable tailwindcss/enforces-shorthand */
import { DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Icon } from '@iconify/react/dist/iconify.js';
import { BreadcrumbItem, Breadcrumbs, Button, Checkbox, CircularProgress, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import CreateTaskButton from '../components/CreateTaskButton';
import LoadingScreen from '../components/LoadingScreen';
import MutationError from '../components/MutationError';
import QueryError from '../components/QueryError';
import SortableTask from '../components/SortableTask';
import TaskForm from '../components/TaskForm';
import useDeleteTaskMutation from '../mutations/useDeleteTaskMutation';
import useUpdateTaskMutation, { optimisticUpdateSubTask } from '../mutations/useUpdateTaskMutation';
import useTask from '../queries/useTask';
import calcSubTaskRankAfterDragged from '../utils/calcSubTaskRankAfterDragged';
import cn from '../utils/cn';

import type { Project, Task } from '../types/dataSchemas';
import type { DragEndEvent, DragMoveEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';

dayjs.extend(relativeTime);

export default function TaskModal({ isOpen, onOpen, onOpenChange, projectState }: {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
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
  const deleteTaskMutation = useDeleteTaskMutation(taskId!);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    isOpen: isDeleteTaskOpen,
    onOpen: onDeleteTaskOpen,
    onOpenChange: onDeleteTaskOpenChange,
  } = useDisclosure();

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
      const lexorank = calcSubTaskRankAfterDragged(event, task!.subTasks);
      // update state so dndkit can update immediately
      const updatedTaskState = optimisticUpdateSubTask(taskState!, { lexorank }, event.active.id as string);
      setTaskState(updatedTaskState);

      if (lexorank) {
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
        base: cn('h-[560px] overflow-hidden'),
        header: cn('flex justify-between gap-1 border-b-1 border-default-100 px-3 py-3 pl-5 text-medium'),
        body: cn('p-0'),
        footer: cn('px-5 py-3'),
      }}
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      size="4xl"
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>
              <div className="flex grow gap-2" id="left">
                {task
                && (
                  <>
                    {isFormOpen
                      ? (
                        <TaskForm
                          inModal
                          mode="update"
                          parentTaskId={undefined}
                          setIsFormOpen={setIsFormOpen}
                          task={task}
                        />
                        )
                      : (
                        <div className="flex gap-2">
                          <Checkbox
                            classNames={{
                              icon: cn('flex items-center'),
                              base: cn('outline-1 outline-red-400'),
                              wrapper: cn('mr-0'),
                            }}
                            id={task.id}
                            isSelected={task.completed}
                            onValueChange={
                            (isSelected: boolean) => {
                              updateTaskMutation.mutate({
                                data: { completed: isSelected },
                                taskId: task.id,
                              });
                            }
                          }
                            radius="full"
                          />
                          <p
                            className="flex items-center"
                            onClick={() => setIsFormOpen(true)}
                          >
                            {task.name}
                          </p>
                          {updateTaskMutation.isPending && (
                            <CircularProgress
                              aria-label="Loading"
                              classNames={{
                                svg: cn('h-5 w-5'),
                              }}
                            />
                          )}
                        </div>
                        )}
                  </>
                )}
                {isLoading && 'Loading...'}
                {error && 'Error'}
              </div>
              <div className="flex gap-1" id="right">
                <Tooltip
                  closeDelay={0}
                  content="Previous task"
                  delay={500}
                >
                  <Button
                    aria-label="Previous Task"
                    className="ml-auto"
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
                      {task.name}
                      {' '}
                      – Todo App
                    </title>
                  </Helmet>
                  <div className="flex size-full">
                    <div className="flex grow flex-col gap-2 overflow-y-scroll p-4">
                      <Breadcrumbs size="sm" variant="solid">
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
                            {projectState.tasks.find(t => t.id === task.parentTaskId)!.name}
                          </BreadcrumbItem>
                        )}
                        <BreadcrumbItem
                          isCurrent
                          key={taskId}
                          onPress={() => nav(`task/${taskId}`)}
                        >
                          {task.name}
                        </BreadcrumbItem>
                      </Breadcrumbs>
                      {task.parentTaskId === null && <CreateTaskButton parentTaskId={task.id} />}
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
                      ) }
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
                    <div className="flex w-60 flex-col gap-2 bg-default-100/75 p-4">
                      <div>
                        <p className="text-xs text-default-500">Project</p>
                        <div className="flex items-center gap-1">
                          <Icon className="shrink-0" icon="material-symbols:category" />
                          <p className="text-sm font-semibold">{projectState.name}</p>
                        </div>
                      </div>
                      <Button
                        aria-label="Edit Task"
                        className="min-w-0 justify-start data-[hover=true]:bg-default/60"
                        disableAnimation
                        onPress={() => setIsFormOpen(true)}
                        radius="sm"
                        size="sm"

                        startContent={<Icon className="h-5 w-5 text-xl text-default-700" icon="material-symbols:edit" />}
                        variant="ghost"
                      >
                        Edit Task
                      </Button>
                      <Button
                        aria-label="Delete Task"
                        className="min-w-0 justify-start data-[hover=true]:bg-default/60"
                        disableAnimation
                        onPress={onDeleteTaskOpen}
                        radius="sm"
                        size="sm"

                        startContent={<Icon className="h-5 w-5 text-xl text-default-700" icon="material-symbols:delete" />}
                        variant="ghost"
                      >
                        Delete Task
                      </Button>
                      <Modal
                        classNames={{
                          footer: cn('mt-6 flex-col'),
                        }}
                        isOpen={isDeleteTaskOpen}
                        onOpenChange={onDeleteTaskOpenChange}
                      >
                        <ModalContent>
                          {onClose => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">
                                Are you sure you want to delete task "
                                {task.name}
                                "? This can't be reversed.
                              </ModalHeader>
                              <ModalBody>
                              </ModalBody>
                              <ModalFooter>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    color="default"
                                    onPress={onClose}
                                    variant="light"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    color="danger"
                                    isLoading={deleteTaskMutation.isPending}
                                    onPress={() => {
                                      deleteTaskMutation.mutate();
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                                {deleteTaskMutation.error
                                && (
                                  <MutationError
                                    error={deleteTaskMutation.error}
                                    mutationName="deleteTask"
                                  />
                                )}
                              </ModalFooter>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
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
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
