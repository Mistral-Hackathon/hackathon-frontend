import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';

const ChatTopicHistory = () => {
  const [topics, setTopics] = useState([]);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  
  useEffect(() => {
    axios.get(`${baseURL}/api/v0/api/v0/get_topics`)
      .then(response => {
        // Directly map the topic IDs to objects with id and name properties
        const formattedTopics = response.data.chat_topics.map(id => ({ id, name: `Topic ${id}` }));
        setTopics(formattedTopics);
      })
      .catch(error => console.error('Error fetching topics:', error));
  }, []);
  
    
  const onTopicClick = async (topicId) => {
    console.log(topicId)
    try {
      const response = await fetch(`${baseURL}/api/v1/dashboard/data_update/${topicId}`);
      if (response.ok) {
        console.log('Data update triggered successfully');
      } else {
        console.error('Failed to trigger data update');
      }
    } catch (error) {
      console.error('Error triggering data update:', error);
    }
  };


  return (
    <div className='h-screen bg-gradient-to-b from-black to-lime-900'>
      <ul className='flex flex-col'>
        {topics.map((topic) => (
          <li 
            key={topic.id} 
            className="flex items-center whitespace-nowrap overflow-hidden overflow-ellipsis pl-2 pt-3 text-white hover:bg-gray-300 h-12 text-sm"
            title={topic.name}
            onClick={() => onTopicClick(topic.id)}
          >
            <Link href={`/${topic.id}`}>{topic.name}</Link>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default ChatTopicHistory;