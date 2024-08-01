import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";

async function prepare() {
  // const { setupWorker } = await import("msw/browser");
  // const { handlers } = await import("../mock/handler.ts");
  // const worker = setupWorker(...handlers);
  // return worker.start();
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
