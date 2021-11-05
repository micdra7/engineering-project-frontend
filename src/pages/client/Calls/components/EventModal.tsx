import React from 'react';
import { useQuery } from 'react-query';
import {
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Box,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { API } from 'services/api';
import moment from 'moment';
import { DATE_TIME } from 'resources/constants';
import { Link } from 'react-router-dom';
import UsersSelector from 'pages/client/Tasks/components/UsersSelector';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';

type TEventModalProps = {
  callId: number;
  isOpen: boolean;
  onClose: () => void;
};

const EventModal = ({
  callId,
  isOpen,
  onClose,
}: TEventModalProps): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const { data: call } = useQuery(
    `/calls/${callId}`,
    () => API.get(`/calls/${callId}`),
    { enabled: !!callId && isOpen },
  );
  const { data: users } = useQuery('/users', () =>
    API.get('/users?page=1&limit=9999'),
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="cyan.800" color="white" borderColor="white">
        <ModalHeader>{call?.data?.name}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <SimpleGrid columns={1}>
            <Box>
              {'Date: '}
              {moment(call?.data?.startDate).format(DATE_TIME.DATE_TIME)}
              {' - '}
              {moment(call?.data?.finishDate).format(DATE_TIME.DATE_TIME)}
            </Box>
          </SimpleGrid>
          <Box mt={2}>
            <UsersSelector
              taskId={0}
              taskListId={0}
              users={users?.data?.data}
              assignedIds={call?.data?.users?.map(user => user.id) ?? []}
              setAssignedIds={() => {}}
              selectorVisible={false}
            />
          </Box>
          <Box mt={2}>
            <Link
              to={`/calls/${call?.data?.generatedCode}?workspaceName=${authState.currentWorkspace.workspaceName}`}
            >
              <Text fontSize="xs">{`${window.location.origin}/calls/${call?.data?.generatedCode}?workspaceName=${authState.currentWorkspace.workspaceName}`}</Text>
            </Link>
            <Link
              to={`/calls/${call?.data?.generatedCode}?workspaceName=${authState.currentWorkspace.workspaceName}`}
            >
              <Button mt={2} colorScheme="cyan" color="white">
                Join call
              </Button>
            </Link>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EventModal;
