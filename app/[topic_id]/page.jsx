"use client"

import React, { useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import DashboardComponent from '../components/DashboardComponent';
import ChatTopicHistory from '../components/ChatTopicHistory';

const Dashboard = ({ params }) => {
  useEffect(() => {
    console.log(params);
  }, [params]); // The effect runs when the component mounts and when `params` changes

  return (
    <div className='flex flex-row h-screen border'>
        <div className='bg-yellow w-1/10'><ChatTopicHistory/></div>
        <div className='bg-white w-7/10'>
         <DashboardComponent topic_id={params.topic_id} />
        </div>
      <div className='bg-white w-1/5'>
        <ChatInterface topic_id={params.topic_id} />
      </div>
    </div>
  );
};

export default Dashboard;
