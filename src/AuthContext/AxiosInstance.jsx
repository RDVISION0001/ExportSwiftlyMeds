import axios from "axios";


const axiosInstance = axios.create({

    // Production Env
  // baseURL: 'https://backend.rdvision.in',

  // UAT Env
  baseURL: 'https://uatbackend.rdvision.tech',

  // For Backend Env
  // baseURL:'http://localhost:8080'
});


//Add a request interceptor

axiosInstance.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem('jwtToken');
        if(token){
            config.headers['Authrization'] = `bearer ${token}`;
        } else {
            console.warn('No token found in localStorage');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;