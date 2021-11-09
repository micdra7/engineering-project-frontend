import React, { useState } from 'react';
import { useLogger } from 'services/toast';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useMutation, useQuery } from 'react-query';
import { API } from 'services/api';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

type TGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  gameId: number;
  gameDataId?: number;
};

const GameDataModal = ({
  isOpen,
  onClose,
  gameId,
  gameDataId,
}: TGameModalProps): JSX.Element => {
  const logger = useLogger();
  const addGameDataMutation = useMutation((data: Record<string, unknown>) =>
    API.post('/games/data/entries', data),
  );
  const [json, setJson] = useState<string>();
  const [isSubmitting, setSubmitting] = useState(false);

  const { data: gameData } = useQuery(
    `/games/data/entries/${gameDataId}`,
    () => API.get(`/games/data/entries/${gameDataId}`),
    { enabled: !!gameDataId },
  );

  const onSubmit = async event => {
    event.preventDefault();
    setSubmitting(true);

    if (!json) {
      logger.warning({
        title: 'Warning',
        description: 'Data cannot be empty',
      });
      setSubmitting(false);
      return;
    }

    try {
      await addGameDataMutation.mutateAsync({
        gameId,
        data: json,
      });

      logger.success({
        title: 'Success',
        description: 'Game data entry added successfully',
      });
      setJson('');
      onClose();
    } catch (error) {
      logger.error({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
    }

    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="cyan.800" color="white" borderColor="white">
        <ModalHeader>Create a new game data entry</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <form id="game-data-form" onSubmit={onSubmit}>
            <JSONInput
              id="game-data"
              onChange={obj => setJson(obj.json)}
              locale={locale}
              height="400px"
              width="100%"
              placeholder={
                gameDataId && gameData?.data
                  ? JSON.parse(
                      typeof gameData?.data?.data === 'string'
                        ? gameData?.data?.data
                        : JSON.stringify(gameData?.data?.data),
                    )
                  : null
              }
              viewOnly={!!gameDataId}
            />

            <ModalFooter>
              {!gameDataId && (
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="cyan"
                  color="white">
                  Save
                </Button>
              )}
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GameDataModal;
