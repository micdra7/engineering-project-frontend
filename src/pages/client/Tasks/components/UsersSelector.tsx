import {
  Avatar,
  AvatarGroup,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import { TooltipAvatar } from 'components';
import React, { useEffect, useState } from 'react';
import { TUser } from 'types/User';

type TUsersSelector = {
  taskId: number;
  taskListId: number;
  users: TUser[];
  assignedIds: number[];
  setAssignedIds;
  selectorVisible?: boolean;
};

type TSelectedItem = {
  value: string;
  label: string;
};

const UsersSelector = ({
  taskId,
  taskListId,
  users,
  assignedIds,
  setAssignedIds,
  selectorVisible = true,
}: TUsersSelector): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItems, setSelectedItems] = useState<TSelectedItem[]>([]);

  const handleSelectedItemsChange = items => {
    if (items) {
      setSelectedItems(items);
    }
  };

  useEffect(() => {
    if (users && assignedIds) {
      const items: TSelectedItem[] = [];

      assignedIds.forEach(id => {
        const user = users.find(u => u.id === id);

        items.push({
          value: `${id}`,
          label: `${user?.firstName} ${user?.lastName}`,
        });
      });

      setSelectedItems(items);
    }
  }, []);

  return (
    <Flex>
      <AvatarGroup size="sm" max={3}>
        {users
          .filter(u => assignedIds.includes(u.id))
          .map(user => (
            <TooltipAvatar
              key={user.id}
              size="sm"
              color="white"
              name={`${user.firstName} ${user.lastName}`}
            />
          ))}
      </AvatarGroup>
      {selectorVisible && (
        <AvatarGroup>
          <Popover strategy="fixed" isOpen={isOpen} onClose={onClose}>
            <PopoverTrigger>
              <Avatar
                onClick={onOpen}
                cursor="pointer"
                size="sm"
                bg="green.500"
                mx="2"
                color="white"
                border="2px solid white"
                name="..."
                getInitials={name => name}
              />
            </PopoverTrigger>
            <PopoverContent bg="cyan.500" color="white">
              <PopoverHeader fontWeight="bold">Assigned users</PopoverHeader>
              <PopoverArrow bg="cyan.500" />
              <PopoverCloseButton />
              <PopoverBody>
                <CUIAutoComplete
                  label="Choose users"
                  placeholder="Type user's name"
                  items={users.map(u => ({
                    value: `${u.id}`,
                    label: `${u.firstName} ${u.lastName}`,
                  }))}
                  inputStyleProps={{ _placeholder: { color: 'white' } }}
                  tagStyleProps={{
                    bg: 'cyan.300',
                    color: 'white',
                    marginBottom: '4px !important',
                  }}
                  hideToggleButton
                  disableCreateItem
                  listStyleProps={{
                    bg: 'cyan.400',
                    maxH: '200px',
                    overflowY: 'auto',
                  }}
                  listItemStyleProps={{
                    bg: 'cyan.400',
                    cursor: 'pointer',
                    _hover: { bg: 'cyan.600' },
                  }}
                  selectedIconProps={{
                    icon: undefined, // undefined on purpose, otherwise typecheck wouldn't stop complaining
                    color: 'green.600',
                  }}
                  selectedItems={selectedItems}
                  onSelectedItemsChange={changes =>
                    handleSelectedItemsChange(changes.selectedItems)
                  }
                />
              </PopoverBody>
              <PopoverFooter>
                <Button
                  variant="outline"
                  colorScheme="cyan"
                  color="white"
                  onClick={() => {
                    setAssignedIds(ids => [
                      ...ids.filter(
                        (item: {
                          listId: string;
                          taskId: string;
                          ids: number[];
                        }) =>
                          !(
                            item.listId === `${taskListId}` &&
                            item.taskId === `${taskId}`
                          ),
                      ),
                      {
                        taskId: `${taskId}`,
                        listId: `${taskListId}`,
                        ids: selectedItems.map(
                          (item: { value: string }) => +item.value,
                        ),
                      },
                    ]);
                    onClose();
                  }}>
                  Save
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </AvatarGroup>
      )}
    </Flex>
  );
};

export default UsersSelector;
