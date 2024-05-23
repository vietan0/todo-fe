import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';

export default function ProjectActionBtn({ isHover }: { isHover: boolean }) {
  return (
    <Dropdown
      classNames={{
        content: 'min-w-36', // default: 200px
      }}
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          className={isHover ? 'opacity-100' : 'opacity-0'}
        >
          <Icon icon="material-symbols:more-horiz" className="text-lg" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Project Actions"
      >
        <DropdownItem startContent={<Icon icon="material-symbols:edit" />} key="rename">Rename</DropdownItem>
        <DropdownItem startContent={<Icon icon="material-symbols:delete" />} key="delete" className="text-danger" color="danger">
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
