import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';

async function startApp() {
  if (import.meta.env.VITE_NODE_ENV === 'development') {
    const { worker } = await import('../shared/api/mocks/browser');
    await worker.start();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  );
}

startApp();
