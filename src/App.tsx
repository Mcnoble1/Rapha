import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Patient from './pages/Patient/Dashboard';
import Patients from './pages/Doctor/Patients';
import Record from './pages/Doctor/Patient';
import Doctor from './pages/Doctor/Dashboard';
import Calendar from './pages/Doctor/Calendar';
// import Doctors from './pages/Patient/Doctors';
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
        <Route path="/doctor/patients" element={<Patients />} />
        <Route path="/doctor/calendar" element={<Calendar />} />
        <Route path="/doctor/patient/:id" element={<Record />} />
        {/* <Route path="/patient/doctors" element={<Doctors />} /> */}
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
