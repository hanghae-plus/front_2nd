import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ChakraProvider } from '@chakra-ui/react';
import { initialEvents } from './__mock__/mockData.ts';

async function prepare() {
  const { setupWorker } = await import('msw/browser');
  const { mockHolidayApiHandlers } = await import('./__mock__/handlers/mockHolidayApiHandlers.ts');
  const { mockEventApiHandlers } = await import('./__mock__/handlers/mockEventApiHandlers.ts');
  const initMockEventApiHandlers = mockEventApiHandlers(initialEvents);

  const worker = setupWorker(...mockHolidayApiHandlers, ...initMockEventApiHandlers);
  return worker.start();
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
