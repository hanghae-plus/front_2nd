import { useState, useCallback } from 'react';
import axios from 'axios';
import { Event } from '../types/types';
import { useToast } from '@chakra-ui/react';

export const useEventCRUD = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const toast = useToast();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (err) {
      toast({
        title: '이벤트 로딩 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, []);

  const addEvent = useCallback(async (eventData: Event) => {
    try {
      await axios.post('/api/events', eventData);
      setEvents((prevEvents) => [...prevEvents, eventData]);
      toast({
        title: '일정이 추가되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: '일정 저장 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, []);

  const addBulkEvent = useCallback(
    async (eventDataArray: Event[]) => {
      try {
        const response = await axios.post('/api/events/bulk', eventDataArray);
        setEvents((prevEvents) => [...prevEvents, ...response.data]);
        toast({
          title: `${eventDataArray.length}개의 일정이 추가되었습니다.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: '일정 일괄 저장 실패',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  const updateEvent = useCallback(
    async (eventData: Event, updateType?: 'repeat') => {
      try {
        if (updateType === 'repeat') {
          // 반복 일정 전체 업데이트
          await axios.put(`/api/events/repeat/${eventData.repeatId}`, eventData);
          setEvents((prevEvents) =>
            prevEvents.map((event) => (event.repeatId === eventData.repeatId ? { ...event, ...eventData } : event))
          );
        } else {
          // 일반 업데이트 또는 예외 일정 업데이트
          await axios.put(`/api/events/${eventData.id}`, eventData);
          setEvents((prevEvents) => prevEvents.map((event) => (event.id === eventData.id ? eventData : event)));
        }
        toast({
          title: '일정이 수정되었습니다.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: '일정 수정 실패',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  const deleteEvent = useCallback(async (id: number) => {
    try {
      await axios.delete(`/api/events/${id}`);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      toast({
        title: '일정이 삭제되었습니다.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: '일정 삭제 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, []);

  return {
    events,
    fetchEvents,
    addEvent,
    addBulkEvent,
    updateEvent,
    deleteEvent,
  };
};
