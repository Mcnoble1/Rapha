import React, { useEffect, useContext, useRef, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../../components/Header';
import Sidebar from '../../components/DoctorSidebar';
import { adminDid } from "../../utils/Constants"
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import { Web5Context } from "../../utils/Web5Context.tsx";
import 'react-toastify/dist/ReactToastify.css';
import Image from '../../images/badge.png';
import '../signin.css';
import { VerifiableCredential, PresentationExchange } from "@web5/credentials";


const Credentials: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { web5, myDid } = useContext( Web5Context);

  const [signedVcJwt, setSignedVcJwt] = useState("");
let parsedVc;
  const [doctorsDetails, setDoctorsDetails] = useState<Doctor[]>([]);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [doctorToDeleteId, setDoctorToDeleteId] = useState<number | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [recipientDid, setRecipientDid] = useState("");
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
    vcJWT();
    }
  }, []);

const vcJWT = async () => {
  try {
    const response = await web5.dwn.records.query({
      from: myDid,
      message: {
        filter: {
            schema: 'LicenseCredential',
            dataFormat: 'application/vc+jwt',
        },
      },
    });
    console.log('vcJWT:', response);

    if (response.status.code === 200) {
      const jwt = await Promise.all(
        response.records.map(async (record) => {
          const data = await record.data.text();
          console.log(data);
          setSignedVcJwt(data);
          return {
            ...data,
            recordId: record.id,
          };
        })
      );        
    } else {
      console.error('No jwt details found');
    }
  } catch (err) {
    console.error('Error in fetching jwt:', err);
  };
};


// VC Presentation Exchange
if (signedVcJwt !== ""  && signedVcJwt !== undefined) {
parsedVc = VerifiableCredential.parseJwt({ vcJwt: signedVcJwt });

console.log("ParsedVC:", parsedVc);

const presentationDefinition = {
'id'                : 'presDefId123',
'name'              : 'Rapha Medical Practitioner Presentation Definition',
'purpose'           : 'for proving medical practitioner license',
'input_descriptors' : [
  {
    'id'          : 'licenseStatus',
    'purpose'     : 'is your license valid?',
    'constraints' : {
      'fields': [
        {
          'path': [
            '$.credentialSubject.licenseStatus',
          ]
        }
      ]
    }
  }
]
};

const definitionValidation = PresentationExchange.validateDefinition({ presentationDefinition });
console.log("Definition Validation:", definitionValidation);

// Does VC Satisfy the Presentation Definition

try {
  PresentationExchange.satisfiesPresentationDefinition({vcJwts: [signedVcJwt], presentationDefinition: presentationDefinition});
  console.log('\nVC Verification successful!\n');
  // usersDetails.filter((user) => user.status = 'Verified');

  toast.success('You are now a Verified Rapha Doctor', {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000, 
  });
} catch (err) {
  console.log('\nVC Verification failed: ' + err.message + '\n');
  toast.success('You are not yet verified', {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000, 
  });
}

// Create Presentation Result that contains a Verifiable Presentation and Presentation Submission
const presentationResult = PresentationExchange.createPresentationFromCredentials({vcJwts: [signedVcJwt], presentationDefinition: presentationDefinition });
console.log('\nPresentation Result: ' + JSON.stringify(presentationResult));

};


  

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <div className="mb-6 flex flex-row gap-0 lg:gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb pageName="My Verifiable Credentials" /> 
              </div>

              <div className="flex flex-row gap-10 ">
                    {parsedVc && (
                      <div className=" lg:w-2/5 rounded-2xl bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark ">
                        <div className="">
                        <div className='flex flex-row mb-1 gap-20 p-5 w-full'>
                          <div className="flex">
                            <div className="flex-shrink-0 ">
                              <img
                                src={Image}
                                alt="verified badge"
                                className="h-30 w-30 rounded-full" 
                              />
                            </div>
                          </div>
                          <div className=''>
                              <div className='mb-2 flex' >
                                <p className="text-2xl font-bold text-black dark:text-white">
                                  {parsedVc.vcDataModel.credentialSubject.specialty} 
                                </p>
                                <button className="bg-success p-1 text-white rounded-xl ml-5">{parsedVc.vcDataModel.credentialSubject.licenseStatus}</button>
                              </div>

                              <div className='flex flex-row gap-x-5 gap-y-2 flex-wrap'>

                                <div className='' >
                                  <p className="text-lg font-medium text-black dark:text-white">
                                    {parsedVc.vcDataModel.credentialSubject.hospital}
                                  </p>
                                </div>

                                

                              </div>      
                              {/* <div className="relative">

                        {doctor.status === 'Verified' ? (
                          <button
                            // onClick={() =>  togglePop(doctor.recordId)}                   
                            className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                            >
                            View
                          </button>
                        ) : null }
                          
                          </div>                     */}
                          </div> 
                      </div>
                      </div>
                      </div>

                     )}
              </div>

              </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Credentials;
