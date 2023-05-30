import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Loading from './components/Loading';
import { LoadingProvider } from './contexts/LoadingContext';
import { MobileMenuProvider } from './contexts/MobileMenuContext';
import Routes from './Routes';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <LoadingProvider>
          <MobileMenuProvider>
            <Routes />
          </MobileMenuProvider>
        </LoadingProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
