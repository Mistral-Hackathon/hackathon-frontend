"use client"

import { useState, useEffect } from 'react';

const SqlIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12,2C6.48,2,2,3.97,2,6v12c0,2.03,4.48,4,10,4s10-1.97,10-4V6C22,3.97,17.52,2,12,2z M12,4c4.42,0,8,1.72,8,3s-3.58,3-8,3 s-8-1.72-8-3S7.58,4,12,4z M4,18v-3c0,1.28,3.58,3,8,3s8-1.72,8-3v3c0,1.28-3.58,3-8,3S4,19.28,4,18z M12,14c4.42,0,8-1.72,8-3 s-3.58-3-8-3s-8,1.72-8,3S7.58,14,12,14z"/>
  </svg>
);

const ChatInterface = ({ topic_id }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [status, setStatus] = useState('');
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [visibleSql, setVisibleSql] = useState(null);
  const [urlMappings, setUrlMappings] = useState(new Map());

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v0/api/v0/get_history`, {
        method: 'POST', // Change to POST
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify({
            "topic_key": topic_id
        }),
      });
      const data = await response.json();
      setMessages(data.chat_history);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };
  
  // Fetch initial chat history on component mount
  useEffect(() => {
    fetchChatHistory();
  }, [topic_id, baseURL]);


  const handleSuggestionClick = (suggestion) => {
    setUserInput(suggestion);
    setSelectedSuggestion(suggestion);
  }
  
  const handleSendMessage = async (e) => {
    if (e.key === 'Enter' && userInput.trim()) {
      try {
        fetch(`${baseURL}/api/v1/chat/send_message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userInput , chat_uuid: chat_uuid}),
        });
        setUserInput('');

        // Fetching the chat history after sending message
        setTimeout(() => {
          console.log("Fetching chat messages")
          fetchChatHistory();
        }, 300);

      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const toggleSqlVisibility = (index) => {
    if (visibleSql === index) {
      setVisibleSql(null); // Hide if the same index is clicked again
    } else {
      setVisibleSql(index); // Show SQL for the clicked message
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto h-9/10">
        {messages.map((msg, index) => {
          return (
            <div key={index} className={`p-2 ${msg.role === 'Human' ? 'bg-white text-black-900' : 'bg-gray-100'} text-black`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span>{msg.role === 'Human' ? 'User' : msg.role}</span>
                </div>
                {msg.sql && (
                  <button onClick={() => toggleSqlVisibility(index)} title="Show SQL">
                    <SqlIcon />
                  </button>
                )}
              </div>
              <div className="mt-2">
                <p>{msg.message}</p>
              </div>
              <div>
                {visibleSql === index && (
                  <div className="mt-2 p-2 bg-gray-200 rounded">
                    <code>{msg.sql}</code>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
  
      {status && (<div className='flex justify-end mr-2'>{status}</div>)}
      
      {suggestions[0] && (
        <div className='h-1/20 m-2'>
            <div className="mt-2 flex justify-center">
                {suggestions.map((suggestion, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleSuggestionClick(suggestion)}
                        title={suggestion}
                        className={'p-1 m-1 border border-dashed flex items-center text-zinc-500 hover:bg-blue-300'}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
      )}
  
      <input 
        type="text" 
        value={userInput} 
        onChange={(e) => setUserInput(e.target.value)} 
        onKeyDown={handleSendMessage}
        placeholder="Type your message..."
        className="border p-2 h-1/20 mb-4"
      />
    </div>
  );  
};

export default ChatInterface;