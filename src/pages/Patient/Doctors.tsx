import React, { useEffect, useContext, useRef, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { adminDid } from "../../utils/Constants"
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import { Web5Context } from "../../utils/Web5Context.tsx";
import 'react-toastify/dist/ReactToastify.css';
import Image from '../../images/user/3.png';
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

  useEffect(() => {
    if (web5 && myDid) {
    fetchHealthDetails();
    }
  }, []);

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


const fetchPatientProfile = async (recipientDid) => {
  try {
    const response = await web5.dwn.records.query({
      from: myDid,
      message: {
        filter: {
            protocol: 'https://rapha.com/protocol',
            protocolPath: 'patientProfile',
        },
      },
    });
    console.log(response);

    if (response.status.code === 200) {
      const patientDetails = await Promise.all(
        response.records.map(async (record) => {
          const data = await record.data.json();
          // console.log(data);
          return {
            ...data,
            recordId: record.id,
          };
        })
      );
      console.log(patientDetails);
      
      const recordId = patientDetails[0].recordId;
        const res = await web5.dwn.records.query({
          message: {
            filter: {
              recordId: recordId,
            },
          },
        });
        console.log(res);
    
        if (res.records && res.records.length > 0) {
          const record = res.records[0];
          const { status } = await record.send(recipientDid);
          console.log('Send record status in shareProfile', status);
          toast.success('Successfully shared health record', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        } else {
          console.error('No record found with the specified ID');
          toast.error('Failed to share health record', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        }
      
    } else {
      console.error('No health details found');
      toast.error('Failed to fetch health details', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    setFetchDetailsLoading(false);
  } catch (err) {
    console.error('Error in fetchPatientProfile:', err);
    toast.error('Error in fetchPatientProfile. Please try again later.', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
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
                    ref={trigger}
                    // onClick={() => setPatientPopupOpen(!categoryPopupOpen)}
                    className="inline-flex mr-5 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                      Sort
                  </button>

                  <button
                  ref={trigger}
                  // onClick={() => setServicePopupOpen(!servicePopupOpen)}
                  className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                    Filter
                  </button>
                </div>   
              </div>

              <div className="flex flex-row gap-10 ">
                    {doctorsDetails.map((doctor, index) => (
                      <div className=" w-2/5 rounded-2xl bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark ">
                        <div className="" key={index}>
                        <div className='flex flex-row mb-1 gap-20 p-5 w-full'>
                          <div className="flex">
                            <div className="flex-shrink-0 ">
                              <img
                                src={Image}
                                alt={doctor.name}
                                className="h-30 w-30 rounded-full" 
                              />
                            </div>
                          </div>
                          <div className=''>
                              <div className='mb-2 flex' >
                                <p className="text-2xl font-bold text-black dark:text-white">
                                  {doctor.name} 
                                </p>
                                <button className={` ${doctor.status === 'Verified' ? 'bg-success' : 'bg-warning'} p-1 text-white rounded-xl ml-5`}>{doctor.status}</button>
                              </div>

                              <div className='flex flex-row gap-x-5 gap-y-2 flex-wrap'>

                                <div className='' >
                                  <p className="text-lg font-medium text-black dark:text-white">
                                    {doctor.hospital }
                                  </p>
                                </div>

                                <div className='' >
                                  <p className="text-lg font-medium text-black dark:text-white">
                                    {doctor.gender }
                                  </p>
                                </div>

                                <div className='' >
                                  <p className="text-lg font-medium text-black dark:text-white">
                                    {doctor.specialty }
                                  </p>
                                </div>

                                <div className='' >
                                  <p className="text-lg font-medium text-black dark:text-white">
                                    {doctor.yearsOfExperience } 
                                  </p>
                                </div>

                                <div className='mb-5' >
                                  <p className="text-lg font-medium text-black dark:text-white">
                                    { doctor.country }
                                  </p>
                                </div>
                              </div>      
                              <div className="relative">

                        {doctor.status === 'Verified' ? (
                          <button
                            // onClick={() =>  togglePop(doctor.recordId)}  
                            onClick={() => {
                              fetchPatientProfile(doctor.sender);
                              navigate(`/chat?did=${doctor.sender}&name=${doctor.name}`)}}                   
                            className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                            >
                            Consult
                          </button>
                        ) : null }
                          
                          </div>                    
                          </div> 
                      </div>
                      </div>
                      </div>

                    ))}
              </div>

              </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
