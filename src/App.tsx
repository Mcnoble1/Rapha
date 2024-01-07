import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Patient from './pages/Patient/Dashboard';
import Records from './pages/Patient/Records';
import Patients from './pages/Doctor/Patients';
import Record from './pages/Doctor/Patient';
import Chat from './pages/Chat';
import Doctor from './pages/Doctor/Dashboard';
import Credentials from './pages/Doctor/Credentials';
import Doctors from './pages/Patient/Doctors';
import Admin from './pages/Admin/Dashboard';
import Docs from './pages/Admin/Doctors';
import DoctorProfile from './pages/Doctor/Profile';
import PatientProfile from './pages/Patient/Profile';
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
        <Route path="/patient/records" element={<Records />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/doctor/patients" element={<Patients />} />
        <Route path="/doctor/credentials" element={<Credentials />} />
        <Route path="/doctor/patient" element={<Record />} />
        <Route path="/patient/doctors" element={<Doctors />} />
        <Route path="/admin/dashboard" element={<Admin />} />
        <Route path="/admin/doctors" element={<Docs />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
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
