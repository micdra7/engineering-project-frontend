import {
  useDisclosure,
  HStack,
  Tooltip,
  IconButton,
  Icon,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import { FaList } from 'react-icons/fa';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import AddCallModal from './AddCallModal';

const localizer = momentLocalizer(moment);

const CallList = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: calls, refetch: refetchCalls } = useQuery(
    '/calls?page=1&limit=9999',
    () => API.get('/calls?page=1&limit=9999'),
  );

  return (
    <div>
      <HStack w="100%" alignItems="center" justifyContent="flex-end" mb={4}>
        <Tooltip hasArrow placement="left" label="Add call" bg="cyan.500">
          <IconButton
            aria-label="Add call"
            onClick={onOpen}
            icon={<Icon as={FaList} />}
            colorScheme="cyan"
            rounded="md"
            color="white"
          />
        </Tooltip>
      </HStack>

      <AddCallModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          refetchCalls();
        }}
      />

      <Box w="100%" maxW="100%" overflowX="auto">
        <Box minH="50vh" minW="700px">
          <Calendar
            localizer={localizer}
            events={
              calls?.data?.data?.map(call => ({
                title: call.name,
                start: moment(call.startDate).toDate(),
                end: moment(call.finishDate).toDate(),
              })) ?? []
            }
            startAccessor="start"
            endAccessor="end"
            start={moment().toDate()}
            end={moment().add(7, 'day').toDate()}
            style={{ height: '100%' }}
            defaultView="week"
            views={['week']}
          />
        </Box>
      </Box>
    </div>
  );
};

export default CallList;
