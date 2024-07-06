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
        className="shrink-0 self-start"
        color="primary"
        onPress={() => setIsFormOpen(true)}
        radius="sm"
        startContent={<Icon className="shrink-0 text-lg" icon="material-symbols:add" />}
        variant="ghost"
      >
        { parentTaskId ? 'Create Subtask' : 'Create Task' }
      </Button>
    );
  }
}
