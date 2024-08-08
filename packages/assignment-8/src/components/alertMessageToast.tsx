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
import { useRef } from "react";
import { eventsStore } from "../store/eventsStore";
import { Event } from "../types";

type AlertMessageToastProps = {
  isOverlapDialogOpen: boolean;
  handleSetIsOverlapDialogOpen: (isOverlapDialogOpen: boolean) => void;
  handleUpdateEvent: (eventData: Event) => Promise<void>;
  eventData: Event;
};

export const AlertMessageToast = ({
  isOverlapDialogOpen,
  handleSetIsOverlapDialogOpen,
  handleUpdateEvent,
  eventData,
}: AlertMessageToastProps) => {
  const { overlappingEvents } = eventsStore();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOverlapDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => handleSetIsOverlapDialogOpen(false)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            일정 겹침 경고
          </AlertDialogHeader>

          <AlertDialogBody>
            다음 일정과 겹칩니다:
            {overlappingEvents.map((event) => (
              <Text key={event.id}>
                {event.title} ({event.date} {event.startTime}-{event.endTime})
              </Text>
            ))}
            계속 진행하시겠습니까?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => handleSetIsOverlapDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                handleSetIsOverlapDialogOpen(false);
                handleUpdateEvent(eventData);
              }}
              ml={3}
            >
              계속 진행
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
