import { lazy } from 'react';

const Doctor = lazy(() => import('../pages/Doctor/Dashboard'));
const Patient = lazy(() => import('../pages/Patient/Dashboard'));
const Patients = lazy(() => import('../pages/Doctor/Patients'));
const Record = lazy(() => import('../pages/Doctor/Patient'));
const Calendar = lazy(() => import('../pages/Doctor/Calendar'));
// const Doctors = lazy(() => import('../pages/Patient/Doctors'));



const coreRoutes = [
  {
    path: '/doctor',
    title: 'Doctor',
    component: Doctor,
  },
  {
    path: '/patient',
    title: 'Patient',
    component: Patient,
  },
  {
    path: '/doctor/patients',
    title: 'Patients',
    component: Patients,
  },
  {
    path: '/doctor/calendar',
    title: 'Calendar',
    component: Calendar,
  },
  {
    path: '/doctor/patient/:id',
    title: 'Patient',
    component: Record,
  },
  // {
  //   path: '/patient/doctors',
  //   title: 'Doctors',
  //   component: Doctors,
  // },
];

const routes = [...coreRoutes];
export default routes;
