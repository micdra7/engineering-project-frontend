import {
  Avatar,
  AvatarGroup,
  Button,
  CloseButton,
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
import React, { useState } from 'react';
import { TUser } from 'types/User';

type TUsersSelector = {
  taskListId: number;
  users: TUser[];
  assignedIds: number[];
  setAssignedIds;
};

const UsersSelector = ({
  taskListId,
  users,
  assignedIds,
  setAssignedIds,
}: TUsersSelector): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItems, setSelectedItems] = useState([]);
  console.log('selectedItems: ', selectedItems);

  const handleSelectedItemsChange = items => {
    if (items) {
      setSelectedItems(items);
    }
  };
  return (
    <Flex>
      {users
        .filter(u => assignedIds.includes(u.id))
        .map(user => (
          <AvatarGroup size="sm" max={3} pos="relative">
            <Avatar
              size="sm"
              color="white"
              name={`${user.firstName} ${user.lastName}`}
            />
            <CloseButton
              size="sm"
              onClick={() =>
                setAssignedIds(ids =>
                  ids.filter(
                    (item: { value: string; ids: number[] }) =>
                      !(
                        item.value === `${taskListId}` &&
                        item.ids.includes(user.id)
                      ),
                  ),
                )
              }
            />
          </AvatarGroup>
        ))}
      <AvatarGroup>
        <Popover strategy="fixed" isOpen={isOpen} onClose={onClose}>
          <PopoverTrigger>
            <Avatar
              onClick={onOpen}
              cursor="pointer"
              size="sm"
              color="white"
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
                  bg: 'cyan.200',
                  maxH: '200px',
                  overflowY: 'auto',
                }}
                listItemStyleProps={{
                  bg: 'cyan.200',
                  cursor: 'pointer',
                  _hover: { bg: 'cyan.300' },
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
                  setAssignedIds((ids: number[]) => [
                    ...ids,
                    {
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
    </Flex>
  );
};

export default UsersSelector;
