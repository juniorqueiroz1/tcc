import axios from 'axios';

const api = axios.create({
  baseURL: 'http://138.68.56.27:3333/',
  // baseURL: 'http://localhost:3333/',
});

export default api;
