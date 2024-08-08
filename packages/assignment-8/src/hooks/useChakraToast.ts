import { useToast } from '@chakra-ui/react';

const duration = 3000;
const isClosable = true;

export default function useChakraToast() {
  const toast = useToast();

  const errorToast = (title: string) => {
    return toast({
      title,
      status: 'error',
      duration,
      isClosable,
    });
  };

  const successToast = (title: string) => {
    return toast({
      title,
      status: 'success',
      duration,
      isClosable,
    });
  };

  const infoToast = (title: string) => {
    return toast({
      title,
      status: 'info',
      duration,
      isClosable,
    });
  };

  return { errorToast, successToast, infoToast };
}
