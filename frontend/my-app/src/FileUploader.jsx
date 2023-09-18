import React, { useState } from 'react';
import axios from 'axios';
function FileUploader({showChat, setShowChat, setNew, newFile}) {
  const [pdf, setPdf] = useState(null);

  return (
    <div className='flex flex-col items-center'>
        <h1 className='text-3xl py-7 text-center'>Upload a File</h1>
    <div className='py-2'>
      <input className='px-1 ' type="file" id='pdfIn' accept=".pdf"/>
      <button type='button' className='bg-transparent hover:bg-black text-black font-semibold hover:text-white py-1 px-4 border border-black hover:border-transparent rounded' 
      onClick={ async function () {
        const form = new FormData();
        await setPdf(document.getElementById("pdfIn").files[0]);
        form.append('file', pdf);     
        
        try {
            const response = await axios.post('http://localhost:8000/upload', form, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            setShowChat(true);
        setNew(!newFile);
          } catch (error) {
            console.log(error);
            
          } 
          
      }}>Submit</button> 
      </div>
    </div>
  );
}

export default FileUploader;
