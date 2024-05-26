import React, { useEffect, useState } from 'react';
import { renderBarChart } from './Graphs/renderBarChart';
import { renderLineChart } from './Graphs/renderLineChart';
import { renderForecastChart } from './Graphs/renderForecastChart';
import { renderWaterfallChart } from './Graphs/renderWaterfallChart';

function DashboardComponent({ topic_id }) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [data, setData] = useState(() => {
    const savedData = sessionStorage.getItem('myData');
    return savedData ? JSON.parse(savedData) : [];
  });  
  
  // Fetch initial chat history on component mount    
  useEffect(() => {
    setData([]);
    const fetchDashboardHistory = async () => {
      try {
        const response = await fetch(`${baseURL}/api/v0/api/v1/get_graphs`, {
          method: 'POST', // Change to POST
          headers: {
            'Content-Type': 'application/json', // Set content type to JSON
          },
          body: JSON.stringify({
              "topic_key": topic_id
          }),
        });
  
        const data = await response.json();
        setData(data.graphs);
    } catch (error) {
        console.error('Error fetching dashboard history:', error);
      }
    };

    // Check if running in the browser before using sessionStorage
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('myData');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    }
    fetchDashboardHistory();
    const intervalId = setInterval(fetchDashboardHistory, 3000); // Poll every second
    return () => clearInterval(intervalId);
  }, [topic_id, baseURL]);

  useEffect(() => {
    if (Array.isArray(data)) {
      // Loop over the data and render the respective charts
      data.forEach(chartData => {
        const containerSelector = `#graph-${chartData.id}`;
        document.querySelector(containerSelector).innerHTML = '';
        if (chartData.graph === 'bar') {
          renderBarChart(chartData, containerSelector);
        } else if (chartData.graph === 'line') {
          renderLineChart(chartData, containerSelector);
        } else if (chartData.graph === 'forecast'){
          renderForecastChart(chartData, containerSelector)
        } else if (chartData.graph === 'shap'){
          renderWaterfallChart(chartData, containerSelector)
        }
      });
    }
  }, [data]);

  return (
    <div>
       <div id="tooltip" className="absolute bg-white p-2 rounded border shadow-lg" style={{ visibility: 'hidden' }}></div>
       <div className="grid grid-cols-3 gap-2 p-2">
          {/* Dynamically create containers based on the data received */}
          {data && data.length > 0 && data.map(item => (
             <div key={item.id} id={`graph-${item.id}`} className="border p-4">
                {/* This div will be the container for our D3.js graphs */}
             </div>
          ))}
       </div>
    </div>
 ); 
  
}

export default DashboardComponent;