import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Web5Context } from "../utils/Web5Context";
import heroImage from '../images/health.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
const Homepage = () => {

  const { setUserTypeAndRedirect } = useContext(Web5Context);

  const navigate = useNavigate();

  // const [selectedType, setSelectedType] = useState(null);

  // const setDoctor = () => {
  //   setSelectedType("doctor");
  // };

  // const setPatient = () => {
  //   setSelectedType("patient");
  // };
  
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

      <div className='flex w-full lg:w-[90%] pb-10 flex-col'>
        <div className="flex w-full justify-center mb-10 lg:mb-30 text-6xl font-bold text-white dark:text-white">
            Our Features
        </div>
        <div className="flex w-[90%] mx-[5%] flex-col lg:flex-row ">   
          <div className="flex flex-col mb-10 lg:w-1/3">
            <FontAwesomeIcon icon={faFileAlt} size="6x" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Create and save your (Personal, Education, Health, Social, and Professional) records in your personal Decentralized Web Node (DWN).
            Share your records and files with other users.
            </p>            
          </div>
          <div className="flex flex-col mb-10 lg:w-1/3">
            <FontAwesomeIcon icon={faVideo} size="6x" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Save your files (Documents, Images, Videos) in your personal Decentralized Web Node (DWN).
            Share your records and files with other users.
            </p>
          </div>
          <div className="flex flex-col lg:w-1/3">
            <FontAwesomeIcon icon={faPencilAlt} size="6x" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Write Letters into the Future to yourself and others.
            </p>  
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Homepage;

