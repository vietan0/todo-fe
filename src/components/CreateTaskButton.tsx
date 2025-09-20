import { Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import TaskForm from './TaskForm';

export default function CreateTaskButton({ parentTaskId }: { parentTaskId?: string }) {
  const [isFormOpen, setIsFormOpen] = useState<false | 'name' | 'body'>(false);

  if (isFormOpen) {
    return (
      <TaskForm
        autoFocusField="name"
        finalIndent={0}
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
        onPress={() => setIsFormOpen('name')}
        radius="sm"
        size={parentTaskId ? 'sm' : 'md'}
        startContent={<Icon className="shrink-0 text-base" icon="material-symbols:add" />}
        variant="ghost"
      >
        { parentTaskId ? 'Create Subtask' : 'Create Task' }
      </Button>
    );
  }
}
