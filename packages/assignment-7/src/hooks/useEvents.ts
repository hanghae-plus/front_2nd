import { useToast } from '@chakra-ui/react';
import { API_MAP } from '../constants/api';
import { useState } from 'react';

export const useEvents = () => {
  const toast = useToast();

  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_MAP.events);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
    } catch (error) {
      console.error('Error fetching events', error);
      toast({
        title: '이벤트 로딩 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
};
