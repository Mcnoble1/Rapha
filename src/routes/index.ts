import { lazy } from 'react';

const Pictures = lazy(() => import('../pages/Files/Pictures'));
const Documents = lazy(() => import('../pages/Files/Documents'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Health = lazy(() => import('../pages/Health'));



const coreRoutes = [
  {
    path: '/dashboard', 
    title: 'Dashboard',
    component: Dashboard, 
  },
  {
    path: '/health', 
    title: 'Health',
    component: Health, 
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
