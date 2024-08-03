import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ChakraProvider } from '@chakra-ui/react';

async function enableMocking() {
  if (import.meta.env.PROD) return;

  const { worker } = await import('./mocks/browser.ts');

  return worker.start();
}

await enableMocking();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
