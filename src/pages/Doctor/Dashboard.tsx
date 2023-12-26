import { useState } from 'react';
import Sidebar from '../../components/DoctorSidebar.tsx';
import Header from '../../components/Header.tsx';
import Breadcrumb from '../../components/Breadcrumb';
import DoctorCard from '../../components/DoctorCard.tsx';
import DidCard from '../../components/DidCard.tsx';
import DoctorDetails from '../../components/DoctorDetails.tsx';
import CardFour from '../../components/CardFour.tsx';
import CardOne from '../../components/CardOne.tsx';
import CardTwo from '../../components/CardTwo.tsx';

const Health = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <div className="flex flex-row flex-wrap justify-evenly gap-5 md:gap-0">
              <Breadcrumb pageName="Doctor Overview" />   
                {/* <DoctorCard /> */}
                {/* <DidCard /> */}
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
              <CardOne />
              <CardTwo />
              <CardFour />
            </div>

              <div className="mt-4">
                <DoctorDetails />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Health;
