import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import QueryError from '../components/QueryError';
import useTask from '../queries/useTask';

export default function TaskModal({ isOpen, onOpenChange }: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const params = useParams<'projectId' | 'taskId'>();
  const nav = useNavigate();
  const { data: task, isLoading, error } = useTask(params.taskId);

  useEffect(() => {
    if (!isOpen)
      nav(`/project/${params.projectId}`);
  }, [isOpen]);

  if (isLoading)
    return <LoadingScreen />;

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
            <ModalHeader className="flex flex-col gap-1">{task ? task.name : 'Error'}</ModalHeader>
            <ModalBody>
              {task && (
                <>
                  <Helmet>
                    <title>
                      {task.name}
                      {' '}
                      – Todo App
                    </title>
                  </Helmet>
                  <pre>
                    {JSON.stringify(task, null, 2)}
                  </pre>
                </>
              )}
              {error && <QueryError error={error} queryName="useTask" />}
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
