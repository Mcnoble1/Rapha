import { lazy } from 'react';

const Pictures = lazy(() => import('../pages/Files/Pictures'));
const Documents = lazy(() => import('../pages/Files/Documents'));
const Doctor = lazy(() => import('../pages/Doctor/Dashboard'));
const Patient = lazy(() => import('../pages/Patient/Dashboard'));



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
    path: '/pictures',
    title: 'Pictures',
    component: Pictures,
  },
  {
    path: '/documents',
    title: 'Documents',
    component: Documents,
  },
];

const routes = [...coreRoutes];
export default routes;
