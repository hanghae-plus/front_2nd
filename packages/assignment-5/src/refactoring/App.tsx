import { useState } from 'react';
import Header from './components/Header.jsx';
import MainPage from './components/MainPage.jsx';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className='min-h-screen bg-gray-100'>
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <MainPage isAdmin={isAdmin} />
    </div>
  );
};

export default App;
