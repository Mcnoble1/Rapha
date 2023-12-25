import { lazy } from 'react';

const Doctor = lazy(() => import('../pages/Doctor/Dashboard'));
const Patient = lazy(() => import('../pages/Patient/Dashboard'));
const Admin = lazy(() => import('../pages/Admin/Dashboard'));
const Patients = lazy(() => import('../pages/Doctor/Patients'));
const Record = lazy(() => import('../pages/Doctor/Patient'));
const Calendar = lazy(() => import('../pages/Doctor/Calendar'));
const Doctors = lazy(() => import('../pages/Patient/Doctors'));
// const DoctorProfile = lazy(() => import('../pages/Patient/DoctorProfile'));
// const PatientProfile = lazy(() => import('../pages/Doctor/PatientProfile'));
const Docs = lazy(() => import('../pages/Admin/Doctors'));


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
    path: '/admin',
    title: 'Admin',
    component: Admin,
  },
  {
    path: '/admin/doctors',
    title: 'Doctors',
    component: Docs,
  },
  {
    path: '/patient/doctors',
    title: 'Doctors',
    component: Doctors,
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
