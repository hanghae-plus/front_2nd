// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
// import { ChakraProvider } from "@chakra-ui/react";

// async function prepare() {
//   const { setupWorker } = await import("msw/browser");
//   const { mockApiHandlers } = await import("./mockApiHandlers.ts");
//   const worker = setupWorker(...mockApiHandlers);
//   return worker.start();
// }

// async function startApp() {
//   if (process.env.NODE_ENV === "development") {
//     await prepare();
//   }

//   ReactDOM.createRoot(document.getElementById("root")!).render(
//     <React.StrictMode>
//       <ChakraProvider>
//         <App />
//       </ChakraProvider>
//     </React.StrictMode>
//   );
// }

// startApp();

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";

async function prepare() {
  const { setupWorker } = await import("msw/browser");
  const { mockApiHandlers } = await import("./mockApiHandlers.ts");
  const worker = setupWorker(...mockApiHandlers);
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
