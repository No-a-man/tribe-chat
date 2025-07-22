// src/api/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://dummy-chat-server.tribechat.com/api',
});
