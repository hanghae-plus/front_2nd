import { Box, BoxProps, HStack, Text } from "@chakra-ui/react";
import { ReactElement } from "react";

interface NotificationItemProps extends BoxProps {
  title: string;
  isNotified: boolean;
  isRepeating: boolean;
  additional?: {
    left?: ReactElement;
    right?: ReactElement;
  };
}

const determineColor = (isNotified: boolean, isRepeating: boolean) => {
  if (isNotified) return "red.500";
  if (isRepeating) return "purple.500";
  return "inherit";
};

export const NotificationItem = ({
  title,
  isNotified,
  isRepeating,
  additional,
  ...boxProps
}: NotificationItemProps) => {
  return (
    <Box
      p={1}
      my={1}
      bg={isNotified ? "red.100" : "gray.100"}
      borderRadius="md"
      fontWeight={isNotified ? "bold" : "normal"}
      color={determineColor(isNotified, isRepeating)}
      {...boxProps}
    >
      <HStack spacing={1}>
        {additional?.left}
        <Text fontSize="sm" noOfLines={1}>
          {title}
        </Text>
        {additional?.right}
      </HStack>
    </Box>
  );
};
