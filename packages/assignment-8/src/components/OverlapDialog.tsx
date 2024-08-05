import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
} from "@chakra-ui/react";
import { useSchedulerContext } from "../contexts/SchedulerContext";
import { Event } from "../types";

function OverlapDialog() {
  const { overlapDialog, events, tempEventData, setTempEventData } =
    useSchedulerContext();
  const { state, closeDialog } = overlapDialog;
  const { saveEvent } = events;

  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleContinue = async () => {
    if (tempEventData) {
      await saveEvent(tempEventData);
      setTempEventData(null);
    }
    closeDialog();
  };

  return (
    <AlertDialog
      isOpen={state.isOpen}
      leastDestructiveRef={cancelRef}
      onClose={closeDialog}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            일정 겹침 경고
          </AlertDialogHeader>

          <AlertDialogBody>
            다음 일정과 겹칩니다:
            {state.overlappingEvents.map((event: Event) => (
              <Text key={event.id}>
                {event.title} ({event.date} {event.startTime}-{event.endTime})
              </Text>
            ))}
            계속 진행하시겠습니까?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={closeDialog}>
              취소
            </Button>
            <Button colorScheme="red" onClick={handleContinue} ml={3}>
              계속 진행
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default OverlapDialog;
