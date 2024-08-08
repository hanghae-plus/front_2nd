import Scheduler from "@/Scheduler/index.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";

async function enableMocking() {
  const { worker } = await import("@/mocks/mockServiceWorker/browser.ts");

  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <ChakraProvider>
      <Scheduler />
    </ChakraProvider>
  );
});
