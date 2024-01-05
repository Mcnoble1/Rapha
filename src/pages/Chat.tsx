import { useState, useContext, useEffect } from "react";
import Breadcrumb from '../components/Breadcrumb';
import Sidebar from '../components/Sidebar';
import DoctorSidebar from '../components/DoctorSidebar';
import Header from '../components/Header';
import { Web5Context } from "../utils/Web5Context.tsx";
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 


export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { web5, myDid, userType, profileProtocolDefinition  } = useContext( Web5Context);
  const navigate = useNavigate();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const [activeRecipient, setActiveRecipient] = useState(null);

  const [receivedChats, setReceivedChats] = useState([]);
  const [sentChats, setSentChats] = useState([]);
  const [shareLoading, setShareLoading] = useState(false);

  const [noteValue, setNoteValue] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [recipientDid, setRecipientDid] = useState("");

  const [showNewChatInput, setShowNewChatInput] = useState(false);

  const allChats = [...receivedChats, ...sentChats];

  const sortedChats = allChats.sort(
    (a, b) => new Date(a.timestampWritten) - new Date(b.timestampWritten)
  );

  const groupedChats = allChats.reduce((acc, chat) => {
    const recipient = chat.sender === myDid ? chat.recipient : chat.sender;
    if (!acc[recipient]) acc[recipient] = [];
    acc[recipient].push(chat);
    return acc;
  }, {});

  // useEffect(() => {
  //   if (web5 && myDid) {
  //      fetchChats();
  //   }
  // }, []);

useEffect(() => {
  if (!web5 || !myDid) return;
  const intervalId = setInterval(async () => {
    await fetchChats();
  }, 2000);

  return () => clearInterval(intervalId);
}, [web5, myDid]);

  const constructChat = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const chat = {
      sender: myDid,
      note: noteValue,
      recipient: did,
      timestampWritten: `${currentDate} ${currentTime}`,
    };
    return chat;
  };

  const writeToDwn = async (chat) => {
    const chatProtocol = profileProtocolDefinition;
    const { record } = await web5.dwn.records.write({
      data: chat,
      message: {
        protocol: chatProtocol.protocol,
        protocolPath: "chat",
        schema: chatProtocol.types.chat.schema,
        recipient: did,
      },
    });
    return record;
  };

  const sendRecord = async (record) => {
    console.log(record);
    return await record.send(did);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!noteValue.trim()) {
      setErrorMessage('Please type a message before sending.');
      return;
    }

    const chat = constructChat();
    console.log(chat);
    const record = await writeToDwn(chat);
    console.log(record);
    const { status } = await sendRecord(record);

    console.log("Send record status", status);

    await fetchChats();
  };

  const fetchChats = async () => {
    const { records, status: recordStatus } = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: "https://rapha.com/protocol",
          protocolPath: "chat",
        },
        dateSort: "createdAscending",
      },
    });
    // console.log(records);

    try {
      const results = await Promise.all(
        records.map(async (record) => record.data.json())
      );

      if (recordStatus.code == 200) {
        const received = results.filter((result) => result?.recipient === myDid);
        // console.log(received);
        const sent = results.filter((result) => result?.sender === myDid);
        // console.log(sent)
        setReceivedChats(received);
        setSentChats(sent);
      }
    } catch (error) {
      console.error(error);
    }
  };
 
  const handleStartNewChat = () => {
    setActiveRecipient(null);
    setShowNewChatInput(true);
  };

  const handleSetActiveRecipient = () => {
    setRecipientDid(did);
    setActiveRecipient(did);
    setShowNewChatInput(false);
  };

  const handleConfirmNewChat = () => {
    setActiveRecipient(did);
    setActiveRecipient(did);
    setShowNewChatInput(false);
    if (!groupedChats[did]) {
      groupedChats[did] = [];
    }
  };

  const shareHealthDetails = async (recordId: string) => {
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


const name = urlParams.get('name')

const did = urlParams.get('did')

  

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {userType === 'patient' ? (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        ) : (
          <DoctorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <div className="mb-6 flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb pageName="Chat" />
                <div>
                  {userType === 'patient' ? (
                    <button 
                    // onClick={() => shareHealthDetails("1")}
                    className="inline-flex mr-5 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                      Share Record
                  </button>
                  ) : (
                    <button 
                    onClick={() => navigate('/doctor/patient/:id')}                      
                    className="inline-flex mr-5 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                      View Record
                  </button>
                  )}                
                </div>    
              </div>
              <div className="flex flex-col gap-10">
                

              <div className="h-screen rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex">
                  <div className=" h-screen flex-col xl:flex xl:w-1/4">
                      <div className="sticky border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                        <h3 className="text-lg font-medium text-black dark:text-white 2xl:text-xl">Active Conversations<span className="rounded-md border-[.5px] border-stroke bg-gray-2 py-0.5 px-2 text-base font-medium text-black dark:border-strokedark dark:bg-boxdark-2 dark:text-white 2xl:ml-4"></span></h3>
                      </div>
                      <div className="flex max-h-screen flex-col overflow-auto p-5">
                              <div className="bg-primary rounded-xl p-2 mb-5 text-white">
                                {Object.keys(groupedChats).map((recipient) => (
                                  <div
                                    key={recipient}
                                    className={`sidebar-item truncate ${
                                      activeRecipient === recipient ? "active" : ""
                                    }`}
                                    onClick={() => handleSetActiveRecipient(recipient)}
                                  >
                                    <h3>Dr.  {name}</h3>
                                  </div>
                                ))}
                                </div>
                                {activeRecipient === null && showNewChatInput && (
                                  <div className="">
                                    <input
                                      type="text"
                                      placeholder="Enter Recipient DID"
                                      name="recipientDid"
                                      id="recipientDid"
                                      aria-label="Recipient DID"
                                      className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                                      value={recipientDid}
                                      onChange={(e) => setRecipientDid(e.target.value)}
                                      onFocus={() => setRecipientDid("")}
                                    />
                                    <button className="bg-primary text-white rounded p-2 mb-5 mt-5" onClick={handleConfirmNewChat}>
                                      Confirm
                                    </button>
                                  </div>
                                )}
                                                         
                            </div>
                        </div>
                        
                  {/* {activeRecipient ? ( */}
                  <div className="flex h-full flex-col border-l border-stroke dark:border-strokedark xl:w-3/4">
                      <div className="sticky flex items-center justify-between border-b border-stroke px-6 py-4.5 dark:border-strokedark">
                        <div className="flex items-center">
                            <div className="mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full">
                              <img src="/assets/user-01-b007ff3f.png" alt="avatar" className="h-full w-full object-cover object-center"/></div>
                            <div>
                              <h5 className="font-medium text-black dark:text-white">Dr. {name}</h5>
                              <p className="text-sm">{userType}</p>
                            </div>
                        </div>     
                      </div>
                      <div className="no-scrollbar max-h-full space-y-3.5 overflow-auto px-6 py-7.5">
                      {sortedChats
                            .filter(
                              (chat) =>
                                chat.sender === activeRecipient ||
                                chat.recipient === activeRecipient
                            )
                            .map((chat, index) => (  
                          <div key={index} className={`max-w-125 ${chat.sender === myDid ? 'ml-auto' : ''}`}>
                            <div className={`mb-2.5 rounded-2xl py-3 px-5 ${chat.sender === myDid ? 'rounded-br-none bg-primary' : 'rounded-tl-none bg-gray dark:bg-boxdark-2'}`}>
                              <p className={`${chat.sender === myDid ? 'text-white' : ''}`}>{chat.note}</p>
                            </div>
                            <p className={`text-xs ${chat.sender === myDid ? 'text-right' : ''}`}>
                              <strong>{chat.sender === myDid ? "You" : "Recipient"}:</strong>{" "}
                              {chat.timestampWritten}
                            </p>
                        </div> 
                        ))}
                      </div>


                      <div className="sticky bottom-0 border-t border-stroke bg-white py-5 px-6 dark:border-strokedark dark:bg-boxdark">
                        <form className="flex items-center justify-between space-x-4.5">
                            <div className="relative w-full">
                              <input 
                                type="text" 
                                placeholder="Type something here" 
                                value={noteValue}
                                name="note"
                                id="note"
                                aria-label="Note"
                                onChange={(e) => {
                                setNoteValue(e.target.value);
                                if (e.target.value.trim()) {
                                  setErrorMessage("");
                                }
                              }}
                              onFocus={() => setNoteValue("")}
                                className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                              />
                            </div>
                            <button type="submit" onClick={handleSubmit} className="flex h-13 w-full max-w-13 items-center justify-center rounded-md bg-primary text-white hover:bg-opacity-90">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                              </svg>
                            </button>
                            <p
                            className="error-message"
                            style={{
                              opacity: errorMessage ? "1" : "0",
                              maxHeight: errorMessage ? "50px" : "0",
                            }}
                          >
                            {errorMessage}
                          </p>
                        </form>
                      </div>

                  </div>
                  {/* ) : (
                    <div className="flex flex-col mx-30 justify-center align-center">
                    <h3>Start a new chat or select an existing chat</h3>
                    <p>
                      Click the Add Friends + button to start a new chat. Please note
                      that chats may take awhile to render.
                    </p>
                  </div>
                  )} */}
                </div>

              </div>
              </div>
          </main>
        </div>
      </div>
    </div>
  );
}



{/* <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {userType === 'patient' ? (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        ) : (
          <DoctorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <div className="mb-6 flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb pageName="Chat" />
                <div>
                  {userType === 'patient' ? (
                    <button 
                    onClick={shareHealthDetails}
                    className="inline-flex mr-5 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                      Share Record
                  </button>
                  ) : (
                    <button 
                    onClick={() => navigate('/doctor/patient/:id')}                      
                    className="inline-flex mr-5 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                      View Record
                  </button>
                  )}                
                </div>    
              </div>
              <div className="flex flex-col gap-10">
                

              <div className="h-screen rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex">
                  <div className=" h-screen flex-col xl:flex xl:w-1/4">
                      <div className="sticky border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                        <h3 className="text-lg font-medium text-black dark:text-white 2xl:text-xl">Active Conversations<span className="rounded-md border-[.5px] border-stroke bg-gray-2 py-0.5 px-2 text-base font-medium text-black dark:border-strokedark dark:bg-boxdark-2 dark:text-white 2xl:ml-4"></span></h3>
                      </div>
                      <div className="flex max-h-screen flex-col overflow-auto p-5">
                              <div className="bg-primary rounded-xl p-2 mb-5 text-white">
                                {Object.keys(groupedChats).map((recipient) => (
                                  <div
                                    key={recipient}
                                    className={`sidebar-item truncate ${
                                      activeRecipient === recipient ? "active" : ""
                                    }`}
                                    onClick={() => handleSetActiveRecipient(recipient)}
                                  >
                                    <h3>{recipient?.slice(0, 15) + "..." + myDid?.slice(-8)}</h3>
                                  </div>
                                ))}
                                </div>
                                {activeRecipient === null && showNewChatInput && (
                                  <div className="">
                                    <input
                                      type="text"
                                      placeholder="Enter Recipient DID"
                                      name="recipientDid"
                                      id="recipientDid"
                                      aria-label="Recipient DID"
                                      className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                                      value={recipientDid}
                                      onChange={(e) => setRecipientDid(e.target.value)}
                                      onFocus={() => setRecipientDid("")}
                                    />
                                    <button className="bg-primary text-white rounded p-2 mb-5 mt-5" onClick={handleConfirmNewChat}>
                                      Confirm
                                    </button>
                                  </div>
                                )}
                                
                                <div className="absolute flex justify-center bottom-5">
                                  <button className="bg-primary text-white rounded p-2" onClick={handleStartNewChat}>
                                    <span>Add Friends +</span>
                                  </button>
                                </div>                            
                            </div>
                        </div>
                        
                  {activeRecipient ? (
                  <div className="flex h-full flex-col border-l border-stroke dark:border-strokedark xl:w-3/4">
                      <div className="sticky flex items-center justify-between border-b border-stroke px-6 py-4.5 dark:border-strokedark">
                        <div className="flex items-center">
                            <div className="mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full">
                              <img src="/assets/user-01-b007ff3f.png" alt="avatar" className="h-full w-full object-cover object-center"/></div>
                            <div>
                              <h5 className="font-medium text-black dark:text-white">{activeRecipient?.slice(0, 15) + "..." + myDid?.slice(-8)}</h5>
                              <p className="text-sm">{userType}</p>
                            </div>
                        </div>     
                      </div>
                      <div className="no-scrollbar max-h-full space-y-3.5 overflow-auto px-6 py-7.5">
                      {sortedChats
                            .filter(
                              (chat) =>
                                chat.sender === activeRecipient ||
                                chat.recipient === activeRecipient
                            )
                            .map((chat, index) => (  
                          <div key={index} className={`max-w-125 ${chat.sender === myDid ? 'ml-auto' : ''}`}>
                            <div className={`mb-2.5 rounded-2xl py-3 px-5 ${chat.sender === myDid ? 'rounded-br-none bg-primary' : 'rounded-tl-none bg-gray dark:bg-boxdark-2'}`}>
                              <p className={`${chat.sender === myDid ? 'text-white' : ''}`}>{chat.note}</p>
                            </div>
                            <p className={`text-xs ${chat.sender === myDid ? 'text-right' : ''}`}>
                              <strong>{chat.sender === myDid ? "You" : "Recipient"}:</strong>{" "}
                              {chat.timestampWritten}
                            </p>
                        </div> 
                        ))}
                      </div>


                      <div className="sticky bottom-0 border-t border-stroke bg-white py-5 px-6 dark:border-strokedark dark:bg-boxdark">
                        <form className="flex items-center justify-between space-x-4.5">
                            <div className="relative w-full">
                              <input 
                                type="text" 
                                placeholder="Type something here" 
                                value={noteValue}
                                name="note"
                                id="note"
                                aria-label="Note"
                                onChange={(e) => {
                                setNoteValue(e.target.value);
                                if (e.target.value.trim()) {
                                  setErrorMessage("");
                                }
                              }}
                              onFocus={() => setNoteValue("")}
                                className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                              />
                            </div>
                            <button type="submit" onClick={handleSubmit} className="flex h-13 w-full max-w-13 items-center justify-center rounded-md bg-primary text-white hover:bg-opacity-90">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                              </svg>
                            </button>
                            <p
                            className="error-message"
                            style={{
                              opacity: errorMessage ? "1" : "0",
                              maxHeight: errorMessage ? "50px" : "0",
                            }}
                          >
                            {errorMessage}
                          </p>
                        </form>
                      </div>

                  </div>
                  ) : (
                    <div className="flex flex-col mx-30 justify-center align-center">
                    <h3>Start a new chat or select an existing chat</h3>
                    <p>
                      Click the Add Friends + button to start a new chat. Please note
                      that chats may take awhile to render.
                    </p>
                  </div>
                  )}
                </div>

              </div>
              </div>
          </main>
        </div>
      </div>
    </div> */}