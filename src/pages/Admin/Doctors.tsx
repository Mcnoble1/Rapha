import React, { useEffect, useRef, useState, ChangeEvent, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../../components/Header';
import Sidebar from '../../components/AdminSidebar';
import Breadcrumb from '../../components/Breadcrumb';
import AllDoctorsTable from '../../components/AllDoctorsTable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../signin.css';

const Tables: React.FC = () => {
  const navigate = useNavigate();
  const [categoryPopupOpen, setPatientPopupOpen] = useState(false);
  const [servicePopupOpen, setServicePopupOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [categories, setPatients] = useState<Patient[]>([]); // State to store categories


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


  const trigger = useRef<HTMLDivElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
              </div>
              <div className="flex flex-col gap-10">
                <AllDoctorsTable />
              </div>
              </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Tables;
