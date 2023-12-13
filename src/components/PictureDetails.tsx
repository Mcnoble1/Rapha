import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
const PictureDetails = () => {
  
  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState(null);

  const [usersDetails, setUsersDetails] = useState<User[]>([]);
  const [recipientDid, setRecipientDid] = useState("");
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fetchDetailsLoading, setFetchDetailsLoading] = useState(false)
  const [formData, setFormData] = useState<{ image: File | null }>({
    image: null,
  });
    // const [imageDataURL, setImageDataURL] = useState<string | null>(null);

  const [showDetails, setShowDetails] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {

    const initWeb5 = async () => {
      // @ts-ignore
      const { Web5 } = await import('@web5/api/browser');
      
      try {
        const { web5, did } = await Web5.connect({ 
          sync: '5s', 
        });
        setWeb5(web5);
        setMyDid(did);
        console.log(web5);
      } catch (error) {
        console.error('Error initializing Web5:', error);
      }
    };

    initWeb5();
    
}, []);
  
const toggleDetails = () => {
  setShowDetails((prevShowDetails) => !prevShowDetails);
};

// Get images from DWN

        // const imagerecords = await web5.dwn.records.query({
        //   from: myDid,
        //   message: {
        //     filter: {
        //       protocol: "https://shege.xyz",
        //       protocolPath: "image",
        //     },
        //   },
        // });
        // console.log('imagerecords', imagerecords);


        // imagerecords.records.forEach(async (imageRec) => {
        //   console.log('this is the each image record', imageRec);
        //   // Get the blob of the image data
        //   const imageId = imageRec.id
        //   console.log(imageId)
        //    const {record, status }= await web5.dwn.records.read({
        //     from: myDid,
        //     message: {
        //        filter: {
        //         recordId: imageId,
        //        },
        //     },
        //     });
        //   console.log ({record, status})
        //   const imageresult = await record.data.blob();
        //   console.log(imageresult)
        //   const imageid = await record.contextId;  
        //   console.log(imageid)         
        //   const imageUrl = URL.createObjectURL(imageresult);
        //   console.log(imageUrl)
        //   setImageURLs(prevImageURLs => [...prevImageURLs, imageUrl]);
        // })

const fetchPictureDetails = async () => {
  setFetchDetailsLoading(true);
  try {
    const response = await web5.dwn.records.query({
      from: myDid,
      message: {
        filter: {
            protocol: 'https://did-box.com',
            protocolPath: 'pictureDetails',
        },
      },
    });
    console.log('Picture Details:', response);

    if (response.status.code === 200) {
      const pictureDetails = await Promise.all(
        response.records.map(async (record) => {
          const data = await record.data.json();
          console.log(data);
          return {
            ...data,
            recordId: record.id,
          };
        })
      );
      setUsersDetails(pictureDetails);
      console.log(pictureDetails);
      toast.success('Successfully fetched picture details', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      setFetchDetailsLoading(false);
    } else {
      console.error('No picture details found');
      toast.error('Failed to fetch picture details', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    setFetchDetailsLoading(false);
  } catch (err) {
    console.error('Error in fetchPictureDetails:', err);
    toast.error('Error in fetchPictureDetails. Please try again later.', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
    setFetchDetailsLoading(false);
  };
};


const sharePictureDetails = async (recordId: string) => {
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
      console.log('Send record status in sharePicture', status);
      toast.success('Successfully shared picture record', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      setShareLoading(false);
      setSharePopupOpen(false);
    } else {
      console.error('No record found with the specified ID');
      toast.error('Failed to share picture record', {
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

const showDeleteConfirmation = (userId: string) => {
    setUserToDeleteId(userId);
    setDeleteConfirmationVisible(true);
  };

  const hideDeleteConfirmation = () => {
    setUserToDeleteId(null);
    setDeleteConfirmationVisible(false);
  };


const deletePictureDetails = async (recordId) => {
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
        console.log('Picture Details deleted successfully');
        toast.success('Picture Details deleted successfully', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, 
        });
        setUsersDetails(prevPictureDetails => prevPictureDetails.filter(message => message.recordId !== recordId));
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
    console.error('Error in deletePictureDetails:', error);
  }
};


  return (
    <div className="lg:mx-5 flex flex-col rounded-lg border break-words border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="flex flex-row mb-5 items-center gap-4 justify-end">
     <button 
       onClick={fetchPictureDetails}
       className=" items-center  rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover-bg-opacity-90">
       {fetchDetailsLoading ? (
         <div className="flex items-center">
           <div className="spinner"></div>
           <span className="pl-1">Fetching...</span>
         </div>
       ) : (
         <>Fetch Pictures</>
       )}           
     </button>
     <div className="relative">
       <button
         onClick={toggleDetails}
         className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
       >
         {showDetails ? 'Hide Details' : 'Show Details'}
       </button>
     </div>
   </div>
   {usersDetails.length > 0 ? (
     <div className="flex flex-row flex-wrap justify-evenly gap-2">
     {usersDetails.map((user, index) => (
     <div className="flex flex-wrap w-full" key={index}>
      <div className='w-1/2 mb-5'>
         <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
           {showDetails ? user.image : '********'}
         </h4>
         {/* <div className="w-full mb-5 text-xs text-gray-500 dark:text-gray-400">
          <Image src={imageURLs[index]} alt="campaign image" width={100} height={100} />                           
        </div>  */}
       </div>

       <div className='w-full flex flex-row justify-evenly mb-5'>
         <div className="relative">
           <button
             onClick={() => showDeleteConfirmation(user.recordId)}
             className="inline-flex items-center justify-center rounded-full bg-danger py-3 px-7 text-center font-medium text-white hover-bg-opacity-90 lg:px-8 xl:px-10"
           >
             Delete
           </button>
           {isDeleteConfirmationVisible && (
             <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
               <div className="bg-white p-5 rounded-lg shadow-md">
                 <p>Are you sure you want to delete this picture?</p>
                 <div className="mt-4 flex justify-end">
                   <button
                     onClick={hideDeleteConfirmation}
                     className="mr-4 rounded bg-primary py-2 px-3 text-white hover:bg-opacity-90"
                   >
                     Cancel
                   </button>
                   <button
                     onClick={() => {
                       hideDeleteConfirmation();
                       deletePictureDetails(user.recordId);
                     }}
                     className="rounded bg-danger py-2 px-3 text-white hover:bg-opacity-90"
                   >
                     Confirm
                   </button>
                 </div>
               </div>
             </div>
           )}
         </div>
       </div>
     </div>
     ))}
     </div>
     ) : (
       <div className="flex items-center justify-center h-48">
         <div className="text-md font-medium text-gray-500 dark:text-gray-400">
           No Details yet
         </div>
       </div>
     )}
   </div>
  );
};

export default PictureDetails;