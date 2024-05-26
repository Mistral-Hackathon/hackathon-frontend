"use client"

import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

const Topics = () => {
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

  return (
    <div>
      <h1>Topics</h1>
      <ul>
        {topics.map(topic => (
          <li key={topic.id}>
            <Link legacyBehavior href={`/${topic.id}`}>
              <a>{topic.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Topics;