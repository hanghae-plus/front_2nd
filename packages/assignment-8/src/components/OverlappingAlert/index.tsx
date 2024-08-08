import { RefObject } from "react";
import { Event } from "../../types";
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

interface Props {
  isOverlapDialogOpen: boolean;
  onCloseOverlappingToggle: () => void;
  overlappingEvents: Event[];
  cancelRef: RefObject<HTMLButtonElement>;
  onClickContinueBtn: () => void;
}

const OverlappingAlert = ({
  isOverlapDialogOpen,
  onCloseOverlappingToggle,
  overlappingEvents,
  cancelRef,
  onClickContinueBtn,
}: Props) => {
  return (
    <AlertDialog
      isOpen={isOverlapDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={onCloseOverlappingToggle}
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
            <Button ref={cancelRef} onClick={onCloseOverlappingToggle}>
              취소
            </Button>
            <Button colorScheme="red" onClick={onClickContinueBtn} ml={3}>
              계속 진행
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default OverlappingAlert;
