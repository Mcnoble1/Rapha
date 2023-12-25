import React, { useEffect, useContext, useRef, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { adminDid } from "../../utils/Constants"
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import { Web5Context } from "../../utils/Web5Context.tsx";
import 'react-toastify/dist/ReactToastify.css';
import '../signin.css';

const Doctors: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { web5, myDid } = useContext( Web5Context);

  const [doctorsDetails, setDoctorsDetails] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [doctorToDeleteId, setDoctorToDeleteId] = useState<number | null>(null);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>(''); 
  const [shareLoading, setShareLoading] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [recipientDid, setRecipientDid] = useState("");
  const [fetchDetailsLoading, setFetchDetailsLoading] = useState(false);
  const [filterOption, setFilterOption] = useState<string>(''); 
  const [search, setSearch] = useState('');
  const [popupOpenMap, setPopupOpenMap] = useState<{ [key: number]: boolean }>({});

  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null); 

  const togglePopup = (doctorId: string) => {
    setPopupOpenMap((prevMap) => ({
      ...prevMap,
      [doctorId]: !prevMap[doctorId],
    }));
  };
  
  const closePopup = (doctorId: string) => {
    setPopupOpenMap((prevMap) => ({
      ...prevMap,
      [doctorId]: false,
    }));
  };

  const fetchHealthDetails = async () => {
  setFetchDetailsLoading(true);
  try {
    const response = await web5.dwn.records.query({
      from: adminDid,
      message: {
        filter: {
            protocol: 'https://rapha.com/protocol',
            protocolPath: 'doctorProfile',
            // schema: 'https://did-box.com/schemas/healthDetails',
        },
      },
    });
    console.log('Health Details:', response);

    if (response.status.code === 200) {
      const healthDetails = await Promise.all(
        response.records.map(async (record) => {
          const data = await record.data.json();
          console.log(data);
          return {
            ...data,
            recordId: record.id,
          };
        })
      );
      setDoctorsDetails(healthDetails);
      console.log(healthDetails);
      toast.success('Successfully fetched doctor details', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      setFetchDetailsLoading(false);
    } else {
      console.error('No doctor details found');
      toast.error('Failed to fetch doctor details', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    setFetchDetailsLoading(false);
  } catch (err) {
    console.error('Error in fetchDOctorDetails:', err);
    toast.error('Error in fetchDOctorDetails. Please try again later.', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
    setFetchDetailsLoading(false);
  };
};
  

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <div className="mb-6 flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb pageName="All Doctors" />
                <div>
                  <button 
                    onClick={fetchHealthDetails}
                    className=" items-center mr-5 rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover-bg-opacity-90">
                    {fetchDetailsLoading ? (
                      <div className="flex items-center">
                        <div className="spinner"></div>
                        <span className="pl-1">Fetching...</span>
                      </div>
                    ) : (
                      <>Fetch Profile</>
                    )}           
                  </button>

                  <button 
                    ref={trigger}
                    onClick={() => setPatientPopupOpen(!categoryPopupOpen)}
                    className="inline-flex mr-5 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                      Add Patient
                  </button>

                  <button
                  ref={trigger}
                  onClick={() => setServicePopupOpen(!servicePopupOpen)}
                  className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                    Add Service
                  </button>
                </div>   
              </div>

              <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                  <div className="flex flex-col justify-between">
                    {doctorsDetails.map((doctor, index) => (
                        <div className="" key={index}>
                        <div className='flex mb-10 p-5 flex-wrap w-full rounded-lg'>
                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">Name</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.name }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">Date of Birth</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.dateOfBirth }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">Gender</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.gender }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">Hospital</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.hospital }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">Specialty</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.specialty }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">Registration Number</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.registrationNumber }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">Identification Number</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.identificationNumber }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">Years of Experience</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.yearsOfExperience }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">Email Address</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.email }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">Phone Number</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.phone }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">Home Address</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.homeAddress }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">City</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.city }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">State</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              {doctor.state }
                            </h4>
                          </div>

                          <div className='w-1/3 mb-5' >
                            <span className="text-xl">Country</span>
                            <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                              { doctor.country }
                            </h4>
                          </div>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() =>  togglePop(doctor.recordId)}                      
                          className="inline-flex mb-5 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                          >
                          Issue VC
                        </button>
                          {issueVCOpenMap[doctor.recordId] && (
                                <div
                                  ref={popup}
                                  className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90"
                                >
                                  <div
                                      className="bg-white lg:mt-15 lg:w-1/2 rounded-lg pt-3 px-4 shadow-md"
                                      style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll' }}
                                    >              
                                        <div className="flex flex-row justify-between">
                                        <h2 className="text-xl font-semibold mb-4">Issue Certified Doctor VC</h2>
                                        <div className="flex justify-end">
                                          <button
                                            onClick={() => closePop(doctor.recordId)}
                                            className="text-blue-500 hover:text-gray-700 focus:outline-none"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-5 w-5 fill-current bg-primary rounded-full p-1 hover:bg-opacity-90"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="white"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                      <form>
                                      <div className= "rounded-sm px-6.5 bg-white dark:border-strokedark dark:bg-boxdark">
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-3/5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                      Name
                                    </label>
                                    <div className={`relative ${vcData.name ? 'bg-light-blue' : ''}`}>
                                    <input
                                      type="text"
                                      name="name"
                                      required
                                      value={vcData.name}
                                      onChange={handleInputChange}
                                      placeholder="John Doe"
                                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                    </div>
                                  </div>

                                  <div className="w-full xl:w-1/2">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                      Date of Birth
                                    </label>
                                    <div className={`relative ${vcData.dateOfBirth ? 'bg-light-blue' : ''}`}>
                                    <input
                                      type="date" 
                                      name="dateOfBirth"
                                      required
                                      value={vcData.dateOfBirth}
                                      onChange={handleInputChange}
                                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                    </div>
                                  </div> 

                                  <div className="w-full xl:w-3/5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                      Hospital
                                    </label>
                                    <div className={`relative ${vcData.hospital? 'bg-light-blue' : ''}`}>
                                    <input
                                      type="text"
                                      name="hospital"
                                      required
                                      value={vcData.hospital}
                                      onChange={handleInputChange}
                                      placeholder="John Hopkins"
                                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                                <div className="w-full xl:w-3/5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                      Specialty
                                    </label>
                                    <div className={`relative ${vcData.specialty? 'bg-light-blue' : ''}`}>
                                    <input
                                      type="text"
                                      name="specialty"
                                      required
                                      value={vcData.specialty}
                                      onChange={handleInputChange}
                                      placeholder="Family Medicine"
                                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                    </div>
                                  </div>

                                  <div className="w-full xl:w-3/5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                      Registration Number
                                    </label>
                                    <div className={`relative ${vcData.registrationNumber? 'bg-light-blue' : ''}`}>
                                    <input
                                      type="text"
                                      name="registrationNumber"
                                      required
                                      value={vcData.registrationNumber}
                                      onChange={handleInputChange}
                                      placeholder="SSN123456"
                                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                    </div>
                                  </div>
                                </div>                 
                                </div>
                                      </form>
                                    <button
                                      type="button"
                                      onClick={() => updateHealthDetails(doctor.recordId, vcData)}
                                      disabled={updateLoading}
                                      className={`mr-5 mb-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                      {updateLoading ? (
                                        <div className="flex items-center">
                                          <div className="spinner"></div>
                                          <span className="pl-1">Issuing...</span>
                                        </div>
                                      ) : (
                                        <>Issue</>
                                      )}
                                    </button>
                                    </div>
                                </div>
                              )}
                      </div>
                      </div>
                    ))}
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

export default Doctors;
