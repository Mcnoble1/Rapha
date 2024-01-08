import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Web5Context } from "../utils/Web5Context";
import heroImage from '../images/health.png';
import one from '../images/onee.png';
import two from '../images/two.png';
import three from '../images/three.png';
import four from '../images/four.png';
import five from '../images/five.png';
import six from '../images/six.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
const Homepage = () => {

  const { setUserTypeAndRedirect } = useContext(Web5Context);

  const navigate = useNavigate();
  
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);

  const showDeleteConfirmation = () => {
    setDeleteConfirmationVisible(true);
  };

  const hideDeleteConfirmation = () => {
    setDeleteConfirmationVisible(false);
  };


  return (
    <>
    <div className="rounded-sm bg-primary shadow-default dark:bg-boxdark">
      <div className='p-20 lg:p-0 flex w-full mb-0 flex-col lg:flex-row h-screen'>
        <div className="lg:pl-30 flex lg:w-1/2 flex-col items-center justify-center">
          <div className='text-center mb-7'>
          <p className="mb-5 text-5xl lg:text-6xl font-bold text-white dark:text-white">
            Welcome to Rapha
          </p>
          <span className="text-3xl lg:text-4xl font-medium">All Encompassing Decentralized Healthcare Platform</span>
          </div>
          <div className="flex justify-center">
          <button 
            onClick={() => showDeleteConfirmation()}
            className=" cursor-pointer rounded-lg text-2xl border border-primary bg-success p-4 text-white transition hover:bg-opacity-90"
            >
            Get Started
          </button>
          {isDeleteConfirmationVisible && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
                <div className="bg-white p-5 rounded-lg shadow-md">
                  <p>Choose your Role in the Rapha Ecosystem</p>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => {
                        hideDeleteConfirmation();
                        setUserTypeAndRedirect("patient");
                        navigate('/patient/dashboard');
                      }}
                      className="mr-4 rounded-xl bg-primary py-2 px-3 text-white hover:bg-opacity-90"
                    >
                      Patient
                    </button>
                    <button
                      onClick={() => {
                        hideDeleteConfirmation();
                        setUserTypeAndRedirect("doctor");
                        navigate('/doctor/dashboard');
                      }}
                      className="rounded-xl bg-primary py-2 px-3 text-white hover:bg-opacity-90"
                    >
                      Doctor
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>  
        </div>
        <div className="flex lg:w-1/2 items-center justify-center">
          <img src={heroImage} alt="hero" />
        </div>
      </div>

      <div className='flex w-full lg:w-[90%] lg:ml-15 pb-10 flex-col'>
        <div className="flex w-full justify-center mb-10 lg:mb-30 text-6xl font-bold text-white dark:text-white">
            What we offer
        </div>
        <div className="flex w-[90%] mx-[5%] flex-col lg:flex-row  flex-wrap">   
          <div className="flex flex-col mb-10 lg:w-1/3">
            <img src={one} alt="one" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Patients and Doctors can create, edit, share and delete their profiles securely after being onboarded into the platform.
            
            </p>            
          </div>
          <div className="flex flex-col mb-10 lg:w-1/3">
          <img src={two} alt="one" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Patients can consult with doctors, share medical records, and get prescriptions and medical certificates.
            
            </p>
          </div>
          <div className="flex flex-col lg:w-1/3">
          <img src={three} alt="one" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Secure Electronic Health Record System using Protocols that gets updated on the go.
            </p>  
          </div>
          <div className="flex flex-col mb-10 lg:w-1/3">
            <img src={four} alt="one" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Verification of the the authenticity of medical practitioners and issue a Verifiable Credential that enables them to interact with patients.
            </p>            
          </div>
          <div className="flex flex-col mb-10 lg:w-1/3">
          <img src={five} alt="one" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Real-time chat system to facilitate communication between patients and medical practitioners.
            </p>
          </div>
          <div className="flex flex-col lg:w-1/3">
          <img src={six} alt="one" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Research Labs where patients can participate in research studies and get rewarded for their participation.
            </p>  
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Homepage;

