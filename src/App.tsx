import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Doctor from './pages/Patient/Dashboard';
import Patient from './pages/Doctor/Dashboard';
import Pictures from './pages/Files/Pictures';
import Documents from './pages/Files/Documents';
import Homepage from './pages/Homepage';
import Loader from './common/Loader';
import routes from './routes';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
    <Toaster position='top-right' reverseOrder={false} containerClassName='overflow-auto'/>
  
      <Routes>
        <Route path="/" index element={<Homepage />} />
        <Route path="/homepage" index element={<Homepage />} />
        <Route path="/doctor/dashboard" element={<Doctor />} />
        <Route path="/patient/dashboard" element={<Patient />} />
        <Route path="/files/pictures" element={<Pictures />} />
        <Route path="/files/documents" element={<Documents />} />
        <Route element={<DefaultLayout />}>
          {/* <Route element={<Dashboard />} /> */}
          {routes.map(({ path, component: Component }) => (
            <Route
              path={path}
              element={
                <Suspense fallback={<Loader />}>
                  <Component />
                </Suspense>
              }
            />
          ))}
        </Route>
      </Routes>
    </>
  );
}

export default App;
