import type { Decorator, Preview } from "@storybook/react";
import React from "react";
import { handlers } from "../src/__mocks__/handlers";
import { ChakraProvider } from "@chakra-ui/react";
import { initialize, mswDecorator } from "msw-storybook-addon";

// msw 초기화 => bypress는 msw가 잡지 못한 api요청은 그대로 실제로 날림.
initialize({
  onUnhandledRequest: "bypass",
});

const withChakra: Decorator = (Story) => (
  <ChakraProvider>
    <Story />
  </ChakraProvider>
);

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers,
    },
  },
  decorators: [mswDecorator, withChakra],
};

export default preview;
