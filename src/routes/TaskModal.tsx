import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import useTasks from '../queries/useTasks';

export default function TaskModal({ isOpen, onOpenChange }: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const params = useParams<'projectId' | 'taskId'>();
  const nav = useNavigate();
  const { data: tasks, isLoading } = useTasks(params.projectId);

  if (isLoading)
    return <LoadingScreen />;

  const task = tasks!.find(p => p.id === params.taskId);

  if (!task) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <p className="text-2xl">Can't find this task.</p>
        <div className="flex gap-4">
          <Button variant="ghost" color="primary">
            Retry
          </Button>
          <Button variant="ghost">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Modal
      size="4xl"
      scrollBehavior="inside"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">{task.name}</ModalHeader>
            <ModalBody>
              <pre>
                {JSON.stringify(task, null, 2)}
              </pre>
              <p>Subtasks:</p>
              <pre>{JSON.stringify(task.subTasks, null, 2)}</pre>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  onClose();
                  nav(-1);
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
