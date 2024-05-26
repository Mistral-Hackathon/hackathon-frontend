import axios from 'axios';

const API_BASE_URL = 'http://localhost:8003/api/v0';

export const getTopics = async () => {
  const response = await axios.get(`${API_BASE_URL}/get_topics`);
  return response.data;
};

export const getHistory = async (topicKey) => {
  const response = await axios.post(`${API_BASE_URL}/get_history`, { topic_key: topicKey });
  return response.data;
};

export const sendMessage = async (topicKey, message) => {
  const response = await axios.post(`${API_BASE_URL}/send_msg`, {
    topic_key: topicKey,
    human_message: message,
  });
  return response.data;
};

export const createTopic = async () => {
  const response = await axios.post(`${API_BASE_URL}/create_topic`);
  return response.data;
};
