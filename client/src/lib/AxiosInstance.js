import axios from 'axios';
import {BASE_URL, } from 'lib/constants'


const AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000
  /* other custom settings */
});



export default AxiosInstance;
