import { Web5 } from "@web5/api/browser";
import React, { useEffect, useState } from "react";

function App() {
  const [web5, setWeb5] = useState(null);
  const [did, setDid] = useState(null);
  const [input, setInput] = useState();
  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    const connectWeb5 = async () => {
      const { web5, did } = await Web5.connect();
      setWeb5(web5);
      setDid(did);
    };
    connectWeb5();
  }, []);

  useEffect(() => {
    console.log(web5);
  }, [web5]);


  const handleRecord=async ()=>{ 
  const imageblob = new Blob([input], { type: 'image/png' }); 
  const { record } = await web5.dwn.records.create({ 
    data: imageblob, 
    message: { 
      schema: "http://127.0.0.1:1000/", 
      dataFormat: 'image/png', 
    }, 

  }); 

  setInput(record); 
  console.log(record); 
 } 

 useEffect(() => { 
  const fetchImage = async () => { 
     
      const response = await web5.dwn.records.query({
        from: myDid,
        message: {
          filter: {
              // protocol: 'YOUR_PROTOCOL_NAME',
              // protocolPath: 'YOUR_PROTOCOL_IMAGE_PATH',
              schema: "http://127.0.0.1:1000/", 
              dataFormat: 'image/png',
          },
        },
      });
      console.log('Picture Details:', response);
  
    response.records.forEach( async (imageRec) => {
    console.log('this is the each image record', imageRec);
    // // Get the blob of the image data
    const imageId = imageRec.id
    console.log(imageId)
     const {record, status }= await web5.dwn.records.read({
      message: {
         filter: {
          recordId: imageId,
         },
      },
      });
    console.log ({record, status})
  
        const imageresult = await record.data.blob();
        console.log(imageresult)
        const imageUrl = URL.createObjectURL(imageresult);
        console.log(imageUrl)
        setImageURLs(prevImageURLs => [...prevImageURLs, imageUrl]);
      })
    }


  fetchImage(); 
}, []); 






  return (
    <>
    <p>{did}</p>
     <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => setInput(e.target.files[0])} 
      /> 
<button onClick={handleRecord}>Record The Image</button>
{ imageURLs.length > 0 ? (
      <div className="flex flex-col lg:flex-row justify-evenly">
      {imageURLs.map((image, index) => (
      <div className="flex w-full lg:w-2/5" key={index}>
       <div className=' mb-5'>
          <div className="w-full mb-5 text-xs text-gray-500 dark:text-gray-400">
           <img src={image} alt="image" />                           
          </div> 
        </div>
      </div>
      ))}
       </div>
      ):null }



    </>
  )
}

export default App