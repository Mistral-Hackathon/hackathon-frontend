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

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v0/api/v0/get_history`, {
        method: 'POST', // Assume POST is required
        headers: {
          'Content-Type': 'application/json',
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

  // Fetch and poll chat history every second
  useEffect(() => {
    fetchChatHistory();  // Call immediately on mount
    const intervalId = setInterval(fetchChatHistory, 1000);  // Set up the interval

    return () => clearInterval(intervalId);  // Clean up on component unmount
  }, [topic_id, baseURL]);  // Dependencies array, re-run if these values change

  const handleSuggestionClick = (suggestion) => {
    setUserInput(suggestion);
    setSelectedSuggestion(suggestion);
  };

  const handleSendMessage = async (e) => {
    if (e.key === 'Enter' && userInput.trim()) {
      try {
        await fetch(`${baseURL}/api/v0/api/v0/send_msg`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ human_message: userInput, topic_key: topic_id }), 
        });
        setUserInput('');

        // Optionally, trigger a refresh immediately after send
        fetchChatHistory();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const toggleSqlVisibility = (index) => {
    setVisibleSql(visibleSql === index ? null : index);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto h-9/10">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 ${msg.role === 'Human' ? 'bg-white' : 'bg-gray-100'} text-black`}>
            <div className="flex items-center justify-between">
              <span>{msg.role === 'Human' ? 'User' : msg.role}</span>
              {msg.sql && (
                <button onClick={() => toggleSqlVisibility(index)} title="Show SQL">
                  <SqlIcon />
                </button>
              )}
            </div>
            <p className="mt-2">{msg.message}</p>
            {visibleSql === index && (
              <div className="mt-2 p-2 bg-gray-200 rounded">
                <code>{msg.sql}</code>
              </div>
            )}
          </div>
        ))}
      </div>
      {suggestions.map((suggestion, index) => (
        <button key={index} onClick={() => handleSuggestionClick(suggestion)} className="m-1 p-1 border border-dashed hover:bg-blue-300">
          {suggestion}
        </button>
      ))}
      <input
        type="text"
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onKeyDown={handleSendMessage}
        placeholder="Type your message..."
        className="border p-2 mb-4"
      />
    </div>
  );
};

export default ChatInterface;