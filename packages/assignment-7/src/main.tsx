import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ChakraProvider } from '@chakra-ui/react';

async function prepare() {
  const { setupWorker } = await import('msw/browser');
  const { mockApiHandlers } = await import('./mocks/handlers');
  const worker = setupWorker(...mockApiHandlers);
  await worker.start();
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  );
});
