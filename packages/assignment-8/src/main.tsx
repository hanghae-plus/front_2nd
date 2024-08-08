import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";

async function prepare() {
  const { setupWorker } = await import("msw/browser");
  const { mockApiHandlers } = await import("./mocks/mockApiHandlers.ts");
  const worker = setupWorker(...mockApiHandlers);

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

// Service Worker 등록 = 비동기식
// prepare 함수는 Service Worker 준비될 때까지 기다림
// Service Worker가 준비되기 전에 API 요청 발생해서 충돌나는 것 방지
prepare().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  );
});
