"use client"

import React, { useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';

const Dashboard = ({ params }) => {
  useEffect(() => {
    console.log(params);
  }, [params]); // The effect runs when the component mounts and when `params` changes

  return (
    <div className='flex flex-row h-screen border'>
      <div className='w-1/5'>
        <ChatInterface topic_id={params.topic_id} />
      </div>
    </div>
  );
};

export default Dashboard;
