import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";

async function prepareMocks() {
  if (import.meta.env.DEV) {
    const { setupWorker } = await import("msw/browser");
    const { handlers: mockApiHandlers } = await import("./__mocks__/handlers.ts");
    const worker = setupWorker(...mockApiHandlers);
    return worker.start();
  }
}

async function startApp() {
  await prepareMocks();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  );
}

startApp();
