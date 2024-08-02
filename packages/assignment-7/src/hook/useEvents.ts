import { useToast } from '@chakra-ui/react';
import {useState} from "react";
import {Event} from "../types/types.ts";
import useForm from "./useForm.ts";


const useEvents = () => {
    const toast = useToast();
    const [events, setEvents] = useState<Event[]>([]);
    const {editingEvent, setEditingEvent, resetForm} = useForm()

    // 이벤트 패치
    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events');
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast({
                title: "이벤트 로딩 실패",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // 이벤트 등록/수정
    const saveEvent = async (eventData: Event) => {
        try {
            let response;
            if (editingEvent) {
                response = await fetch(`/api/events/${eventData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData),
                });
            } else {
                response = await fetch('/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData),
                });
            }

            if (!response.ok) {
                throw new Error('Failed to save event');
            }

            await fetchEvents(); // 이벤트 목록 새로고침
            setEditingEvent(null);
            resetForm();
            toast({
                title: editingEvent ? "일정이 수정되었습니다." : "일정이 추가되었습니다.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error saving event:', error);
            toast({
                title: "일정 저장 실패",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // 이벤트 삭제
    const deleteEvent = async (id: number) => {
        try {
            const response = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            await fetchEvents(); // 이벤트 목록 새로고침
            toast({
                title: "일정이 삭제되었습니다.",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error deleting event:', error);
            toast({
                title: "일정 삭제 실패",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };


    return {
        events,
        fetchEvents,
        saveEvent,
        deleteEvent,
    }
}

export default useEvents;