/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Web5 } from "@web5/api/browser";
import { createContext, useEffect, useState } from "react";
import { adminDid } from "./Constants"
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

export const Web5Context = createContext();

const ContextProvider = ({ children }) => {
  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState(null);
  const [userType, setUserType] = useState(null);
  const [doctorList, setDoctorList] = useState([]);
  const [loadingDoctor, setLoadingDoctor] = useState(true);

  useEffect(() => {
    const connectWeb5 = async () => {
      try {
        const { web5, did } = await Web5.connect({sync: '5s'});
          setWeb5(web5);
          setMyDid(did);
          console.log(web5);
          if (web5 && did) {
            toast.success('Connected to Web5', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000, 
            });
          }
      } catch (error) {
        console.error("Error Connecting to web5 : ", error);
      }
    };

    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }

    connectWeb5();
  }, []);

  const setUserTypeAndRedirect = (type) => {
    localStorage.setItem("userType", type);
    setUserType(type);
  };

  const logout = () => {
    localStorage.removeItem("userType");
    setUserType("");
  };

  const profileProtocolDefinition = {
    protocol: "https://rapha.com/protocol",
    published: true,
    types: {
      patientProfile: {
        schema: "https://rapha.com/schemas/patientProfile",
        dataFormats: ["application/json"]
      },
      doctorProfile: {
        schema: "https://rapha.com/schemas/doctorProfile",
        dataFormats: ["application/json"]
      },
      allergyRecord: {
        schema: "https://rapha.com/schemas/allergyRecord",
        dataFormats: ["application/json"]
      },
      surgeryRecord: {
        schema: "https://rapha.com/schemas/surgeryRecord",
        dataFormats: ["application/json"]
      },
      diagnosisRecord: {
        schema: "https://rapha.com/schemas/diagnosisRecord",
        dataFormats: ["application/json"]
      },
      immunizationRecord: {
        schema: "https://rapha.com/schemas/immunizationRecord",
        dataFormats: ["application/json"]
      },
      medicalHistoryRecord: {
        schema: "https://rapha.com/schemas/medical-historyRecord",
        dataFormats: ["application/json"]
      },
      vitalSignsRecord: {
        schema: "https://rapha.com/schemas/vital-signsRecord",
        dataFormats: ["application/json"]
      }
    },
    structure: {
      patientProfile: {
        $actions: [
          { who: "anyone", can: "write" },
          { who: "recipient", of: "patientProfile", can: "read" },
          { who: "author", of: "patientProfile", can: "read"},
          { who: "author", of: "patientProfile", can: "update"}
        ],
        allergyRecord: {
          $actions: [
            { who: "recipient", of: "patientProfile", can: "write" },
            { who: "author", of: "patientProfile", can: "read" },
            { who: "author", of: "allergyRecord", can: "read"},
            // { who: "author", of: "allergyRecord", can: "update"}
          ]
        },
        surgeryRecord: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "recipient", of: "healthRecord", can: "read" },
            { who: "author", of: "healthRecord", can: "read"},
            { who: "author", of: "healthRecord", can: "update"}
          ]
        },
        diagnosisRecord: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "recipient", of: "healthRecord", can: "read" },
            { who: "author", of: "healthRecord", can: "read"},
            { who: "author", of: "healthRecord", can: "update"}
          ]
        },
        immunizationRecord: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "recipient", of: "healthRecord", can: "read" },
            { who: "author", of: "healthRecord", can: "read"},
            { who: "author", of: "healthRecord", can: "update"}
          ]
        },
        medicalHistoryRecord: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "recipient", of: "healthRecord", can: "read" },
            { who: "author", of: "healthRecord", can: "read"},
            { who: "author", of: "healthRecord", can: "update"}
          ]
        },
        vitalSignsRecord: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "recipient", of: "healthRecord", can: "read" },
            { who: "author", of: "healthRecord", can: "read"},
            { who: "author", of: "healthRecord", can: "update"}
          ]
        },
        insuranceRecord: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "recipient", of: "healthRecord", can: "read" },
            { who: "author", of: "healthRecord", can: "read"},
            { who: "author", of: "healthRecord", can: "update"}
          ]
        },
        cardiologyRecord: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "recipient", of: "healthRecord", can: "read" },
            { who: "author", of: "healthRecord", can: "read"},
            { who: "author", of: "healthRecord", can: "update"}
          ]
        },
        physicalRecord: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "recipient", of: "healthRecord", can: "read" },
            { who: "author", of: "healthRecord", can: "read"},
            { who: "author", of: "healthRecord", can: "update"}
          ]
        },
        labTestRecord: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "recipient", of: "healthRecord", can: "read" },
            { who: "author", of: "healthRecord", can: "read"},
            { who: "author", of: "healthRecord", can: "update"}
          ]
        }
      },
      doctorProfile: {
        $actions: [
          { who: "anyone", can: "write" },
          { who: "recipient", of: "doctorProfile", can: "read" },
          { who: "author", of: "doctorProfile", can: "read"},
          { who: "author", of: "doctorProfile", can: "update"}
        ],
      }
    }
  }


  useEffect(() => {
        const queryLocalProtocol = async (web5: any, url: string) => {
        return await web5.dwn.protocols.query({
        message: {
            filter: {
            protocol: "https://rapha.com",
            },
        },
        });
    };


    const queryRemoteProtocol = async (web5: any, did: string, url: string) => {
        return await web5.dwn.protocols.query({
        from: did,
        message: {
            filter: {
            protocol: "https://rapha.com",
            },
        }, 
        });
    };

    const installLocalProtocol = async (web5: any, protocolDefinition: any) => {
        return await web5.dwn.protocols.configure({
        message: {
            definition: protocolDefinition,
        },
        });
    };

    const installRemoteProtocol = async (web5: any, did: string, protocolDefinition: any) => {
        const { protocol } = await web5.dwn.protocols.configure({
        message: {
            definition: protocolDefinition,
        },
        });
        return await protocol.send(did);
    };

    const configureProtocol = async (web5, did) => {
        const protocolDefinition = profileProtocolDefinition ;
        const protocolUrl = protocolDefinition.protocol;

        const { protocols: localProtocols, status: localProtocolStatus } = await queryLocalProtocol(web5, protocolUrl);
        if (localProtocolStatus.code !== 200 || localProtocols.length === 0) {
        const result = await installLocalProtocol(web5, protocolDefinition);
        console.log({ result })
        toast.success('Protocol installed locally', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000, 
        });
        } else {
        toast.success('Protocol already installed locally', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000, 
        });
        }
        const { protocols: remoteProtocols, status: remoteProtocolStatus } = await queryRemoteProtocol(web5, did, protocolUrl);
        if (remoteProtocolStatus.code !== 200 || remoteProtocols.length === 0) {
        const result = await installRemoteProtocol(web5, did, protocolDefinition);
        console.log({ result })
        toast.success('Protocol installed remotely', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000, 
        });
        }  else {
        toast.success('Protocol already installed remotely', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000, 
        });
        }
    };

    const fetchDoctors = async () => {
      try {
        const response = await web5.dwn.records.query({
          from: adminDid,
          message: {
            filter: {
              protocol: profileProtocolDefinition.protocol,
              schema: profileProtocolDefinition.types.doctorProfile.schema,
            },
          },
        });

        if (response.status.code === 200) {
          const doctorProfile = await Promise.all(
            response.records.map(async (record) => {
              const data = await record.data.json();
              return {
                ...data,
                recordId: record.id,
              };
            })
          );
          setDoctorList(doctorProfile);
          setLoadingDoctor(false);
          return doctorProfile;
        } else {
          console.error("error fetching this profile", response.status);
          return [];
        }
      } catch (error) {
        console.error("error fetching doctor profile :", error);
      }
    };
    
    if (web5 && myDid) {
        configureProtocol(web5, myDid);
        fetchDoctors();
    }
  }, [web5, myDid]);

  const value = {
    web5,
    myDid,
    profileProtocolDefinition,
    userType,
    doctorList,
    loadingDoctor,
    setUserTypeAndRedirect,
    logout,
  };

  return (
    <div>
      <Web5Context.Provider value={value}>{children}</Web5Context.Provider>
    </div>
  );
};

export default ContextProvider;
