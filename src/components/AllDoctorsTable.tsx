import React, { useState, useRef, useEffect, useContext, ChangeEvent } from 'react';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { Web5Context } from "../utils/Web5Context.tsx";
import { VerifiableCredential } from "@web5/credentials";
import { DidKeyMethod } from '@web5/dids';

const DoctorsTable: React.FC = () => {

  const { web5, myDid } = useContext( Web5Context);

  const [doctorsDetails, setDoctorsDetails] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isRevokeConfirmationVisible, setRevokeConfirmationVisible] = useState(false);
  const [doctorToRevokeId, setDoctorToRevokeId] = useState<number | null>(null);
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
  const [loading, setLoading] = useState(false);
  const [popupOpenMap, setPopupOpenMap] = useState<{ [key: number]: boolean }>({});
  const [issueVCOpenMap, setIssueVCOpenMap] = useState<{ [key: number]: boolean }>({});
  const [vcData, setVcData] = useState<{ specialty: string, hospital: string, licenseStatus: string; }>({
    specialty: "",
    hospital: "",
    licenseStatus: "",
  });

  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null); 
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

const togglePop = (doctorId: string) => {
  setIssueVCOpenMap((prevMap) => ({
    ...prevMap,
    [doctorId]: !prevMap[doctorId],
  }));
};

const closePop = (doctorId: string) => {
setIssueVCOpenMap((prevMap) => ({
  ...prevMap,
  [doctorId]: false,
}));
};

useEffect(() => {
  if (web5 && myDid) {
  fetchHealthDetails();
  }
} , [web5, myDid]);

const fetchHealthDetails = async () => {
  setFetchDetailsLoading(true);
  try {
    const response = await web5.dwn.records.query({
      from: myDid,
      message: {
        filter: {
            protocol: 'https://rapha.com/protocol',
            protocolPath: 'doctorProfile',
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

  setVcData((prevFormData) => ({
    ...prevFormData,
    [name]: value,
  }));

  const file = e.target.files?.[0];

  if (file) {
    setSelectedFileName(file.name);
  } 
};

// const issueVC = async (recordId) => {

//   const raphaDid = await DidKeyMethod.create();
//   const doctorDid = await DidKeyMethod.create();

//   const vc = await VerifiableCredential.create({
//     type: 'LicenseCredential',
//     issuer: raphaDid.did,
//     subject: doctorDid.did,
//     data: {
//         "specialty": "Cardiologist",
//         "licenseStatus": "Valid"
//     }
//   });

// console.log(vc);

// const signedLicenseJWT = await vc.sign({ did: raphaDid });

// console.log(signedLicenseJWT);

// const { record } = await web5.dwn.records.create({
//   data: signedLicenseJWT,
//   message: {
//     schema: 'EmploymentCredential',
//     dataFormat: 'application/vc+jwt',
//   },
// });

// // (optional) immediately send record to users remote DWNs
// const { status } = await record.send(myDid);

// console.log(doctorsDetails)
// doctorsDetails.filter((doctor) => doctor.recordId === recordId)[0].status = 'Verified';
// setDoctorsDetails(doctorsDetails);
// console.log(doctorsDetails)

// updateHealthDetails(recordId, doctorsDetails.filter((doctor) => doctor.recordId === recordId)[0]);

// };

const showRevokeConfirmation = (doctorId: string) => {
    setDoctorToRevokeId(doctorId);
    setRevokeConfirmationVisible(true);
  };

  const hideRevokeConfirmation = () => {
    setDoctorToRevokeId(null);
    setRevokeConfirmationVisible(false);
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
        setDoctorsDetails(prevHealthDetails => prevHealthDetails.map(message => message.recordId === recordId ? { ...message, ...data } : message));
        setUpdateLoading(false);
        // updateResult.send(doctorDid);
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
        setDoctorsDetails(prevHealthDetails => prevHealthDetails.filter(message => message.recordId !== recordId));
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


 
  const formatDatetime = (datetimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(datetimeString).toLocaleDateString(undefined, options);
    return formattedDate;
  };


  const toggleSortDropdown = () => {
    setSortDropdownVisible(!sortDropdownVisible);
  };

  const handleSort = (option: string) => {
    let sortedData = [...doctorsDetails];
    if (option === 'Verified') {
      sortedData.filter((doctor) => doctor.status === 'Verified');
    } else if (option === 'Unverified') {
      sortedData.filter((doctor) => doctor.status === 'Unverified');
    } 
    setDoctorsDetails(sortedData);
    setSortOption(option);
    setSortDropdownVisible(false);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
       <div className="flex flex-row justify-between">
      <h4 className="text-title-sm mb-4 font-semibold text-black dark:text-white">
        Doctors
     </h4>
     <div className="hidden sm:block flex flex-row justify-center">
        </div>
      <div className="flex gap-2">
        <div className="relative">
          <button
            onClick={toggleSortDropdown}
            className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Filter
          </button>
          {sortDropdownVisible && (
            <div className="absolute top-12 left-0 bg-white border border-stroke rounded-b-sm shadow-lg dark:bg-boxdark">
              <ul className="py-2">
                <li
                  onClick={() => handleSort('Verified')}
                  className={`cursor-pointer px-4 py-2 ${
                    sortOption === 'Verified' ? 'bg-primary text-white' : ''
                  }`}
                >
                  Verified
                </li>
                <li
                  onClick={() => handleSort('Unverified')}
                  className={`cursor-pointer px-4 py-2 ${
                    sortOption === 'Unverified' ? 'bg-primary text-white' : ''
                  }`}
                >
                  Unverified
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      </div>
      <div className="flex flex-col overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-stroke dark:bg-meta-4">
              {/* Header cells */}
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Doctors Image</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Doctor Name</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Specialization</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Gender</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Status</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text left uppercase">Joined On</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table body */}
            {doctorsDetails.map((doctor, index) => (
              <tr key={doctor.recordId} className={`border-b border-stroke dark:border-strokedark ${index === 0 ? 'rounded-t-sm' : ''}`}>
                <td className="p-2.5 xl:p-5">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 ">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="h-12 w-12 rounded-full" // Add a class to control the image size
                      />
                    </div>
                  </div>
                </td>                
                <td className="p-2.5 xl:p-5 ">{doctor.name}</td>                
                <td className="p-2.5 xl:p-5 ">{doctor.specialty}</td>
                <td className="p-2.5 xl:p-5 ">{doctor.gender}</td>
                <td className="p-2.5 xl:p-5"><span className={` ${doctor.status === 'Verified' ? 'bg-success' : 'bg-warning'} p-2 text-white rounded-xl`}>{doctor.status}</span></td>
                <td className="p-2.5 xl:p-5 ">{doctor.timestamp}</td>
                <td className="p-2.5 xl:p-5 ">
                  <div className="flex flex-row gap-4">

                  {doctor.status === 'Verified' ? (
                    <button 
                        onClick={() => showRevokeConfirmation(doctor.recordId)}                      
                        className="rounded bg-danger py-2 px-3 text-white hover:bg-opacity-90">
                      Revoke
                    </button>
                    ) : (
                    <button 
                        onClick={() => togglePopup(doctor.recordId)}                      
                        className="rounded bg-primary py-2 px-3 text-white hover:bg-opacity-90">
                      Verify
                    </button>
                    )}
                     {isRevokeConfirmationVisible && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
                        <div className="bg-white p-5 rounded-lg shadow-md">
                          <p>Are you sure you want to revoke the credential?</p>
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={hideRevokeConfirmation}
                              className="mr-4 rounded bg-primary py-2 px-3 text-white hover:bg-opacity-90"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                hideRevokeConfirmation();
                                // deleteHealthDetails(doctor.recordId);
                              }}
                              className="rounded bg-danger py-2 px-3 text-white hover:bg-opacity-90"
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {popupOpenMap[doctor.recordId] && (
                            <div
                              ref={popup}
                              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                            >
                              <div
                                  className="bg-white lg:mt-15 lg:w-[70%] rounded-lg pt-3 px-4 shadow-md"
                                  style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll' }}
                                >              
                                    <div className="flex flex-row justify-between">
                                    <h2 className="text-xl text-black font-semibold mb-4">Doctor Details</h2>
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => closePopup(doctor.recordId)}
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
                                                        Specialty
                                                      </label>
                                                      <div className={`relative ${vcData.specialty ? 'bg-light-blue' : ''}`}>
                                                      <select
                                                          name="specialty"
                                                          value={vcData.specialty}
                                                          onChange={handleInputChange}
                                                          required
                                                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary">
                                                          <option value="">Select Specialty</option>                        
                                                          <option value="Family Medicine">Family Medicine</option>
                                                          <option value="General Medicine">General Medicine</option>
                                                          <option value="Internal Medicine">Internal Medicine</option>
                                                          <option value="Emergency Medicine">Emergency Medicine</option>
                                                          <option value="Preventive Medicine">Preventive Medicine</option>
                                                          <option value="Occupational Medicine">Occupational Medicine</option>
                                                          <option value="Pediatrics">Pediatrics</option>
                                                          <option value="Psychiatry">Psychiatry</option>
                                                          <option value="Surgery">Surgery</option>
                                                          <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
                                                          <option value="Neurology">Neurology</option>
                                                          <option value="Cardiology">Cardiology</option>
                                                          <option value="Dermatology">Dermatology</option>
                                                          <option value="Ophthalmology">Ophthalmology</option>
                                                          <option value="Orthopedics">Orthopedics</option>
                                                          <option value="Otolaryngology">Otolaryngology</option>
                                                          <option value="Urology">Urology</option>
                                                          <option value="Radiology">Radiology</option>
                                                          <option value="Anesthesiology">Anesthesiology</option>
                                                          <option value="Pathology">Pathology</option>
                                                          <option value="Medical Genetics">Medical Genetics</option>
                                                          <option value="Public Health">Public Health</option>
                                                          <option value="Nursing">Nursing</option>
                                                          <option value="Physiotherapy">Physiotherapy</option>
                                                          <option value="Dentistry">Dentistry</option>
                                                          <option value="Nutrition">Nutrition</option>
                                                          <option value="Veterinary Medicine">Veterinary Medicine</option>
                                                          <option value="Other">Other</option>
                                                        </select> 
                                                      </div>
                                                    </div>

                                                    <div className="w-full xl:w-3/5">
                                                      <label className="mb-2.5 block text-black dark:text-white">
                                                        Hospital
                                                      </label>
                                                      <div className={`relative ${vcData.hospital ? 'bg-light-blue' : ''}`}>
                                                      <input
                                                        type="text"
                                                        name="hospital"
                                                        required
                                                        value={vcData.hospital}
                                                        onChange={handleInputChange}
                                                        placeholder="John Doe"
                                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                                      </div>
                                                    </div>

                                                    <div className="w-full xl:w-3/5">
                                                      <label className="mb-2.5 block text-black dark:text-white">
                                                        License Status
                                                      </label>
                                                      <div className={`relative ${vcData.licenseStatus? 'bg-light-blue' : ''}`}>
                                                      <input
                                                        type="text"
                                                        name="licenseStatus"
                                                        required
                                                        value={vcData.licenseStatus}
                                                        onChange={handleInputChange}
                                                        placeholder="John Hopkins"
                                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                                      </div>
                                                    </div>
                                                   </div>    
                                                  </div>
                                                  </form>
                                                <button
                                                  type="button"
                                                  // onClick={() => updateHealthDetails(doctor.recordId, vcData)}
                                                  onClick={() => issueVC(doctor.recordId)}
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
                                </div>
                            </div>
                          )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorsTable;
