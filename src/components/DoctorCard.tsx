import { useState, useRef, useContext, ChangeEvent, FormEvent } from 'react';
import Image from '../images/user/3.png';
import { toast } from 'react-toastify'; 
import { Web5Context } from "../utils/Web5Context";
import 'react-toastify/dist/ReactToastify.css'; 
import '../pages/signin.css';
import { adminDid } from "../utils/Constants"

const HealthCard = () => {
  
  const { web5, myDid, profileProtocolDefinition } = useContext( Web5Context);
  
  const [popupOpen, setPopupOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [personalData, setPersonalData] = useState<{ name: string; yearsOfExperience: string; dateOfBirth: string; phone: string; hospital: string; specialty: string; identificationNumber: string; registrationNumber: string; gender: string; homeAddress: string; email: string; city: string; state: string; country: string; }>({
    name: '',
    dateOfBirth: '',
    hospital: '',
    specialty: '',
    registrationNumber: '',
    identificationNumber: '',
    yearsOfExperience: '',
    gender: '',
    homeAddress: '',
    email: '',
    city: '',
    state: '',
    country: '',
    phone: '',
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
    personaldata.append("identificationNumber", personalData.identificationNumber);
    personaldata.append("hospital", personalData.hospital);
    personaldata.append("specialty", personalData.specialty);
    personaldata.append("yearsOfExperience", personalData.yearsOfExperience);
    personaldata.append("registrationNumber", personalData.registrationNumber);
    personaldata.append("gender", personalData.gender);
    personaldata.append("homeAddress", personalData.homeAddress);
    personaldata.append("email", personalData.email);
    personaldata.append("city", personalData.city);
    personaldata.append("state", personalData.state);
    personaldata.append("country", personalData.country);
    personaldata.append("phone", personalData.phone);

    setLoading(false);
  
    try {
      let record;
      console.log(personalData);
      record = await writeProfileToDwn(personalData);
  
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
        identificationNumber: '',
        hospital: '',
        specialty: '',
        yearsOfExperience: '',
        registrationNumber: '',
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
      console.log(profileData)
      const healthProtocol = profileProtocolDefinition;
      const { record, status } = await web5.dwn.records.write({
        data: profileData,
        message: {
          protocol: healthProtocol.protocol,
          protocolPath: 'doctorProfile',
          schema: healthProtocol.types.doctorProfile.schema,
          recipient: myDid,
        },
      });
      console.log(record);
      if (status === 200) {
        const { status } = await record.send(adminDid);
        console.log(status);
        return { ...profileData, recordId: record.id}
      } 
      console.log('Successfully wrote doctor details to DWN:', record);
      toast.success('Doctor Profile Details written to DWN', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });
      return record;
    } catch (err) {
      console.error('Failed to write doctor profile details to DWN:', err);
      toast.error('Failed to write doctor profile details to DWN. Please try again later.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
   }; 

  return (
    <div className="w-full md:w-3/5 flex justify-between rounded-lg border border-stroke bg-white py-7.5 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
       <div className="">
          <h4 className="text-2xl font-bold text-black dark:text-white">
            Doctor Dashboard
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
                      <h2 className="text-xl px-6.5 pt-6.5 font-semibold mb-4">Personal and Work Details</h2>
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
                          Hospital
                        </label>
                        <div className={`relative ${personalData.hospital? 'bg-light-blue' : ''}`}>
                        <input
                          type="text"
                          name="hospital"
                          required
                          value={personalData.hospital}
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
                        <div className={`relative ${personalData.specialty? 'bg-light-blue' : ''}`}>
                        <input
                          type="text"
                          name="specialty"
                          required
                          value={personalData.specialty}
                          onChange={handleInputChange}
                          placeholder="Family Medicine"
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                        </div>
                      </div>

                      <div className="w-full xl:w-3/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Registration Number
                        </label>
                        <div className={`relative ${personalData.registrationNumber? 'bg-light-blue' : ''}`}>
                        <input
                          type="text"
                          name="registrationNumber"
                          required
                          value={personalData.registrationNumber}
                          onChange={handleInputChange}
                          placeholder="SSN123456"
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                        </div>
                      </div>
                                           
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
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                    <div className="w-full xl:w-3/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Years of Experience
                        </label>
                        <div className={`relative ${personalData.yearsOfExperience ? 'bg-light-blue' : ''}`}>
                        <input
                          type="number"
                          name="yearsOfExperience"
                          value={personalData.yearsOfExperience}
                          required
                          onChange={handleInputChange}
                          placeholder="6"
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
                          placeholder="Milpitas"
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
