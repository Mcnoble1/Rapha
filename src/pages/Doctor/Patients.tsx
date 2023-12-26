import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/DoctorSidebar';
import Breadcrumb from '../../components/Breadcrumb';
import AllPatientsTable from '../../components/AllPatientsTable';
import '../signin.css';

const Tables: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <div className="mb-6 flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb pageName="All Patients" />   
              </div>
              <div className="flex flex-col gap-10">
                <AllPatientsTable />
              </div>
              </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Tables;
