import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/react';
import { useState } from 'react';

import TaskForm from './TaskForm';

export default function CreateTaskButton({ parentTaskId }: { parentTaskId?: string }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (isFormOpen) {
    return (
      <TaskForm
        mode="create"
        parentTaskId={parentTaskId}
        setIsFormOpen={setIsFormOpen}
        task={undefined}
      />
    );
  }
  else {
    return (
      <Button
        radius="sm"
        variant="ghost"
        color="primary"
        startContent={<Icon icon="material-symbols:add" className="shrink-0 text-lg" />}
        className="self-start"
        onPress={() => setIsFormOpen(true)}
      >
        Create Task
      </Button>
    );
  }
}
