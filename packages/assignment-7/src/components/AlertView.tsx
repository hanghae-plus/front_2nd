import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Text,
} from '@chakra-ui/react';
import { Event } from '../types/types';

interface AlertViewProps {
  isOpen: boolean;
  onClose: () => void;
  cancelRef: React.RefObject<HTMLButtonElement>;
  overlappingEvents: Event[];
  continueSaving: () => void;
}

export const AlertView = ({
  isOpen,
  onClose,
  cancelRef,
  overlappingEvents,
  continueSaving,
}: AlertViewProps) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
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
            <Button ref={cancelRef} onClick={onClose}>
              취소
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onClose();
                continueSaving();
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
