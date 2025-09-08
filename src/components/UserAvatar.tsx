import { Avatar } from '@heroui/react';

import cn from '../utils/cn';

export default function UserAvatar() {
  return (
    <Avatar
      classNames={{
        base: cn('h-7 w-7 bg-transparent text-xs'),
      }}
    />
  );
}
