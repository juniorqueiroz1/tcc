import axios from 'axios';

const api = axios.create({
  baseURL: 'http://142.93.18.17:3333/',
  // baseURL: 'http://localhost:3333/',
});

export default api;
