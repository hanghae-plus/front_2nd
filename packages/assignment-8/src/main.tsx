import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { initialMockEvents } from "./mockApiHandlers.ts";

async function prepare() {
  const { setupWorker } = await import("msw/browser");
  const { createHandlers } = await import("./mockApiHandlers.ts");
  const worker = setupWorker(...createHandlers(initialMockEvents));
  return worker.start();
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  );
});
