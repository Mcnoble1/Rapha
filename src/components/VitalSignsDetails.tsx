import { useState, useRef, useContext, ChangeEvent, useEffect, FormEvent } from 'react';
import { toast } from 'react-toastify'; 
import { Web5Context } from "../utils/Web5Context";
import 'react-toastify/dist/ReactToastify.css'; 
import '../pages/signin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faShare, faAngleDown } from '@fortawesome/free-solid-svg-icons';

const VitalSignsDetails = () => {
  
  const { web5, myDid, profileProtocolDefinition, userType } = useContext( Web5Context);

  const [isCardOpen, setCardOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [recipientDid, setRecipientDid] = useState("");
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [fetchDetailsLoading, setFetchDetailsLoading] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  const [vitalSignsData, setVitalSignsData] = useState<{ bloodPressure: string; heartRate: string; respiratoryRate: string; bodyTemperature: string; }>({
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    bodyTemperature: '',
  }); 

  const parentId = JSON.parse(localStorage.getItem('recordId'));
  const contextId = JSON.parse(localStorage.getItem('contextId'));

  useEffect(() => {
    fetchVitalSignsDetails();
  }, []);

  const showDeleteConfirmation = (userId: string) => {
    setUserToDeleteId(userId);
    setDeleteConfirmationVisible(true);
  };

  const hideDeleteConfirmation = () => {
    setUserToDeleteId(null);
    setDeleteConfirmationVisible(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    const file = e.target.files?.[0];
  
      if (file) {
        setSelectedFileName(file.name);
      }
  
      if (name === 'phone' ) {
        const phoneRegex = /^[+]?[0-9\b]+$/;
          
        if (!value.match(phoneRegex) && value !== '') {
          return;
        }
      } else if (name === 'name' || name === 'nationality' || name === 'language') {
        const letterRegex = /^[A-Za-z\s]+$/;
        if (!value.match(letterRegex) && value !== '') {
          return;
        }
      }
  
    setVitalSignsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddProfile = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); 
  
    // const requiredFields = ['name', 'gender', 'phone', 'nationality', 'language', 'address'];
    // const emptyFields = requiredFields.filter((field) => !formData[field]);
  
    // if (emptyFields.length > 0) {
    //   toast.error('Please fill in all required fields.', {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 3000, 
    //   });
    //   requiredFields.forEach((field) => {
    //     if (!formData[field]) {
    //       const inputElement = document.querySelector(`[name="${field}"]`);
    //       if (inputElement) {
    //         inputElement.parentElement?.classList.add('error-outline');
    //       }
    //     }
    //   });
    //   setLoading(false);
    //   return; 
    // }

    const vitalSignsdata = new FormData();
    vitalSignsdata.append('bloodPressure', vitalSignsData.bloodPressure);
    vitalSignsdata.append('heartRate', vitalSignsData.heartRate);
    vitalSignsdata.append('respiratoryRate', vitalSignsData.respiratoryRate);
    vitalSignsdata.append('bodyTemperature', vitalSignsData.bodyTemperature);

    setLoading(false);
  
    try {
      let record;
      console.log(vitalSignsData);
      record = await writeProfileToDwn(vitalSignsData);
  
      if (record) {
        const { status } = await record.send(myDid);
        console.log("Send record status in handleAddVitalSigns", status);
      } else {
        toast.error('Failed to create health record', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, 
          });
          setLoading(false);
        throw new Error('Failed to create health record');       
      }
  
      setVitalSignsData({
        bloodPressure: '',
        heartRate: '',
        respiratoryRate: '',
        bodyTemperature: '',
      })
  
      setPopupOpen(false);
      toast.success('Successfully created health record', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });
  
      setLoading(false);
      fetchVitalSignsDetails();
    } catch (err) {
        console.error('Error in handleCreateCause:', err);
        toast.error('Error in handleAddProfile. Please try again later.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000, // Adjust the duration as needed
        });
        setLoading(false);
      } 
  };

  const writeProfileToDwn = async (vitalSignsDetails : any) => {

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const timestamp = `${currentDate} ${currentTime}`;

    try {
      const healthProtocol = profileProtocolDefinition;
      const { record, status } = await web5.dwn.records.write({
        data: {...vitalSignsData, timestamp: timestamp},
        message: {
          protocol: healthProtocol.protocol,
          protocolPath: 'patientProfile/vitalSignsRecord',
          schema: healthProtocol.types.vitalSignsRecord.schema,
          recipient: myDid,
          parentId: parentId,
          contextId: contextId,
        },
      });

      if (status === 200) {
        return { ...vitalSignsDetails, recordId: record.id}
      } 
      console.log('Successfully wrote health details to DWN:', record);
      toast.success('VitalSigns Details written to DWN', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });
      return record;
    } catch (err) {
      console.error('Failed to write health details to DWN:', err);
      toast.error('Failed to write health details to DWN. Please try again later.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
   }; 

   const fetchVitalSignsDetails = async () => {
    setFetchDetailsLoading(true);
    try {
      const response = await web5.dwn.records.query({
        from: myDid,
        message: {
          filter: {
              protocol: 'https://rapha.com/protocol',
              protocolPath: 'patientProfile/vitalSignsRecord',
          },
        },
      });
      console.log('VitalSigns Details:', response);
  
      if (response.status.code === 200) {
        const vitalSignsDetails = await Promise.all(
          response.records.map(async (record) => {
            const data = await record.data.json();
            console.log(data);
            return {
              ...data,
              recordId: record.id,
            };
          })
        );
        setUserDetails(vitalSignsDetails);
        console.log(vitalSignsDetails);
        toast.success('Successfully fetched vitalSigns details', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        setFetchDetailsLoading(false);
      } else {
        console.error('No vitalSigns details found');
        toast.error('Failed to fetch vitalSigns details', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
      setFetchDetailsLoading(false);
    } catch (err) {
      console.error('Error in fetchVitalSignsDetails:', err);
      toast.error('Error in fetchVitalSignsDetails. Please try again later.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      setFetchDetailsLoading(false);
    };
  };

   const shareVitalSignsDetails = async (recordId: string) => {
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

  const deleteVitalSignsDetails = async (recordId) => {
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
          console.log('VitalSigns Details deleted successfully');
          toast.success('VitalSigns Details deleted successfully', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000, 
          });
          setUserDetails(prevVitalSignsDetails => prevVitalSignsDetails.filter(message => message.recordId !== recordId));
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
      console.error('Error in deleteVitalSignsDetails:', error);
    }
  };

   return (
    <>
      <div className="flex flex-row gap-10 w-full bg-white dark:border-strokedark dark:bg-boxdark">
        <div className='w-full mb-5 font-medium text-black text-xl'>
          VitalSigns Information
        </div>
        <div className="flex flex-row mb-5 items-center gap-10 justify-end">
          {userType === 'doctor' && (
            <>
            <button
            ref={trigger}
            onClick={() => setPopupOpen(!popupOpen)}
            className=""
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
            {popupOpen && (
                <div
                  ref={popup}
                  className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                >
                  <div
                    className="bg-white lg:mt-15 lg:w-1/2 rounded-lg pt-3 px-4 shadow-md"
                    style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll' }}
                  >
                    <div className="flex flex-row justify-between">
                      <h2 className="text-xl px-6.5 pt-6.5 font-semibold mb-4">VitalSigns Details</h2>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setPopupOpen(false)} 
                          className="text-blue-500 hover:text-gray-700 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 fill-current bg-primary rounded-full p-1 hover:bg-opacity-90"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <form>
                    <div className= "rounded-sm px-6.5 bg-white dark:border-strokedark dark:bg-boxdark">
                      <h3 className="mb-2.5 block font-semibold dark:text-white"></h3>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-3/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Blood Pressure
                        </label>
                        <div className={`relative ${userDetails?.bloodPressure ? 'bg-light-blue' : ''}`}>
                        <input
                          type="text"
                          name="bloodPressure"
                          required
                          value={userDetails?.bloodPressure}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                        </div>
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Heart Rate
                        </label>
                        <div className={`relative ${userDetails?.heartRate ? 'bg-light-blue' : ''}`}>
                        <input
                           type="text" 
                          name="heartRate"
                          required
                          value={userDetails?.heartRate}
                          placeholder='Severity'
                          onChange={handleInputChange}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                        </div>
                      </div> 

                      <div className="w-full xl:w-3/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Respiratory Rate
                        </label>
                        <div className={`relative ${userDetails?.respiratoryRate ? 'bg-light-blue' : ''}`}>
                        <input
                            type='text'
                              name="respiratoryRate"
                              value={userDetails?.respiratoryRate}
                              onChange={handleInputChange}
                              required
                              placeholder='Reaction'
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                          </div>
                      </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                           
                      <div className="w-full xl:w-2/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Body Temperature
                        </label>
                        <div className={`relative ${userDetails?.bodyTemperature ? 'bg-light-blue' : ''}`}>
                        <input
                          type="text"
                          name="bodyTemperature"
                          value={userDetails?.bodyTemperature}
                          required
                          onChange={handleInputChange}
                          placeholder="Notes"
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                        </div>
                      </div>
                    </div>                     
                    </div>

                    </form>
                      <button
                        type="button"
                        onClick={handleAddProfile}
                        disabled={loading}
                        className={`mr-5 mb-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="spinner"></div>
                            <span className="pl-1">Creating...</span>
                          </div>
                        ) : (
                          <>Add Details</>
                        )}
                      </button>
                  </div>
                </div>
                )}
            </>
          )}

          <button
           ref={trigger}
           onClick={() => setSharePopupOpen(!sharePopupOpen)}
            className=""
          >
            <FontAwesomeIcon icon={faShare} />
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
                          <h2 className="text-xl font-semibold mb-4">Share VitalSigns Details</h2>
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
                          onClick={() => shareVitalSignsDetails(userDetails.recordId)}
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

          <button
            onClick={() => setCardOpen(!isCardOpen)}
            className=""
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
        </div>
      </div>

      {isCardOpen && (
        <>
            {userDetails?.length > 0 ? (
            <>
            {userDetails?.map((user, index) => (
          <div className="flex w-full" key={index}>
            <div className='w-1/3 mb-5'>
              <span className="text-xl">Blood Pressure</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.bloodPressure}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">Heart Rate</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.heartRate}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">Respiratory Rate</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.respiratoryRate}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">Body Temperature</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.bodyTemperature}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">Timestamp</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.timestamp}
              </h4>
            </div>

            {userType === 'doctor' && (
            <>
            <button
                onClick={() => showDeleteConfirmation(user.recordId)}
                className="rounded-lg bg-danger py-0 px-3 h-10 text-center font-medium text-white hover-bg-opacity-90"
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
                          deleteVitalSignsDetails(user.recordId);
                        }}
                        className="rounded bg-danger py-2 px-3 text-white hover:bg-opacity-90"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
               </>
              )}
          </div>
           ))}
            </>
          ) : (
            <div className="flex flex-row justify-center items-center w-full h-full">
              <div className="flex p-10 flex-col justify-center items-center">
                <p className="text-md font-medium text-black dark:text-white">
                  No VitalSigns Information
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );

};

export default VitalSignsDetails;
