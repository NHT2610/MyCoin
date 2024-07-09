import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:2000/blockchain',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;