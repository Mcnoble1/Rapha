import { useState, useRef, ChangeEvent, FormEvent, useContext } from 'react';
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
  const [personalData, setPersonalData] = useState<{ name: string; dateOfBirth: string; phone: string; maritalStatus: string; identificationNumber: string; gender: string; homeAddress: string; email: string; city: string; state: string; country: string; }>({
    name: '',
    dateOfBirth: '',
    maritalStatus: '',
    identificationNumber: '',
    gender: '',
    homeAddress: '',
    email: '',
    city: '',
    state: '',
    country: '',
    phone: '',
  }); 

  const [guardianData, setGuardianData] = useState<{ guardianName: string; guardianPhone: string; relationship: string; guardianGender: string; guardianHomeAddress: string; guardianEmail: string; guardianCity: string; guardianState: string; guardianCountry: string; }>({
    guardianName: '',
    relationship: '',
    guardianGender: '',
    guardianHomeAddress: '',
    guardianEmail: '',
    guardianCity: '',
    guardianState: '',
    guardianCountry: '',
    guardianPhone: '',
  }); 

  const [primaryDoctorData, setPrimaryDoctorData] = useState<{ doctorName: string; hospital: string; doctorPhone: string; specialty: string; doctorGender: string; doctorHomeAddress: string; doctorEmail: string; doctorCity: string; doctorState: string; doctorCountry: string; }>({
    doctorName: '',
    hospital: '',
    specialty: '',
    doctorGender: '',
    doctorHomeAddress: '',
    doctorEmail: '',
    doctorCity: '',
    doctorState: '',
    doctorCountry: '',
    doctorPhone: '',
  }); 

  const [showDetails, setShowDetails] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null); 
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleGuardianInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setGuardianData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePrimaryDoctorInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setPrimaryDoctorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleDetails = () => {
    setShowDetails((prevShowDetails) => !prevShowDetails);
  };

  const togglePopup = (userId: string) => {
    usersDetails.map((user) => { 
      if (user.recordId === userId) {
        setPersonalData({
          name: user.name,
          dateOfBirth: user.dateOfBirth,
          maritalStatus: user.maritalStatus,
          gender: user.gender,
          identificationNumber: user.identificationNumber,
          homeAddress: user.homeAddress,
          email: user.email,
          city: user.city,
          state: user.state,
          country: user.country,
          phone: user.phone,
          guardianName: user.guardianName,
          relationship: user.relationship,
          guardianGender: user.guardianGender,
          guardianHomeAddress: user.guardianHomeAddress,
          guardianEmail: user.guardianEmail,
          guardianCity: user.guardianCity,
          guardianState: user.guardianState,
          guardianCountry: user.guardianCountry,
          guardianPhone: user.guardianPhone,
          doctorName: user.doctorName,
          hospital: user.hospital,
          specialty: user.specialty,
          doctorGender: user.doctorGender,
          doctorHomeAddress: user.doctorHomeAdress,
          doctorEmail: user.doctorEmail,
          doctorCity: user.doctorCity,
          doctorState: user.doctorState,
          doctorCountry: user.doctorCountry,
          doctorPhone: user.doctorPhone,
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
      <button 
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
      </button>
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
          <span className="text-xl">Identification Number</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.identificationNumber : '********'}
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

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Home Address</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.homeAddress : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">City</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.city : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">State</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.state : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Country</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.country : '********'}
          </h4>
        </div>
      </div>

      <div className='flex mb-10 p-5 flex-wrap w-full shadow-2xl rounded-lg'>
        <div className='w-full mb-5 font-medium text-black text-xl'>Guardian Information</div>
        <div className='w-1/3 mb-5' >
          <span className="text-xl">Name</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.guardianName : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Relationship</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.relationship : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Gender</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.guardianGender : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Email Address</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.guardianEmail : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Phone Number</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.guardianPhone : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Home Address</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.guardianHomeAddress : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">City</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.guardianCity : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">State</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.guardianState : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Country</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.guardianCountry : '********'}
          </h4>
        </div>
      </div>

      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <div className='w-full mb-5 font-medium text-black text-xl'>Primary Doctor Information</div>
        <div className='w-1/3 mb-5' >
          <span className="text-xl">Name</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.doctorName : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Gender</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.doctorGender : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
        <span className="text-xl">Hospital</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.hospital : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
        <span className="text-xl">Specialty</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.specialty : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
        <span className="text-xl">Email Address</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.doctorEmail : '********'}
          </h4> 
        </div>

        <div className='w-1/3 mb-5' >
        <span className="text-xl">Phone Number</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.doctorPhone : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
        <span className="text-xl">Home Address</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.doctorHomeAddress : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
        <span className="text-xl">City</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.doctorCity : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
        <span className="text-xl">State</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.doctorState : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
        <span className="text-xl">Country</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.doctorCountry : '********'}
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

          <div className="relative">
            <button
              onClick={() => togglePopup(user.recordId)}                      
              className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
              Edit
            </button>
              {popupOpenMap[user.recordId] && (
                    <div
                      ref={popup}
                      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                    >
                      <div
                          className="bg-white lg:mt-15 lg:w-1/2 rounded-lg pt-3 px-4 shadow-md"
                          style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll' }}
                        >              
                            <div className="flex flex-row justify-between">
                            <h2 className="text-xl font-semibold mb-4">Edit User Details</h2>
                            <div className="flex justify-end">
                              <button
                                onClick={() => closePopup(user.recordId)}
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
                        <h3 className="mb-2.5 block font-semibold dark:text-white">Personal Information</h3>
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-3/5">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Name
                          </label>
                          <div className={`relative ${personalData.name ? 'bg-light-blue' : ''}`}>
                          <input
                            type="text"
                            name="name"
                            required
                            value={personalData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                          </div>
                        </div>

                        <div className="w-full xl:w-1/2">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Date of Birth
                          </label>
                          <div className={`relative ${personalData.dateOfBirth ? 'bg-light-blue' : ''}`}>
                          <input
                            type="date" 
                            name="dateOfBirth"
                            required
                            value={personalData.dateOfBirth}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                          </div>
                        </div> 

                        <div className="w-full xl:w-3/5">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Marital Status
                          </label>
                          <div className={`relative ${personalData.maritalStatus ? 'bg-light-blue' : ''}`}>
                          <select
                                name="maritalStatus"
                                value={personalData.maritalStatus}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary">
                                <option value="">Select Status</option>                        
                                <option value="Married">Married</option>
                                <option value="Single">Single</option>
                              </select>                        
                            </div>
                        </div>
                      </div>

                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            
                        <div className="w-full xl:w-3/5">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Identification Number
                          </label>
                          <div className={`relative ${personalData.identificationNumber ? 'bg-light-blue' : ''}`}>
                          <input
                            type="text"
                            name="identificationNumber"
                            value={personalData.identificationNumber}
                            required
                            onChange={handleInputChange}
                            placeholder="SSN123456"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                          </div>
                        </div>

                        <div className="w-full xl:w-3/5">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Gender
                          </label>
                          <div className={`relative ${personalData.gender ? 'bg-light-blue' : ''}`}>
                          <select
                                name="gender"
                                value={personalData.gender}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary">
                                <option value="">Select Gender</option>                        
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>                        
                            </div>
                        </div>

                        <div className="w-full xl:w-3/5">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Phone Number
                          </label>
                          <div className={`relative ${personalData.phone ? 'bg-light-blue' : ''}`}>
                          <input
                            type="text"
                            name="phone"
                            value={personalData.phone}
                            required
                            onChange={handleInputChange}
                            placeholder="+234 80123456"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            
                        <div className="w-full xl:w-3/5">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Email Address
                          </label>
                          <div className={`relative ${personalData.email ? 'bg-light-blue' : ''}`}>
                          <input
                            type="text"
                            name="email"
                            value={personalData.email}
                            required
                            onChange={handleInputChange}
                            placeholder="xyz@gmail.com"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                          </div>
                        </div>

                        <div className="w-full xl:w-3/5">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Home Address
                          </label>
                          <div className={`relative ${personalData.homeAddress ? 'bg-light-blue' : ''}`}>
                          <input
                            type="text"
                            name="homeAddress"
                            value={personalData.homeAddress}
                            required
                            onChange={handleInputChange}
                            placeholder="Phoenix Court, 1st Avenue, Gwarinpa, Abuja"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                          </div>
                        </div>

                        <div className="w-full xl:w-3/5">
                          <label className="mb-2.5 block text-black dark:text-white">
                            City
                          </label>
                          <div className={`relative ${personalData.city ? 'bg-light-blue' : ''}`}>
                          <input
                            type="text"
                            name="city"
                            value={personalData.city}
                            required
                            onChange={handleInputChange}
                            placeholder="Lagos"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                          </div>
                        </div>

                      </div>

                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            
                        <div className="w-full xl:w-3/5">
                          <label className="mb-2.5 block text-black dark:text-white">
                            State
                          </label>
                          <div className={`relative ${personalData.state ? 'bg-light-blue' : ''}`}>
                          <input
                            type="text"
                            name="state"
                            value={personalData.state}
                            required
                            onChange={handleInputChange}
                            placeholder="US-CA"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                          </div>
                        </div>

                        <div className="w-full xl:w-3/5">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Country
                          </label>
                          <div className={`relative ${personalData.country ? 'bg-light-blue' : ''}`}>
                          <input
                            type="text"
                            name="country"
                            value={personalData.country}
                            required
                            onChange={handleInputChange}
                            placeholder="USA"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                          </div>
                        </div>
                      </div>            
                            </div>

                          <div className= "rounded-sm px-6.5 mt-10 bg-white dark:border-strokedark dark:bg-boxdark">
                              <h3 className="mb-2.5 block font-semibold dark:text-white">Guardian Information</h3>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Name
                                </label>
                                <div className={`relative ${guardianData.guardianName ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="guardianName"
                                  required
                                  value={guardianData.guardianName}
                                  onChange={handleGuardianInputChange}
                                  placeholder="John Doe"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Gender
                                </label>
                                <div className={`relative ${guardianData.guardianGender ? 'bg-light-blue' : ''}`}>
                                <select
                                      name="guardianGender"
                                      value={guardianData.guardianGender}
                                      onChange={handleGuardianInputChange}
                                      required
                                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary">
                                      <option value="">Select Gender</option>                        
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </select>                        
                                  </div>
                              </div>   

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Relationship to Patient
                                </label>
                                <div className={`relative ${guardianData.relationship ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="relationship"
                                  value={guardianData.relationship}
                                  required
                                  onChange={handleGuardianInputChange}
                                  placeholder="Partner"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>                
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                              
                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Phone Number
                                </label>
                                <div className={`relative ${guardianData.guardianPhone ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="guardianPhone"
                                  value={guardianData.guardianPhone}
                                  required
                                  onChange={handleGuardianInputChange}
                                  placeholder="+234 80123456"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Email Address
                                </label>
                                <div className={`relative ${guardianData.guardianEmail ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="guardianEmail"
                                  value={guardianData.guardianEmail}
                                  required
                                  onChange={handleGuardianInputChange}
                                  placeholder="xyz@gmail.com"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Home Address
                                </label>
                                <div className={`relative ${guardianData.guardianHomeAddress ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="guardianHomeAddress"
                                  value={guardianData.guardianHomeAddress}
                                  required
                                  onChange={handleGuardianInputChange}
                                  placeholder="Phoenix Court, 1st Avenue"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  City
                                </label>
                                <div className={`relative ${guardianData.guardianCity ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="guardianCity"
                                  value={guardianData.guardianCity}
                                  required
                                  onChange={handleGuardianInputChange}
                                  placeholder="Lagos"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  State
                                </label>
                                <div className={`relative ${guardianData.guardianState ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="guardianState"
                                  value={guardianData.guardianState}
                                  required
                                  onChange={handleGuardianInputChange}
                                  placeholder="US-CA"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Country
                                </label>
                                <div className={`relative ${guardianData.guardianCountry ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="guardianCountry"
                                  value={guardianData.guardianCountry}
                                  required
                                  onChange={handleGuardianInputChange}
                                  placeholder="USA"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>
                            </div>
                          </div>


                          <div className= "rounded-sm px-6.5 mt-10 bg-white dark:border-strokedark dark:bg-boxdark">
                              <h3 className="mb-2.5 block font-semibold dark:text-white">Primary Medical Provider</h3>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Name
                                </label>
                                <div className={`relative ${primaryDoctorData.doctorName ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="doctorName"
                                  required
                                  value={primaryDoctorData.doctorName}
                                  onChange={handlePrimaryDoctorInputChange}
                                  placeholder="John Doe"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Hospital
                                </label>
                                <div className={`relative ${primaryDoctorData.hospital ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text" 
                                  name="hospital"
                                  required
                                  placeholder='John Hopkins Hospital'
                                  value={primaryDoctorData.hospital}
                                  onChange={handlePrimaryDoctorInputChange}
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div> 

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                Specialty
                                </label>
                                <div className={`relative ${primaryDoctorData.specialty ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="specialty"
                                  value={primaryDoctorData.specialty}
                                  required
                                  onChange={handlePrimaryDoctorInputChange}
                                  placeholder="Family Medicine"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                            <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Email Address
                                </label>
                                <div className={`relative ${primaryDoctorData.doctorEmail ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="doctorEmail"
                                  value={primaryDoctorData.doctorEmail}
                                  required
                                  onChange={handlePrimaryDoctorInputChange}
                                  placeholder="xyz@gmail.com"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Gender
                                </label>
                                <div className={`relative ${primaryDoctorData.doctorGender ? 'bg-light-blue' : ''}`}>
                                <select
                                      name="doctorGender"
                                      value={primaryDoctorData.doctorGender}
                                      onChange={handlePrimaryDoctorInputChange}
                                      required
                                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary">
                                      <option value="">Select Gender</option>                        
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </select>                        
                                  </div>
                              </div>

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Phone Number
                                </label>
                                <div className={`relative ${primaryDoctorData.doctorPhone ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="doctorPhone"
                                  value={primaryDoctorData.doctorPhone}
                                  required
                                  onChange={handlePrimaryDoctorInputChange}
                                  placeholder="+234 80123456"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                  
                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Home Address
                                </label>
                                <div className={`relative ${primaryDoctorData.doctorHomeAddress ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="doctorHomeAddress"
                                  value={primaryDoctorData.doctorHomeAddress}
                                  required
                                  onChange={handlePrimaryDoctorInputChange}
                                  placeholder="Phoenix Court, 1st Avenue, Gwarinpa, Abuja"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  City
                                </label>
                                <div className={`relative ${primaryDoctorData.doctorCity ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="doctorCity"
                                  value={primaryDoctorData.doctorCity}
                                  required
                                  onChange={handlePrimaryDoctorInputChange}
                                  placeholder="Lagos"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>

                              <div className="w-full xl:w-3/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  State
                                </label>
                                <div className={`relative ${primaryDoctorData.doctorState ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="doctorState"
                                  value={primaryDoctorData.doctorState}
                                  required
                                  onChange={handlePrimaryDoctorInputChange}
                                  placeholder="US-CA"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>

                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                  
                            
                              <div className="w-ful l xl:w-2/5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Country
                                </label>
                                <div className={`relative ${primaryDoctorData.doctorCountry ? 'bg-light-blue' : ''}`}>
                                <input
                                  type="text"
                                  name="doctorCountry"
                                  value={primaryDoctorData.doctorCountry}
                                  required
                                  onChange={handlePrimaryDoctorInputChange}
                                  placeholder="USA"
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                </div>
                              </div>
                            </div>      
                          </div>
                          </form>
                        <button
                          type="button"
                          onClick={() => updateHealthDetails(user.recordId, personalData)}
                          disabled={updateLoading}
                          className={`mr-5 mb-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {updateLoading ? (
                            <div className="flex items-center">
                              <div className="spinner"></div>
                              <span className="pl-1">Updating...</span>
                            </div>
                          ) : (
                            <>Update Details</>
                          )}
                        </button>
                        </div>
                    </div>
                  )}
          </div>

          <div className="relative">
            <button
              onClick={() => showDeleteConfirmation(user.recordId)}
              className="inline-flex items-center justify-center rounded-full bg-danger py-3 px-7 text-center font-medium text-white hover-bg-opacity-90 lg:px-8 xl:px-10"
            >
              Delete
            </button>
            {isDeleteConfirmationVisible && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
                <div className="bg-white p-5 rounded-lg shadow-md">
                  <p>Are you sure you want to delete your record?</p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={hideDeleteConfirmation}
                      className="mr-4 rounded bg-primary py-2 px-3 text-white hover:bg-opacity-90"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        hideDeleteConfirmation();
                        deleteHealthDetails(user.recordId);
                      }}
                      className="rounded bg-danger py-2 px-3 text-white hover:bg-opacity-90"
                    >
                      Confirm
                    </button>
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
