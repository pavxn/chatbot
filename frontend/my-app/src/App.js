import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import FileUploader from './FileUploader.jsx'
import ChatBot from './ChatBot.jsx';
import axios from 'axios';

function App() {
  const [showChat, setShowChat] = useState(null);


  const [newFile, setNew] = useState(false);

  return (
    <div className='grid gap-8 justify-center font-mono'>
    <FileUploader showChat={showChat} setShowChat={setShowChat} setNew={setNew} newFile={newFile}/>
    {
      showChat && <ChatBot newFile={newFile}/>
    }
    </div>
  );
}

export default App;
