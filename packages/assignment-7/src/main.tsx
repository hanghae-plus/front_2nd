import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import Scheduler from "./Scheduler/index.tsx";

async function enableMocking() {
  const { worker } = await import("./mocks/mockServiceWorker/browser.ts");

  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ChakraProvider>
        <Scheduler />
      </ChakraProvider>
    </React.StrictMode>
  );
});
