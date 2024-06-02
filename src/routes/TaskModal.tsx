import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import useTask from '../queries/useTask';

export default function TaskModal({ isOpen, onOpenChange }: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const params = useParams<'projectId' | 'taskId'>();
  const nav = useNavigate();
  const { data: task, isLoading } = useTask(params.taskId);

  useEffect(() => {
    if (!isOpen)
      nav(-1);
  }, [isOpen]);

  if (isLoading)
    return <LoadingScreen />;

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
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={onClose}
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
