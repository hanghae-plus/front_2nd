import { UseToastOptions } from "@chakra-ui/react";

export const useToasts = () => {
  const getToastOptions = (type: string): UseToastOptions => {
    const options: Record<string, UseToastOptions> = {
      updatingEventSuccess: {
        title: "일정이 수정되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      },
      addingEventSuccess: {
        title: "일정이 추가되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      },
      deletingEventSuccess: {
        title: "일정이 삭제되었습니다.",
        status: "info",
        duration: 3000,
        isClosable: true,
      },
      requiredFieldsError: {
        title: "필수 정보를 모두 입력해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      },
      timeSettingError: {
        title: "시간 설정을 확인해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      },
      loadingEventsFail: {
        title: "이벤트 로딩 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      },
      savingEventFail: {
        title: "일정 저장 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      },
      deletingEventFail: {
        title: "일정 삭제 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      },
    };

    return (
      options[type] || {
        title: "알 수 없는 오류",
        status: "error",
        duration: 3000,
        isClosable: true,
      }
    );
  };

  return { getToastOptions };
};
