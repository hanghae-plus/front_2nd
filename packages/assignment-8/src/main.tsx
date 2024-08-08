import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { initalEvents } from "./mockCalendarApiHandler.ts";

async function prepare() {
  const { setupWorker } = await import("msw/browser");
  const { createMockHandler } = await import("./mockCalendarApiHandler.ts");
  const worker = setupWorker();
  worker.use(...createMockHandler(initalEvents));
  return worker.start();
}
prepare().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>,
  );
});
