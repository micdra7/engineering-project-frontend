import {
  useDisclosure,
  HStack,
  Tooltip,
  IconButton,
  Icon,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { FaList } from 'react-icons/fa';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import AddCallModal from './AddCallModal';
import EventModal from './EventModal';

const localizer = momentLocalizer(moment);

const CallList = (): JSX.Element => {
  const availableViews = useBreakpointValue([
    ['day'],
    null,
    null,
    ['day', 'week'],
  ]);
  const defaultView = useBreakpointValue(['day', 'day', 'day', 'week']);
  const [selectedCallId, setSelectedCallId] = useState(0);
  const [currentView, setCurrentView] = useState(defaultView ?? 'week');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: eventOpen,
    onOpen: onEventOpen,
    onClose: onEventClose,
  } = useDisclosure();

  const { data: calls, refetch: refetchCalls } = useQuery(
    '/calls?page=1&limit=9999',
    () => API.get('/calls?page=1&limit=9999'),
  );

  useEffect(() => {
    if (selectedCallId) onEventOpen();
  }, [selectedCallId]);

  useEffect(() => {
    if (defaultView) setCurrentView(defaultView);
  }, [defaultView]);

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

      <EventModal
        isOpen={eventOpen}
        onClose={() => {
          onEventClose();
          setSelectedCallId(0);
        }}
        callId={selectedCallId}
      />

      <Box w="100%" overflowY="unset" overflowX="auto" maxW="100%">
        <Box minH="50vh" w="100%">
          <Calendar
            localizer={localizer}
            events={
              calls?.data?.data?.map(call => ({
                id: call.id,
                code: call.generatedCode,
                title: call.name,
                start: moment(call.startDate).toDate(),
                end: moment(call.finishDate).toDate(),
              })) ?? []
            }
            startAccessor="start"
            endAccessor="end"
            start={moment().toDate()}
            end={moment().add(7, 'day').toDate()}
            style={{ height: '100%', width: '100%' }}
            view={currentView}
            views={availableViews}
            onView={view => setCurrentView(view)}
            onSelectEvent={obj => {
              setSelectedCallId(obj.id);
            }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default CallList;
