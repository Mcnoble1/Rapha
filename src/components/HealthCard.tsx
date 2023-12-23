import { useState, useRef, useContext, ChangeEvent, FormEvent } from 'react';
import Image from '../images/user/3.png';
import { toast } from 'react-toastify'; 
import { Web5Context } from "../utils/Web5Context";
import 'react-toastify/dist/ReactToastify.css'; 
import '../pages/signin.css';
const HealthCard = () => {
  
  const { web5, myDid, profileProtocolDefinition } = useContext( Web5Context);
  
  const [popupOpen, setPopupOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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


  const [allergyData, setAllergyData] = useState<{ name: string; severity: string; reaction: string; treatment: string; }>({
    name: '',
    severity: '',
    reaction: '',
    treatment: '',
  }); 

  const [cardiologyData, setCardiologyData] = useState<{ heartCondition: string; testPerformed: string; testResult: string; treatment: string; }>({
    heartCondition: '',
    testPerformed: '',
    testResult: '',
    treatment: '',
  }); 

  const [diagnosisData, setDiagnosisData] = useState<{ diagnosis: string; treatment: string; prescibingDoctor: string; }>({
    diagnosis: '',
    treatment: '',
    prescibingDoctor: '',
  }); 

  const [immunizationData, setImmunizationData] = useState<{ vaccineName: string; vaccineType: string; dateAdministered: string; lotNumber: string; nextScheduled: string }>({
    vaccineName: '',
    vaccineType: '',
    dateAdministered: '',
    lotNumber: '',
    nextScheduled: '',
  }); 

  const [insuranceData, setInsuranceData] = useState<{ provider: string; policyNumber: string; contactInfo: string; }>({
    provider: '',
    policyNumber: '',
    contactInfo: '',
  }); 

  const [labTestData, setLabTestData] = useState<{ name: string; dateConducted: string; result: string; referenceRange: string; }>({
    name: '',
    dateConducted: '',
    result: '',
    referenceRange: '',
  }); 

  const [medicalHistoryData, setMedicalHistoryData] = useState<{ medication: string; dosage: string; frequency: string; prescribingDoctor: string; }>({
    medication: '',
    dosage: '',
    frequency: '',
    prescribingDoctor: '',
  }); 

  const [surgeryData, setSurgeryData] = useState<{ surgeryType: string; date: string; surgeon: string; notes: string; }>({
    surgeryType: '',
    date: '',
    surgeon: '',
    notes: '',
  }); 

  const [vitaSignsData, setVitalSignsData] = useState<{ bloodPressure: string; heartRate: string; respiratoryRate: string; bodyTemperature: string; }>({
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    bodyTemperature: '',
  }); 

  const [physicalData, setPhysicalData] = useState<{ height: string; weight: string; bmi: string; genotype: string; bloodGroup: string; rhesusFactor: string; }>({
    height: '',
    weight: '',
    bmi: '',
    genotype: '',
    bloodGroup: '',
    rhesusFactor: '',
  }); 

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  
    setPersonalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

    const personaldata = new FormData();
    personaldata.append("name", personalData.name);
    personaldata.append("dateOfBirth", personalData.dateOfBirth);
    personaldata.append("maritalStatus", personalData.maritalStatus);
    personaldata.append("identificationNumber", personalData.identificationNumber);
    personaldata.append("gender", personalData.gender);
    personaldata.append("homeAddress", personalData.homeAddress);
    personaldata.append("email", personalData.email);
    personaldata.append("city", personalData.city);
    personaldata.append("state", personalData.state);
    personaldata.append("country", personalData.country);
    personaldata.append("phone", personalData.phone);

    const guardiandata = new FormData();
    guardiandata.append("name", guardianData.name);
    guardiandata.append("phone", guardianData.phone);
    guardiandata.append("relationship", guardianData.relationship);
    guardiandata.append("gender", guardianData.gender);
    guardiandata.append("homeAddress", guardianData.homeAddress);
    guardiandata.append("email", guardianData.email);
    guardiandata.append("city", guardianData.city);
    guardiandata.append("state", guardianData.state);
    guardiandata.append("country", guardianData.country);

    const primaryDoctordata = new FormData();
    primaryDoctordata.append("name", primaryDoctorData.name);
    primaryDoctordata.append("hospital", primaryDoctorData.hospital);
    primaryDoctordata.append("phone", primaryDoctorData.phone);
    primaryDoctordata.append("specialty", primaryDoctorData.specialty);
    primaryDoctordata.append("gender", primaryDoctorData.gender);
    primaryDoctordata.append("homeAddress", primaryDoctorData.homeAddress);
    primaryDoctordata.append("email", primaryDoctorData.email);
    primaryDoctordata.append("city", primaryDoctorData.city);
    primaryDoctordata.append("state", primaryDoctorData.state);
    primaryDoctordata.append("country", primaryDoctorData.country);

    setLoading(false);
  
    try {
      let record;
      console.log(personalData, guardianData, primaryDoctorData);
      record = await writeProfileToDwn({...personalData, ...guardianData, ...primaryDoctorData});
  
      if (record) {
        const { status } = await record.send(myDid);
        console.log("Send record status in handleAddProfile", status);
      } else {
        toast.error('Failed to create health record', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, 
          });
          setLoading(false);
        throw new Error('Failed to create health record');       
      }
  
      setPersonalData({
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
      })

      setGuardianData({
        name: '',
        relationship: '',
        gender: '',
        homeAddress: '',
        email: '',
        city: '',
        state: '',
        country: '',
        phone: '',
      })

      setPrimaryDoctorData({
        name: '',
        hospital: '',
        specialty: '',
        gender: '',
        homeAddress: '',
        email: '',
        city: '',
        state: '',
        country: '',
        phone: '', 
      })
  
      setPopupOpen(false);
      toast.success('Successfully created health record', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });
  
      setLoading(false);
  
    } catch (err) {
        console.error('Error in handleCreateCause:', err);
        toast.error('Error in handleAddProfile. Please try again later.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000, // Adjust the duration as needed
        });
        setLoading(false);
      } 
  };

  const writeProfileToDwn = async (profileData) => {
    try {
      const healthProtocol = profileProtocolDefinition;
      const { record, status } = await web5.dwn.records.write({
        data: profileData,
        message: {
          protocol: healthProtocol.protocol,
          protocolPath: 'patientProfile',
          schema: healthProtocol.types.patientProfile.schema,
          recipient: myDid,
        },
      });

      if (status === 200) {
        return { ...profileData, recordId: record.id}
      } 
      console.log('Successfully wrote health details to DWN:', record);
      toast.success('Health Details written to DWN', {
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

  return (
    <div className="w-full md:w-3/5 flex justify-between rounded-lg border border-stroke bg-white py-7.5 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
       <div className="">
          <h4 className="text-2xl font-bold text-black dark:text-white">
            Health Details
          </h4>
          <button
            ref={trigger}
            onClick={() => setPopupOpen(!popupOpen)}
            className="inline-flex mt-30 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover-bg-opacity-90 lg:px-8 xl:px-10">
            Add Profile
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
                      <h2 className="text-xl px-6.5 pt-6.5 font-semibold mb-4">Add Personal Details</h2>
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
                          Idenetification Number
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
        </div>
        <div>
          <img src={Image} width={200} height={200} />
        </div>
      </div>
  );
};

export default HealthCard;
