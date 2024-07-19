import Main from './common/components/main';
import Navigation from './common/components/navigation/index.tsx';
import AdminProvider from './common/context/AdminContext.tsx';
import PageLayout from './common/layout/PageLayout.tsx';

const App = () => {
  return (
    <AdminProvider>
      <PageLayout>
        <Navigation />
        <Main />
      </PageLayout>
    </AdminProvider>
  );
};

export default App;
