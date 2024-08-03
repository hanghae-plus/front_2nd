import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useRef } from "react";
import { Event } from "../types";

interface Props {
  isOverlapDialogOpen: boolean;
  setIsOverlapDialogOpen: Dispatch<SetStateAction<boolean>>;
  overlappingEvents: Event[];
  saveEvent: () => Promise<void>;
  fetchEvents: () => Promise<void>;
}
const AlertModal = ({
  isOverlapDialogOpen,
  setIsOverlapDialogOpen,
  overlappingEvents,
  saveEvent,
  fetchEvents,
}: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOverlapDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setIsOverlapDialogOpen(false)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
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
              onClick={() => setIsOverlapDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              colorScheme='red'
              onClick={() => {
                setIsOverlapDialogOpen(false);
                saveEvent().then(async () => {
                  await fetchEvents();
                });
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

export default AlertModal;
