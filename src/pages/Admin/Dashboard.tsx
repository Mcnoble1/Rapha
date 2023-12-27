import { useState } from 'react';
import Sidebar from '../../components/AdminSidebar.tsx';
import Header from '../../components/Header.tsx';
import Breadcrumb from '../../components/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';

const Overview = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [workersData, setWorkersData] = useState<Worker[]>([]);
  const [usersData, setUsersData] = useState<User[]>(0);



  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <div className="flex flex-row mb-5 flex-wrap justify-evenly gap-5 md:gap-0">
              <Breadcrumb pageName="Admin Dashboard Overview" />
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
                <div className="flex justify-between rounded-lg border border-stroke bg-white py-3 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-between">
                  <div>
                  <span className="text-sm font-medium">Registered Doctors</span>
                    <h4 className="text-title-sm text-black dark:text-white">
                      {customersData.length}
                    </h4>
                  </div>
                </div>
        
                <div className="flex h-11.5 w-11.5 items-center justify-center rounded bg-primary dark:bg-meta-4">
                  <FontAwesomeIcon icon={faCircleUser} style={{color: "#ffffff",}} />
                </div>
              </div>
              

              <div className="flex justify-between rounded-lg border border-stroke bg-white py-3 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-between">
                <div>
                <span className="text-sm font-medium">Registered Hospitals</span>
                  <h4 className="text-title-sm text-black dark:text-white">
                      {workersData.length}
                  </h4>
                </div>
              </div>
              
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded bg-primary dark:bg-meta-4">
                  <FontAwesomeIcon icon={faUserGroup} style={{color: "#ffffff",}} />
              </div>
                </div>


                <div className="flex justify-between rounded-lg border border-stroke bg-white py-3 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="flex justify-between">
                  <div>
                  <span className="text-sm font-medium">Medical Practitioners</span>
                    <h4 className="text-title-sm text-black dark:text-white">
                      {usersData}
                    </h4>
                  </div>
                </div>
                
                <div className="flex h-11.5 w-11.5 items-center justify-center rounded bg-primary dark:bg-meta-4">
                <FontAwesomeIcon icon={faCircleUser} style={{color: "#ffffff",}} />   
                </div>
                  </div>

            </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Overview;
