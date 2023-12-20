/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Web5 } from "@web5/api/browser";
import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

export const Web5Context = createContext();

const ContextProvider = ({ children }) => {
  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState(null);

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
    connectWeb5();
  }, []);

  const profileProtocolDefinition = {
      protocol: "https://rapha.com",
      published: true,
      types: {
        patientProfile: {
          schema: "https://rapha.com/patientProfile",
          dataFormats: ["application/json"],
        },
        doctorProfile: {
          schema: "https://rapha.com/doctorProfiles",
          dataFormats: ["application/json"],
        },
        medicalRecords: {
          schema: "https://rapha.com/medicalRecord",
          dataFormats: ["application/json"],
        },
        bookAppointment: {
          schema: "https://rapha.com/appointment",
          dataFormats: ["application/json"],
        },
      },
      structure: {
        medicalRecords: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "recipient", of: "medicalRecords", can: "read" },
          ],
        },
        patientProfile: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "recipient", of: "patientProfile", can: "read" },
          ],
        },
        doctorProfile: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "anyone", can: "read" },
          ],
        },
        bookAppointment: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "recipient", of: "bookAppointment", can: "read" },
          ],
        },
      },
  };


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
    
    if (web5 && myDid) {
        configureProtocol(web5, myDid);;
    }
  }, [web5, myDid]);

  const value = {
    web5,
    myDid,
    profileProtocolDefinition,
  };

  return (
    <div>
      <Web5Context.Provider value={value}>{children}</Web5Context.Provider>
    </div>
  );
};

export default ContextProvider;
