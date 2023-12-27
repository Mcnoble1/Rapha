import { useState, useRef, ChangeEvent, FormEvent, useContext, useEffect } from 'react';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { Web5Context } from "../utils/Web5Context";
import AllergyDetails from './AllergyDetails.tsx';
import CardiologyDetails from './CardiologyDetails.tsx';
import DiagnosisDetails from './DiagnosisDetails.tsx';
import ImmunizationDetails from './ImmunizationDetails.tsx';
import InsuranceDetails from './InsuranceDetails.tsx';
import LabTestDetails from './LabTestDetails.tsx';
import MedicalHistoryDetails from './MedicalHistoryDetails.tsx';
import SurgeryDetails from './SurgeryDetails.tsx';
import VitalSignsDetails from './VitalSignsDetails.tsx';
import PhysicalDetails from './PhysicalDetails.tsx';


const HealthDetails = () => {

  const { web5, myDid } = useContext( Web5Context);


  const [usersDetails, setUsersDetails] = useState<User[]>([]);
  const [recipientDid, setRecipientDid] = useState("");
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fetchDetailsLoading, setFetchDetailsLoading] = useState(false);
  const [popupOpenMap, setPopupOpenMap] = useState<{ [key: number]: boolean }>({});
  const [personalData, setPersonalData] = useState<{ name: string; dateOfBirth: string; phone: string; maritalStatus: string; gender: string; email: string; }>({
    name: '',
    dateOfBirth: '',
    maritalStatus: '',
    gender: '',
    email: '',
    phone: '',
  }); 

  const [showDetails, setShowDetails] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null); 
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleDetails = () => {
    setShowDetails((prevShowDetails) => !prevShowDetails);
  };

  useEffect(() => {
    fetchHealthDetails();
  }, []);

  const togglePopup = (userId: string) => {
    usersDetails.map((user) => { 
      if (user.recordId === userId) {
        setPersonalData({
          name: user.name,
          dateOfBirth: user.dateOfBirth,
          maritalStatus: user.maritalStatus,
          gender: user.gender,
          email: user.email,
          phone: user.phone,
        });
      }
    });
    setPopupOpenMap((prevMap) => ({
      ...prevMap,
      [userId]: !prevMap[userId],
    }));
  };
  
const closePopup = (userId: string) => {
  setPopupOpenMap((prevMap) => ({
    ...prevMap,
    [userId]: false,
  }));
};

const fetchHealthDetails = async () => {
  setFetchDetailsLoading(true);
  try {
    const response = await web5.dwn.records.query({
      from: myDid,
      message: {
        filter: {
            protocol: 'https://rapha.com/protocol',
            protocolPath: 'patientProfile',
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
        localStorage.setItem('recordId', JSON.stringify(record.id));
        localStorage.setItem('contextId', JSON.stringify(record.contextId));
          return {
            ...data,
            recordId: record.id,
          };
        })
      );
      setUsersDetails(healthDetails);
      console.log(healthDetails);
      toast.success('Successfully fetched health details', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      setFetchDetailsLoading(false);
    } else {
      console.error('No health details found');
      toast.error('Failed to fetch health details', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    setFetchDetailsLoading(false);
  } catch (err) {
    console.error('Error in fetchHealthDetails:', err);
    toast.error('Error in fetchHealthDetails. Please try again later.', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
    setFetchDetailsLoading(false);
  };
};


const shareHealthDetails = async (recordId: string) => {
  setShareLoading(true);
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          recordId: recordId,
        },
      },
    });

    if (response.records && response.records.length > 0) {
      const record = response.records[0];
      const { status } = await record.send(recipientDid);
      console.log('Send record status in shareProfile', status);
      toast.success('Successfully shared health record', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      setShareLoading(false);
      setSharePopupOpen(false);
    } else {
      console.error('No record found with the specified ID');
      toast.error('Failed to share health record', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    setShareLoading(false);
  } catch (err) {
    console.error('Error in shareProfile:', err);
    toast.error('Error in shareProfile. Please try again later.', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
    setShareLoading(false);
  }
};

const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  //  if (name === 'name' || name === 'nationality' ) {
  //   // Use a regular expression to allow only letters and spaces
  //   const letterRegex = /^[A-Za-z\s]+$/;
  //   if (!value.match(letterRegex) && value !== '') {
  //     // If the input value doesn't match the regex and it's not an empty string, do not update the state
  //     return;
  //   }
  // }

  setPersonalData((prevFormData) => ({
    ...prevFormData,
    [name]: value,
  }));

  const file = e.target.files?.[0];

  if (file) {
    setSelectedFileName(file.name);
  } 
};

const showDeleteConfirmation = (userId: string) => {
    setUserToDeleteId(userId);
    setDeleteConfirmationVisible(true);
  };

  const hideDeleteConfirmation = () => {
    setUserToDeleteId(null);
    setDeleteConfirmationVisible(false);
  };

  const updateHealthDetails = async (recordId, data) => {
    setUpdateLoading(true);
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          recordId: recordId,
        },
      },
    });

    if (response.records && response.records.length > 0) {
      const record = response.records[0];
      const updateResult = await record.update({data: data});
      togglePopup(recordId)
      if (updateResult.status.code === 202) {
        toast.success('Health Details updated successfully.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, 
        });
        setUsersDetails(prevHealthDetails => prevHealthDetails.map(message => message.recordId === recordId ? { ...message, ...data } : message));
        setUpdateLoading(false);
      } else {
        console.error('Error updating message:', updateResult.status);
        toast.error('Error updating campaign', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, 
        });
        setUpdateLoading(false);
      }
    } else {
      console.error('No record found with the specified ID');
      toast.error('No record found with the specified ID', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });
    }
  } catch (error) {
    console.error('Error in updateHealthDetail:', error);
    toast.error('Error in updateHealthDetail:', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, 
    });
    setUpdateLoading(false);
  }
};


const deleteHealthDetails = async (recordId) => {
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          recordId: recordId,
        },
      },
    });
    console.log(response);
    if (response.records && response.records.length > 0) {
      const record = response.records[0];
      console.log(record)
      const deleteResult = await web5.dwn.records.delete({
        message: {
          recordId: recordId
        },
      });

      const remoteResponse = await web5.dwn.records.delete({
        from: myDid,
        message: {
          recordId: recordId,
        },
      });
      console.log(remoteResponse);
      
      if (deleteResult.status.code === 202) {
        console.log('Health Details deleted successfully');
        toast.success('Health Details deleted successfully', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, 
        });
        setUsersDetails(prevHealthDetails => prevHealthDetails.filter(message => message.recordId !== recordId));
      } else {
        console.error('Error deleting record:', deleteResult.status);
        toast.error('Error deleting record:', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, 
        });
      }
    } else {
      // console.error('No record found with the specified ID');
    }
  } catch (error) {
    console.error('Error in deleteHealthDetails:', error);
  }
};

  

  return (
    <div className="lg:mx-5 flex flex-col rounded-lg border break-words border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
     <div className="flex flex-row mb-5 items-center gap-4 justify-end">
      {/* <button 
        onClick={fetchHealthDetails}
        className=" items-center  rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover-bg-opacity-90">
        {fetchDetailsLoading ? (
          <div className="flex items-center">
            <div className="spinner"></div>
            <span className="pl-1">Fetching...</span>
          </div>
        ) : (
          <>Fetch Profile</>
        )}           
      </button> */}
      <div className="relative">
        <button
          onClick={toggleDetails}
          className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
    </div>
    {usersDetails.length > 0 ? (
      <div className="flex flex-row flex-wrap justify-evenly gap-2">
      {usersDetails.map((user, index) => (
      <div className="" key={index}>
        <div className='flex mb-10 p-5 flex-wrap w-full shadow-2xl rounded-lg'>
        <div className='w-full mb-5 font-medium text-black text-xl'>Identification Information</div>
        <div className='w-1/3 mb-5' >
          <span className="text-xl">Name</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.name : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Date of Birth</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.dateOfBirth : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Gender</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.gender : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Marital Status</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.maritalStatus : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Email Address</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.email : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Phone Number</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.phone : '********'}
          </h4>
        </div>
      </div> 

      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <AllergyDetails />
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <CardiologyDetails />
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <DiagnosisDetails />
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <ImmunizationDetails />
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <InsuranceDetails />
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <LabTestDetails />
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <MedicalHistoryDetails />
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <SurgeryDetails />
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <VitalSignsDetails />
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <PhysicalDetails />
      </div>

        <div className='w-full flex flex-row justify-evenly mb-5'>
          <div className="relative">
            <button
              ref={trigger}
              onClick={() => setSharePopupOpen(!sharePopupOpen)}
              className="inline-flex items-center justify-center rounded-full bg-success py-3 px-7 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Share
            </button>
            {sharePopupOpen && (
                <div
                  ref={popup}
                  className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                >
                  <div
                      className="lg:mt-15 lg:w-1/2 rounded-lg bg-white dark:bg-dark pt-3 px-4 shadow-md"
                      style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll' }}
                    >      
                    <div
                      className="w-full wow fadeInUp mb-12 rounded-lg bg-primary/[5%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                      data-wow-delay=".15s
                      ">        
                        <div className="flex flex-row justify-between ">
                          <h2 className="text-xl font-semibold mb-4">Share Health Details</h2>
                          <div className="flex justify-end">
                            <button
                              onClick={() => setSharePopupOpen(false)}
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
                    <div className="-mx-4 flex flex-wrap">
                      <div className="w-full px-4">
                        <div className="mb-8">
                          <label
                            htmlFor="recipientDid"
                            className="mb-3 block text-sm font-medium text-dark dark:text-white"
                          >
                            Recipient DID
                          </label>
                          <div>
                          <input
                            type="text"
                            name="recipientDid"
                            value={recipientDid}
                            onChange={(e) => setRecipientDid(e.target.value)}
                            placeholder="Paste Recipient DID"
                            required
                            className="w-full rounded-lg border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                          />
                          </div>
                        </div>
                      </div>
                      
                      
                      <div className="w-full px-4">
                        <button 
                          type="button"
                          onClick={() => shareHealthDetails(user.recordId)}
                          disabled={shareLoading}
                          className="rounded-lg bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                          {shareLoading ? (
                            <div className="flex items-center">
                              <div className="spinner"></div>
                              <span className="pl-1">Sharing...</span>
                            </div>
                          ) : (
                            <>Share</>
                          )}
                        </button>
                      </div>
                    </div>
                      </form>
                      </div>
                    </div>
                </div>
              )}
          </div>
        </div>
      </div>
      ))}
      </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <div className="text-md font-medium text-gray-500 dark:text-gray-400">
            No Details yet
          </div>
        </div>
      )}
    </div>

  );
};

export default HealthDetails;
