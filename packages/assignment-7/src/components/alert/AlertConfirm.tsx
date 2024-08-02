import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Text,
} from "@chakra-ui/react";
import { FC, useRef } from "react";
import { Event, RepeatType } from "../../types/types.ts";

interface Props {
    isOverlapDialogOpen: boolean;
    setIsOverlapDialogOpen: (isOverlapDialogOpen: boolean) => void;
    overlappingEvents: Event[];
    saveEvent: (eventData: Event) => void;
    editingEvent: Event | null;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
    location: string;
    category: string;
    isRepeating: boolean;
    repeatType: RepeatType;
    repeatInterval: number;
    repeatEndDate: string;
    notificationTime: number;
}

const AlertConfirm: FC<Props> = ({
       isOverlapDialogOpen,
       setIsOverlapDialogOpen,
       overlappingEvents,
       saveEvent,
       editingEvent,
       title,
       date,
       startTime,
       endTime,
       description,
       location,
       category,
       isRepeating,
       repeatType,
       repeatInterval,
       repeatEndDate,
       notificationTime,
   }) => {
    const cancelRef = useRef<HTMLButtonElement>(null);

    return (
        <AlertDialog
            data-testid="alert-dialog"
            isOpen={isOverlapDialogOpen}
            leastDestructiveRef={cancelRef}
            onClose={() => setIsOverlapDialogOpen(false)}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        일정 겹침 경고
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        다음 일정과 겹칩니다:
                        {overlappingEvents.map(event => (
                            <Text key={event.id}>{event.title} ({event.date} {event.startTime}-{event.endTime})</Text>
                        ))}
                        계속 진행하시겠습니까?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={() => setIsOverlapDialogOpen(false)}>
                            취소
                        </Button>
                        <Button colorScheme="red" onClick={() => {
                            setIsOverlapDialogOpen(false);
                            saveEvent({
                                id: editingEvent ? editingEvent.id : Date.now(),
                                title,
                                date,
                                startTime,
                                endTime,
                                description,
                                location,
                                category,
                                repeat: {
                                    type: isRepeating ? repeatType : 'none',
                                    interval: repeatInterval,
                                    endDate: repeatEndDate || undefined,
                                },
                                notificationTime,
                            });
                        }} ml={3}>
                            계속 진행
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default AlertConfirm;