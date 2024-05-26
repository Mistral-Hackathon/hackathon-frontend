import React, { useEffect, useState } from 'react';
import { renderBarChart } from './Graphs/renderBarChart';
import { renderLineChart } from './Graphs/renderLineChart';
import { renderForecastChart } from './Graphs/renderForecastChart';
import { renderWaterfallChart } from './Graphs/renderWaterfallChart';

function DashboardComponent({ chat_uuid }) {
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
          const response = await fetch(`${baseURL}/api/v1/dashboard/update_dashboard_data/${chat_uuid}`);
          const data = await response.json();
          setData(data.data);
        } catch (error) {
          console.error('Error fetching dashboard history:', error);
        }
      };
  
      fetchDashboardHistory();
    }, [chat_uuid, baseURL]);

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