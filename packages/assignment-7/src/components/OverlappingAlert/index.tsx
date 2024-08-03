import { Event, SetState } from "@/types";
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

interface Props {
  isOverlapDialogOpen: boolean;
  setIsOverlapDialogOpen: SetState<boolean>;
  overlappedEvents: Array<Event>;
  onClickGoing: () => void;
}
const OverlappingAlert = ({
  isOverlapDialogOpen,
  setIsOverlapDialogOpen,
  overlappedEvents,
  onClickGoing,
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
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            일정 겹침 경고
          </AlertDialogHeader>

          <AlertDialogBody>
            다음 일정과 겹칩니다:
            {overlappedEvents.map((event) => (
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
            <Button colorScheme="red" onClick={onClickGoing} ml={3}>
              계속 진행
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default OverlappingAlert;
