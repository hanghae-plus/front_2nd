import { SetState } from "@/types";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

interface Props {
  isReapetEventRemoveDialogOpen: boolean;
  setIsRepeatEventRemoveDialogOpen: SetState<boolean>;
  onClickRemoveParent: () => void;
  onClickRemoveOnlyTargetChild: () => void;
}
const RepeatEventRemoveAlert = ({
  isReapetEventRemoveDialogOpen,
  setIsRepeatEventRemoveDialogOpen,
  onClickRemoveParent,
  onClickRemoveOnlyTargetChild,
}: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isReapetEventRemoveDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setIsRepeatEventRemoveDialogOpen(false)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            반복 일정 삭제
          </AlertDialogHeader>

          <AlertDialogBody>
            반복 일정에 대한 삭제를 요청하였습니다.
          </AlertDialogBody>
          <AlertDialogBody>해당 일정만 삭제하시겠습니까?</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => setIsRepeatEventRemoveDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              colorScheme="blue"
              onClick={onClickRemoveParent}
              ml={3}
              data-testid="delete-all-event-confirm-button"
            >
              전체 삭제
            </Button>
            <Button
              colorScheme="blue"
              onClick={onClickRemoveOnlyTargetChild}
              ml={3}
              data-testid="delete-only-repetition-event-confirm-button"
            >
              해당 일정만 삭제
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default RepeatEventRemoveAlert;
