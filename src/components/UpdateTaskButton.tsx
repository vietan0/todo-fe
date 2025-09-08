import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import cn from '../utils/cn';

export default function UpdateTaskButton({
  isIconOnly = false,
  setIsFormOpen,
}: {
  isIconOnly?: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Tooltip
      closeDelay={0}
      content="Edit Task"
      delay={500}
    >
      <Button
        aria-label="Edit Task"
        className={cn(
          'min-w-0 data-[hover=true]:bg-default/60',
          isIconOnly ? 'h-7 w-7' : 'justify-start',
        )}
        disableAnimation
        isIconOnly={isIconOnly}
        onPress={() => setIsFormOpen(true)}
        radius="sm"
        size="sm"
        variant={isIconOnly ? 'light' : 'ghost'}
      >
        <Icon className="text-xl text-default-700" icon="material-symbols:edit" />
        {isIconOnly || 'Edit Task'}
      </Button>
    </Tooltip>
  );
}
