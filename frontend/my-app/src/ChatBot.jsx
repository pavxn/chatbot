import React, {useEffect, useState} from "react";
import axios from "axios";
import SendImage from './send.png'
function ChatBot(props) {
    const [query, setQuery] = useState('');
    const [resp, setResp] = useState('');
    const [hist, setHist] = useState([]);

    const [chatDisabled, setChatDisabled] = useState(false);
    const [showClear, setShowClear] = useState(false)

    useEffect(() => {
        setHist([]);
        setQuery('');
    }, [props.newFile])
    async function handleQuery() {
        try{
            const encodedQuery = encodeURIComponent(query);
            setChatDisabled(true);
            //const resp = await axios.get(`https://hub.dummyapis.com/delay?seconds=1`);
            const resp = await axios.post(`http://localhost:8000/query?query=${encodedQuery}`);
            
        setResp(resp.data);
        
        setHist(prevHistory => [...prevHistory, { query ,response: resp.data }]);
        }
        catch(err) {
            console.log(err)
        }     
        
        finally {
          setQuery('')
          setChatDisabled(false);
        }
    }

    const handleChange = (event) => {
        setQuery(event.target.value);
      };
    
    return (<>
        <h2 className="py-1 text-2xl text-center">Chat</h2>
    <div className="flex flex-row justify-center">
      <input 
      className={`border-solid border-2 border-r-0 h-10 px-2 w-8/12 border-black ${chatDisabled ? 'cursor-not-allowed' : ''}`}
      type="text" id="query-field" 
      value={query} 
      onChange={handleChange}
      disabled={chatDisabled} />

      <button 
      type="button" 
      onClick={handleQuery} 
      className={`px-5 border-dashed border-2 border-l-0 pr-3 border-black  ${chatDisabled ? 'cursor-not-allowed ' : 'hover:border-solid'}`}
      disabled={chatDisabled}>
        <img src={SendImage} alt="send" /></button>

      {hist.length!==0 && <button 
      type="button"
      onClick={() => {setHist([]); setQuery('')}}
      className={`ml-4 font-bold border border-black px-3 rounded  ${chatDisabled ? 'cursor-not-allowed' : 'hover:border-l-2 hover:border-b-2'}`}
      disabled={chatDisabled}
      >Clear Chat</button> }
        
    </div>
    <div className="w-screen min-w-4.5">
        {hist.map((entry, index) => (
        <div key={index} className="flex flex-col my-5  mx-40 border border-black bg-gray-100">
          <p className="text-right py-4 pr-4  bg-[#171723] text-white">{entry.query}</p>
          <p className="text-justify py-5 my-2 px-4 w-9/12 "> {entry.response}</p>
        </div>
        
      )).reverse()}
    </div>
    </>)
}  

export default ChatBot