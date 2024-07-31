if (process.env.REACT_APP_MOCK_API === 'true') {
    const { worker } = require('./mocks/browser');
    worker.start();
  }
  
  // Render React App
  